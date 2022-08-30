import { withFilter } from 'graphql-subscriptions';
import { Post } from '@prisma/client';

import { prisma } from '../server';
import { consoleError, fixPosts, formatErrors, getUserRelations, GPostExtra } from '../utils';
import type { QueryGetPostsWeightedArgs, Resolvers, Post as GPost } from '../schema/generated';
import { Context, Context2 } from '../types';
import { NEW_POST, NEW_POSTS, pubsub } from '../pubsub';
import { permPostNotAuthor } from '../permissions';

/*

    - While user is at the top of page (normal):
        - Timeline keeps refreshing (not just at top) to fit in new posts
    - While user is at the top of page (chronological):
        - Timeline keeps refreshing with new posts at top
    - While user is scrolling
        - Timeline static but button at the side active when new posts available on click
        - *MAYBE* not-static on chronological, but only if it's easy to keep scroll position while new posts are loading
            - Probably not actually, would get problematic with the hard-50-limit
    - While new posts are showing, # of posts on timeline ALWAYS limited to 50

*/

// Balanced (similar to Reddit)

const hourMs = 1000 * 60 * 60;
const postWeightAlgorithm = (post: GPostExtra, nowTimestamp): number => {
    const { numLikes, createdAt, relation: { areFriends, compatibility } } = post;
    let postWeight = (1 + numLikes) * (areFriends ? 10 : 1);
    if (compatibility !== 0) {
        const mult = compatibility > 0 ? 1 : -1; // Reduction when compatibility is negative
        postWeight = postWeight + postWeight * mult * Math.log10(Math.abs(compatibility));
    }
    const elapsedHours = (nowTimestamp - createdAt) / hourMs;
    postWeight = postWeight - Math.pow(elapsedHours, 1.5);
    return postWeight;
};

// const cursor = args?.cursor;

const getPostsWeighted = async (_parent, args: Partial<QueryGetPostsWeightedArgs>, { userCore }: Context | Context2) => {
    const { id: meId, universityId } = userCore;

    let posts = fixPosts(
        await prisma.post.findMany({
            where: { universityId },
            // where: { authorId: { in: userIds } },
            include: {
                author: {
                    include: {
                        relations1: { where: { user2Id: meId }, take: 1 },
                        relations2: { where: { user1Id: meId }, take: 1 },
                    },
                },
                reactions: { include: { users: { where: { userId: meId } } } },
                comments: { include: { author: true, reactions: { include: { users: { where: { userId: meId } } } } } },
            },
            orderBy: { createdAt: 'desc' },
            take: 30,
        }),
        meId
    );

    const nowTimestamp = +new Date();
    const cachedWeights: { [key: string | number]: number } = {};
    posts = posts.sort((a, b) => {
        let aWeight = cachedWeights[a.id];
        let bWeight = cachedWeights[b.id];
        if (!aWeight) {
            aWeight = postWeightAlgorithm(a, nowTimestamp);
            cachedWeights[a.id] = aWeight;
        }
        if (!bWeight) {
            bWeight = postWeightAlgorithm(b, nowTimestamp);
            cachedWeights[b.id] = bWeight;
        }
        if (bWeight > aWeight) return 1;
        if (aWeight > bWeight) return -1;
        return 0;
    });

    return { id: 1, posts };
};

let freshPosts = [];
let changedPostsMap = {};
const postFrequency = 200;
setInterval(() => {
    const numChangedPosts = Object.keys(changedPostsMap).length;
    if (freshPosts.length === 0 && numChangedPosts === 0) return;
    const usePosts = [...freshPosts];
    freshPosts = [];
    // console.log(changedPostsMap);
    const useIds = Object.assign({ ...changedPostsMap }, ...usePosts.map(post => ({ [post.id]: true })));
    changedPostsMap = {};
    pubsub.publish(NEW_POSTS, {
        posts: usePosts,
        postIds: useIds,
        numChangedPosts,
    });
}, postFrequency);

type PostsPayload = { posts: Post[]; postIds: Record<string | number, boolean>, numChangedPosts: number };

const resolvers: Resolvers = {
    Subscription: {
        newPosts: {
            // Resolve only runs if filter passes
            resolve: (async (payload: PostsPayload, _, context: Context2) => {
                const { posts: newPosts, postIds: newPostIds, numChangedPosts } = payload;
                if (newPosts.length === 0 && numChangedPosts === 0) return null;

                const { posts: userPosts } = await getPostsWeighted(payload, _, context);

                let hasNewPost = false;
                for (const userPost of userPosts) {
                    if (newPostIds[userPost.id]) {
                        hasNewPost = true;
                        break;
                    }
                }

                // console.log(hasNewPost, newPostIds, userPosts);

                if (hasNewPost === false) {
                    console.log('No fresh posts for user', context.userCore.username);
                    return null;
                }

                return userPosts;
            }) as any,
            subscribe: withFilter(
                () => pubsub.asyncIterator(NEW_POSTS),
                (_payload, _args, _context: Context2) => true
                // permPostNotAuthor
                // permPostNotAuthor.chainResolver((payload, variables, context) => true)
            ) as any,
        },
        newPost: {
            // Resolve only runs if filter passes
            resolve: (payload, _, _context: Context2) => payload.post,
            subscribe: withFilter(
                () => pubsub.asyncIterator(NEW_POST),
                (_payload, _args, _context: Context2) => true
            ) as any,
        },
    },
    Query: {
        // getPost: async (_parent, { id }) => {
        //     return fixPosts(await prisma.post.findUnique({
        //         where: { id },
        //         include: { author: true },
        //     }));
        // },
        // getPosts: async (_parent, { limit }, { userCore }: Context) => {
        //     const { universityId } = userCore;
        //     return prisma.post.findMany({
        //         where: { universityId },
        //         include: { author: true },
        //         orderBy: { createdAt: 'desc' },
        //         take: limit ?? undefined,
        //     });
        // },
        getPostsFromUser: async (_parent, { userId, limit }, { userCore }: Context) => {
            console.log('Received request for getPostsFromUser:', userId, limit);
            const { id: meId, universityId } = userCore;

            const posts = fixPosts(
                await prisma.post.findMany({
                    where: { authorId: userId, universityId },
                    include: {
                        author: true,
                        reactions: { include: { users: { where: { userId: meId } } } },
                        comments: { include: { author: true, reactions: { include: { users: { where: { userId: meId } } } } } },
                    },
                    orderBy: { createdAt: 'desc' },
                    take: limit ?? undefined,
                }),
                meId
            );

            return posts;
        },
        // getPostsFromFriends: async (_parent, { cursor }, { userCore }: Context) => {
        //     const { id: meId, universityId } = userCore;

        //     const userIds = [meId, ...(await getUserRelations(meId, '"areFriends" = true')).map(data => data.user.id)];
        //     const posts = await prisma.post.findMany({
        //         where: { authorId: { in: userIds }, universityId },
        //         include: { author: true },
        //         orderBy: { createdAt: 'desc' },
        //         take: 50,
        //     });

        //     return posts;
        // },
        getPostsWeighted: async (_parent, args, context: Context) => {
            console.log('Received request for getPostsWeighted:', args);
            return getPostsWeighted(_parent, args, context);
        },
    },
    Mutation: {
        sendPost: async (_parent, { text, studentsOnly }, { userCore }: Context) => {
            try {
                const { id: meId, universityId } = userCore;
                console.log('Received request for sendPost:', text);

                if (text.trim().length === 0) throw new Error('Post must have text');

                const post = fixPosts(
                    await prisma.post.create({
                        data: { authorId: meId, text, universityId, studentsOnly },
                        include: {
                            author: true,
                            reactions: { include: { users: { where: { userId: meId } } } },
                            comments: { include: { author: true, reactions: { include: { users: { where: { userId: meId } } } } } },
                        },
                    }),
                    meId
                );

                const pubsubPost = { ...post, createdAt: +post.createdAt }; // May need updatedAt?
                freshPosts.push(pubsubPost);

                return {
                    ok: true,
                    post,
                };
            } catch (err) {
                consoleError('ADD_POST', err);
                return {
                    ok: false,
                    errors: formatErrors(err),
                };
            }
        },
        like: async (_parent, { id, onType, remove }, { userCore }: Context) => {
            try {
                const { id: meId, universityId } = userCore;
                console.log('Received request for likePost:', id, onType, remove);
                let post: GPost;

                if (onType === 'post') {
                    if (remove) {
                        const rawPost = await prisma.postReaction.update({
                            select: {
                                post: {
                                    include: {
                                        author: true,
                                        reactions: { include: { users: { where: { userId: meId } } } },
                                        comments: {
                                            include: { author: true, reactions: { include: { users: { where: { userId: meId } } } } },
                                        },
                                    },
                                },
                            },
                            where: { postId_type: { postId: id, type: 'like' } },
                            data: {
                                num: { decrement: 1 },
                                users: {
                                    delete: {
                                        postId_type_userId: { postId: id, type: 'like', userId: meId },
                                    },
                                },
                            },
                        });
                        changedPostsMap[id] = true;
                        post = fixPosts(rawPost.post, meId);
                    } else {
                        const rawPost = await prisma.postReaction.upsert({
                            select: {
                                post: {
                                    include: {
                                        author: true,
                                        reactions: { include: { users: { where: { userId: meId } } } },
                                        comments: {
                                            include: { author: true, reactions: { include: { users: { where: { userId: meId } } } } },
                                        },
                                    },
                                },
                            },
                            where: { postId_type: { postId: id, type: 'like' } },
                            update: {
                                num: { increment: 1 },
                                users: {
                                    create: {
                                        userId: meId,
                                    },
                                },
                            },
                            create: {
                                postId: id,
                                type: 'like',
                                num: 1,
                                users: {
                                    create: {
                                        userId: meId,
                                    },
                                },
                            },
                        });
                        changedPostsMap[id] = true;
                        post = fixPosts(rawPost.post, meId);
                    }
                }

                return {
                    ok: true,
                    post,
                };
            } catch (err) {
                consoleError('LIKE', err);
                return {
                    ok: false,
                    errors: formatErrors(err),
                };
            }
        },
        comment: async (_parent, { id, onType, text }, { userCore }: Context) => {
            try {
                const { id: meId, universityId } = userCore;
                console.log('Received request for comment:', id, onType, text);
                if (text.trim().length === 0) throw new Error('Comment must have text');
                let post: GPost;

                if (onType === 'post') {
                    const rawPost = await prisma.post.update({
                        include: {
                            author: true,
                            reactions: { include: { users: { where: { userId: meId } } } },
                            comments: {
                                include: { author: true, reactions: { include: { users: { where: { userId: meId } } } } },
                            },
                        },
                        where: { id },
                        data: {
                            comments: {
                                create: {
                                    authorId: meId,
                                    text,
                                },
                            },
                        },
                    });
                    changedPostsMap[id] = true;
                    post = fixPosts(rawPost, meId);
                }

                return {
                    ok: true,
                    post,
                };
            } catch (err) {
                consoleError('COMMENT', err);
                return {
                    ok: false,
                    errors: formatErrors(err),
                };
            }
        },
    },
    Post: {
        // author: async ({ id: postId }, args) => {
        //     const thisPost = await prisma.post.findUnique({
        //         where: { id: postId },
        //         select: {
        //             author: true,
        //         },
        //     });
        //     return thisPost!.author;
        // },
        // savedBy: async ({ id: postId }, { limit }) => {
        //     const thisPost = await prisma.post.findUnique({
        //         where: { id: postId },
        //         select: {
        //             savedBy: { take: limit ?? undefined },
        //         },
        //     });
        //     return thisPost?.savedBy ?? null;
        // },
    },
};

export default resolvers;

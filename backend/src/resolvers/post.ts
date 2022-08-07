import { withFilter } from 'graphql-subscriptions';
import { Post } from '@prisma/client';

import { prisma } from '../server';
import { consoleError, fixPosts, formatErrors, getUserRelations } from '../utils';
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

const getPostsWeighted = async (_parent, args: Partial<QueryGetPostsWeightedArgs>, { userCore }: Context | Context2) => {
    const cursor = args?.cursor;
    const { id: meId, universityId } = userCore;

    // const friendIds = [meId, ...(await getUserRelations(meId, '"areFriends" = true')).map(data => data.user.id)];
    const posts = fixPosts(
        await prisma.post.findMany({
            where: { universityId },
            // where: { authorId: { in: userIds } },
            include: {
                author: true,
                reactions: { include: { users: { where: { userId: meId } } } },
                comments: { include: { author: true, reactions: { include: { users: { where: { userId: meId } } } } } },
            },
            orderBy: { createdAt: 'desc' },
            take: 30,
        }),
        meId
    );

    return { id: 1, posts };
};

let freshPosts = [];
const postFrequency = 200;
setInterval(() => {
    if (freshPosts.length === 0) return;
    const usePosts = [...freshPosts];
    freshPosts = [];
    const useIds = Object.assign({}, ...usePosts.map(post => ({ [post.id]: true })));
    pubsub.publish(NEW_POSTS, {
        posts: usePosts,
        postIds: useIds,
    });
}, postFrequency);

type PostsPayload = { posts: Post[]; postIds: Record<string | number, boolean> };

const resolvers: Resolvers = {
    Subscription: {
        newPosts: {
            // Resolve only runs if filter passes
            resolve: (async (payload: PostsPayload, _, context: Context2) => {
                const { posts: newPosts, postIds: newPostIds } = payload;
                if (newPosts.length === 0) return null;

                const { posts: userPosts } = await getPostsWeighted(payload, _, context);

                let hasNewPost = false;
                for (const userPost of userPosts) {
                    if (newPostIds[userPost.id]) {
                        hasNewPost = true;
                        break;
                    }
                }

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

                if (text.trim().length === 0) {
                    throw new Error('Post must have text');
                }

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
                        post = fixPosts(rawPost.post, meId);
                    }
                }

                return {
                    ok: true,
                    post,
                };
            } catch (err) {
                consoleError('LIKE_POST', err);
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

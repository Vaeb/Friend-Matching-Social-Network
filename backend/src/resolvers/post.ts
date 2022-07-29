import { withFilter } from 'graphql-subscriptions';
import { Post } from '@prisma/client';

import { prisma } from '../server';
import { consoleError, formatErrors, getUserRelations } from '../utils';
import type { QueryGetPostsWeightedArgs, Resolvers } from '../schema/generated';
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
    const { id: meId } = userCore;

    // const friendIds = [meId, ...(await getUserRelations(meId, '"areFriends" = true')).map(data => data.user.id)];
    const posts = await prisma.post.findMany({
        // where: { creatorId: { in: userIds } },
        include: { creator: true },
        orderBy: { createdAt: 'desc' },
        take: 50,
    });

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

type PostsPayload = { posts: Post[], postIds: Record<string | number, boolean> };

const resolvers: Resolvers = {
    Subscription: {
        newPosts: { // Resolve only runs if filter passes
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
        newPost: { // Resolve only runs if filter passes
            resolve: (payload, _, _context: Context2) => payload.post,
            subscribe: withFilter(
                () => pubsub.asyncIterator(NEW_POST),
                (_payload, _args, _context: Context2) => true
            ) as any,
        },
    },
    Query: {
        getPost: async (_parent, { id }) => {
            return prisma.post.findUnique({
                where: { id },
                include: { creator: true },
            });
        },
        getPosts: async (_parent, { limit }) => {
            return prisma.post.findMany({
                include: { creator: true },
                orderBy: { createdAt: 'desc' },
                take: limit ?? undefined,
            });
        },
        getPostsFromUser: async (_parent, { userId, limit }) => {
            const posts = await prisma.post.findMany({
                where: { creatorId: userId },
                include: { creator: true },
                orderBy: { createdAt: 'desc' },
                take: limit ?? undefined,
            });

            return posts;
        },
        getPostsFromFriends: async (_parent, { cursor }, { userCore }: Context) => {
            const { id: meId } = userCore;

            const userIds = [meId, ...(await getUserRelations(meId, '"areFriends" = true')).map(data => data.user.id)];
            const posts = await prisma.post.findMany({
                where: { creatorId: { in: userIds } },
                include: { creator: true },
                orderBy: { createdAt: 'desc' },
                take: 50,
            });

            return posts;
        },
        getPostsWeighted: getPostsWeighted,
    },
    Mutation: {
        sendPost: async (_parent, { text }, { userCore }: Context) => {
            try {
                const { id: userId } = userCore;

                const post = await prisma.post.create({
                    data: { creatorId: userId, text },
                    include: { creator: true },
                });

                const subPost = { ...post, createdAt: +post.createdAt }; // May need updatedAt?
                freshPosts.push(subPost);

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
    },
    Post: {
        // creator: async ({ id: postId }, args) => {
        //     const thisPost = await prisma.post.findUnique({
        //         where: { id: postId },
        //         select: {
        //             creator: true,
        //         },
        //     });

        //     return thisPost!.creator;
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

import { prisma } from '../server';
import { consoleError, formatErrors, getUserRelations } from '../utils';
// import { Context } from '../types';
import type { Resolvers } from '../schema/generated';
import { Context } from '../types';

const resolvers: Resolvers = {
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
        getPostsFromFriends: async (_parent, { limit }, { userCore }: Context) => {
            const { id: meId } = userCore;

            const userIds = [meId, ...(await getUserRelations(meId, '"areFriends" = true')).map(data => data.user.id)];
            const posts = await prisma.post.findMany({
                where: { creatorId: { in: userIds } },
                include: { creator: true },
                orderBy: { createdAt: 'desc' },
                take: limit ?? undefined,
            });

            return posts;
        },
    },
    Mutation: {
        sendPost: async (_parent, { text }, { userCore }: Context) => {
            try {
                const { id: userId } = userCore;

                const post = await prisma.post.create({
                    data: { creatorId: userId, text },
                    include: { creator: true },
                });

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

import { prisma } from '../server';
import { formatErrors } from '../utils';
// import { Context } from '../types';
import type { Resolvers } from '../schema/generated';

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
                take: limit ?? undefined,
            });
        },
        getPostsFromUser: async (_parent, { userId, limit }) => {
            const posts = await prisma.post.findMany({
                where: { creatorId: userId },
                include: { creator: true },
                take: limit ?? undefined,
            });

            return posts;
        },
    },
    Mutation: {
        addPost: async (_parent, { creatorId, text }) => {
            try {
                const post = await prisma.post.create({
                    data: { creatorId, text },
                    include: { creator: true },
                });

                return {
                    ok: true,
                    post,
                };
            } catch (err) {
                console.log('++++++++++++++++++++++++++++++++');
                console.log('> ADD_POST ERROR:', err);
                console.log('--------------------------------');
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
        savedBy: async ({ id: postId }, { limit }) => {
            const thisPost = await prisma.post.findUnique({
                where: { id: postId },
                select: {
                    savedBy: { take: limit ?? undefined },
                },
            });

            return thisPost?.savedBy ?? null;
        },
    },
};

export default resolvers;

import { formatError } from '../utils/formatError';
import { Context } from '../types';

export default {
    Query: {
        getPost: async (_parent: any, { id }: any, { prisma }: Context): Promise<any> => {
            return prisma.user.findUnique({
                where: { id },
            });
        },
        getPosts: async (_parent: any, { limit }: any, { prisma }: Context): Promise<any> => {
            return prisma.user.findMany({
                take: limit,
            });
        },
        getPostsFromUser: async (_parent: any, { userId, limit }: any, { prisma }: Context): Promise<any> => {
            const userPosts = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    posts: {
                        take: limit,
                    },
                },
            });

            return userPosts?.posts;
        },
    },
    Mutation: {
        addPost: async (_parent: any, { creatorId, text }: any, { prisma }: Context): Promise<any> => {
            try {
                const post = await prisma.post.create({ data: { creatorId, text } });

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
                    errors: formatError(err, prisma),
                };
            }
        },
    },
    Post: {
        creator: async ({ id: postId }: any, args: any, { prisma }: Context): Promise<any> => {
            const post = await prisma.post.findUnique({
                where: { id: postId },
                select: {
                    creator: true,
                },
            });

            return post?.creator;
        },
        savedBy: async ({ id: postId }: any, { limit }: any, { prisma }: Context): Promise<any> => {
            const post = await prisma.post.findUnique({
                where: { id: postId },
                select: {
                    savedBy: { take: limit },
                },
            });

            return post?.savedBy;
        },
    },
};

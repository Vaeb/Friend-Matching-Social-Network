import bcrypt from 'bcrypt';

import { formatError } from '../utils/formatError';
import { Context } from '../types';

export default {
    Query: {
        getUser: (_parent: any, { id }: any, { prisma }: Context): Promise<any> => {
            console.log('Received request for getUser:', id);
            return prisma.user.findUnique({
                where: { id },
                include: { posts: true },
            });
        },
        getUsers: (_parent: any, { limit }: any, { prisma }: Context): Promise<any> => {
            console.log('Received request for getUsers:', limit);
            return prisma.user.findMany({
                orderBy: { createdAt: 'desc' },
                take: limit,
            });
        },
    },
    Mutation: {
        register: async (_parent: any, args: any, { prisma }: Context): Promise<any> => {
            try {
                args.password = await bcrypt.hash(args.password, 5);
                const user = await prisma.user.create({ data: args });

                return {
                    ok: true,
                    user,
                };
            } catch (err) {
                console.log('++++++++++++++++++++++++++++++++');
                console.log('> REGISTER ERROR:', err);
                console.log('--------------------------------');
                return {
                    ok: false,
                    errors: formatError(err, prisma),
                };
            }
        },
        deleteUser: async (_parent: any, args: any, { prisma }: Context): Promise<any> => {
            try {
                const user = await prisma.user.delete({ where: { id: args.id } });

                return {
                    ok: true,
                    user,
                };
            } catch (err) {
                console.log('++++++++++++++++++++++++++++++++');
                console.log('> DELETE_USER ERROR:', err);
                console.log('--------------------------------');
                return {
                    ok: false,
                    errors: formatError(err, prisma),
                };
            }
        },
    },
    User: {
        posts: async ({ id: userId }: any, { limit }: any, { prisma }: Context): Promise<any> => {
            const user = await prisma.user.findUnique({ // Could improve as prisma.posts.findMany where creatorId=userId
                where: { id: userId },
                select: {
                    posts: { take: limit },
                },
            });

            return user?.posts;
        },
        savedPosts: async ({ id: userId }: any, { limit }: any, { prisma }: Context): Promise<any> => {
            const user = await prisma.user.findUnique({ // Possible equivalent for many-to-many?
                where: { id: userId },
                select: {
                    savedPosts: { take: limit },
                },
            });

            return user?.savedPosts;
        },
    },
};

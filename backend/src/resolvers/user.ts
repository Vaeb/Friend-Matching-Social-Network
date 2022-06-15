import bcrypt from 'bcrypt';
import { login } from '../authentication';

import { prisma } from '../server';
import { formatError } from '../utils';
import { Context } from '../types';

export default {
    Query: {
        getUser: (_parent: any, { id }: any): Promise<any> => {
            console.log('Received request for getUser:', id);
            return prisma.user.findUnique({
                where: { id },
                include: { posts: true },
            });
        },
        getUsers: (_parent: any, { limit }: any): Promise<any> => {
            console.log('Received request for getUsers:', limit);
            return prisma.user.findMany({
                orderBy: { createdAt: 'desc' },
                take: limit,
            });
        },
        whoami: (_parent: any, args: any, { userCore }: Context): any => {
            console.log('Received request for whoami');
            if (!userCore) return 'You are not logged in.';
            return `You are ${userCore.username} (id: ${userCore.id})`;
        },
    },
    Mutation: {
        register: async (_parent: any, args: any): Promise<any> => {
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
                    error: formatError(err),
                };
            }
        },
        login: async (_parent: any, { handle, password }: any, { res }: Context): Promise<any> => login(handle, password, res),
        deleteUser: async (_parent: any, args: any): Promise<any> => {
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
                    error: formatError(err),
                };
            }
        },
    },
    User: {
        posts: async ({ id: userId }: any, { limit }: any): Promise<any> => {
            const user = await prisma.user.findUnique({ // Could improve as prisma.posts.findMany where creatorId=userId
                where: { id: userId },
                select: {
                    posts: { take: limit },
                },
            });

            return user?.posts;
        },
        savedPosts: async ({ id: userId }: any, { limit }: any): Promise<any> => {
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

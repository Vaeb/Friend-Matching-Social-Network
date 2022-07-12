import bcrypt from 'bcrypt';
import { User, UserRelations } from '@prisma/client';

import { login, logout } from '../authentication';
import { prisma } from '../server';
import { consoleError, formatErrors, pickUser } from '../utils';
import { Context } from '../types';
import type { Error, Resolvers } from '../schema/generated';

const resolvers: Resolvers = {
    Query: {
        getUser: async (_parent, { id }) => {
            console.log('Received request for getUser:', id);
            const user = await prisma.user.findUnique({
                where: { id },
            });

            return pickUser(user);
        },
        getUsers: (_parent, { limit }) => {
            console.log('Received request for getUsers:', limit);
            return prisma.user.findMany({
                orderBy: { createdAt: 'desc' },
                take: limit ?? undefined,
            });
        },
        me: (_parent, _, { userCore }: Context) => {
            if (!userCore) return null;
            return prisma.user.findUnique({ where: { id: userCore.id } });
        },
        getUserInterests: (_parent, { userId }) => {
            console.log('Received request for getUserInterests:', userId);
            return prisma.userInterest.findMany({
                where: { userId },
                include: { interest: true },
            });
        },
    },
    Mutation: {
        register: async (_parent, args, { res }: Context) => {
            const parseErrors: Error[] = [];

            try {
                console.log('Received request for register:', args);
                const rawPass = args.password;

                if (!args.email.includes('@')) {
                    // parseErrors.push({ field: 'email', message: 'Must be a valid .ac.uk email address' });
                    parseErrors.push({ field: 'email', message: 'Must be a valid email address' });
                    throw new Error('Bad data');
                // } else if (!args.email.endsWith('.ac.uk')) {
                //     parseErrors.push({ field: 'email', message: 'Must be a valid .ac.uk email address' });
                //     throw new Error('Bad data');
                }

                args.password = await bcrypt.hash(rawPass, 5);
                const user = await prisma.user.create({ data: args });
                console.log('Success! Logging in...');
                await login(args.username, rawPass, res);

                return {
                    ok: true,
                    user,
                };
            } catch (err) {
                consoleError('REGISTER', err);

                const rawErrors = [err];
                try {
                    const foundUsername = await prisma.user.findUnique({ where: { username: args.username }, select: { id: true } });
                    const foundEmail = await prisma.user.findUnique({ where: { email: args.email }, select: { id: true } });

                    if (foundUsername) parseErrors.push({ field: 'username', message: 'Username already exists.' });
                    if (foundEmail) parseErrors.push({ field: 'email', message: 'Email already exists.' });
                } catch (err2) {
                    console.log('********************************');
                    console.log('> ERROR 2:', err2);
                    rawErrors.push(err2);
                }

                return {
                    ok: false,
                    errors: parseErrors.length ? parseErrors : formatErrors(...rawErrors),
                };
            }
        },
        login: async (_parent, { handle, password }, { res }: Context) => {
            console.log('Received request for login:', handle, password);
            return login(handle, password, res);
        },
        logout: async (_parent, _, { userCore, res }: Context) => {
            console.log('Received request for logout');
            return logout(userCore, res);
        },
        deleteUser: async (_parent, args) => {
            try {
                const user = await prisma.user.delete({ where: { id: args.id } });

                return {
                    ok: true,
                    user,
                };
            } catch (err) {
                consoleError('DELETE_USER', err);
                return {
                    ok: false,
                    errors: formatErrors(err),
                };
            }
        },
        addUserInterests: async (_parent, { userId, userInterests }) => {
            try {
                console.log('Received request for addUserInterests:', userId, userInterests);
                // const user = await prisma.user.findUnique({ where: { id: userId } });
                // if (!user) return { ok: false, errors: [{ field: 'userId', message: 'User not found.' }] };

                // const interests = await prisma.interest.findMany({ where: { id_in: userInterests } });
                // if (!interests.length) return { ok: false, errors: [{ field: 'userInterests', message: 'Interests not found.' }] };

                const userInterestsToCreate = userInterests.map(userInterest => ({
                    ...userInterest,
                    userId,
                }));

                await prisma.userInterest.createMany({ data: userInterestsToCreate });

                return { ok: true };
            } catch (err) {
                consoleError('ADD_USER_INTERESTS', err);
                return {
                    ok: false,
                    errors: formatErrors(err),
                };
            }
        },
        addUserInterest: async (_parent, { userId, userInterest }) => {
            try {
                console.log('Received request for addUserInterest:', userId, userInterest);

                const userInterestToCreate = {
                    ...userInterest,
                    userId,
                };

                const newUserInterest = await prisma.userInterest.create({ data: userInterestToCreate, include: { interest: true } });

                return { ok: true, userInterest: newUserInterest };
            } catch (err) {
                consoleError('ADD_USER_INTERESTS', err);
                return {
                    ok: false,
                    errors: formatErrors(err),
                };
            }
        },
    },
    User: {
        relations: async ({ id: userId }) => {
            // const relations = await prisma.userRelations.findMany({
            //     // Could improve as prisma.posts.findMany where creatorId=userId
            //     where: { OR: [{ user1Id: userId }, { user2Id: userId }] },
            //     include: { user1: true, user2: true },
            // });

            // Two choices:
            // 1. Add each relation twice (interchange user1 and user2) and have a separate table for the relation data
            // b. Possible performance benefit: Can keep each user1 row stored on a server shard close to user1
            // 2. Add each relation once and require all queries involving relations to be raw SQL + extra TS to parse together
            const rawRelations = (await prisma.$queryRaw`
                SELECT areFriends, compatibility, haveMatched, matchDate, user.*
                FROM user_relations rel
                JOIN users user ON (rel.user1Id <> ${userId} AND rel.user1Id = user.id) OR (rel.user2Id <> ${userId} AND rel.user2Id = user.id)
                WHERE rel.user1Id = ${userId} OR rel.user2Id = ${userId}
            `) as (UserRelations & User)[];

            const relations = rawRelations.map((rawRelation) => {
                const {
                    areFriends, compatibility, haveMatched, matchDate, ...userData 
                } = rawRelation;
                return {
                    areFriends,
                    compatibility,
                    haveMatched,
                    matchDate,
                    user: pickUser(userData)!,
                };
            });

            return relations;
        },
        posts: async ({ id: userId }, { limit }) => {
            const posts = await prisma.post.findMany({
                // Could improve as prisma.posts.findMany where creatorId=userId
                where: { creatorId: userId },
                take: limit ?? undefined,
                include: { creator: true },
            });

            return posts;
        },
        savedPosts: async ({ id: userId }, { limit }) => {
            const me = await prisma.user.findUnique({
                // Possible equivalent for many-to-many?
                where: { id: userId },
                select: {
                    savedPosts: { take: limit ?? undefined, include: { creator: true } },
                },
            });

            return me?.savedPosts ?? [];
        },
    },
};

export default resolvers;

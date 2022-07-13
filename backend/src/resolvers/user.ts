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
                orderBy: { score: 'desc' },
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
        addUserInterest: async (_parent, { userId, userInterest, override }) => {
            try {
                console.log('Received request for addUserInterest:', userId, userInterest);

                const userInterestToCreate = {
                    ...userInterest,
                    userId,
                };

                let newUserInterest;

                if (override && userInterest.score == -1) {
                    await prisma.userInterest.delete({
                        where: { userId_interestId: { userId, interestId: userInterest.interestId } },
                    });
                } else if (override) {
                    newUserInterest = await prisma.userInterest.update({
                        data: userInterestToCreate,
                        include: { interest: true },
                        where: { userId_interestId: { userId, interestId: userInterest.interestId } },
                    });
                } else {
                    newUserInterest = await prisma.userInterest.create({ data: userInterestToCreate, include: { interest: true } });
                }

                const meInterests = await prisma.userInterest.findMany({
                    where: { userId },
                    select: { interestId: true, score: true },
                });

                if (meInterests.length > 0) {
                    const eligibleUsers: any = (await prisma.$queryRaw`
                        SELECT u.id, COALESCE(rel."compatibility", 0) as "compatibility", (case when u.id <> rel."user2Id" then 1 else 0 end) as "isSecond"
                        FROM users u
                        LEFT JOIN user_relations rel ON ((rel."user1Id" = ${userId} AND rel."user2Id" = u.id) OR (rel."user1Id" = u.id AND rel."user2Id" = ${userId}))
                        WHERE (rel."user1Id" IS NULL OR (rel."areFriends" = false AND rel."haveMatched" = false)) AND u.id <> ${userId};
                    `);

                    const eligbleUserIds: number[] = [];
                    const eligbleUserMap: Record<string, any> = {};
                    for (const eligibleUser of eligibleUsers) {
                        eligbleUserIds.push(eligibleUser.id);
                        eligbleUserMap[eligibleUser.id] = eligibleUser;
                    }

                    const eligibleUsersInterests = await prisma.user.findMany({
                        where: {
                            id: { in: eligbleUserIds },
                        },
                        select: {
                            id: true,
                            interests: {
                                select: {
                                    interestId: true,
                                    score: true,
                                },
                            },
                        },
                    });

                    const k = 1;
                    const insertRecords: string[] = [];
                    console.log(eligibleUsersInterests);
                    for (const userDetails of eligibleUsersInterests) {
                        const youId = userDetails.id;
                        let compatibility = 0;

                        const youInterestsMap: Record<string, number> = {};
                        for (const youInterest of userDetails.interests) {
                            youInterestsMap[youInterest.interestId] = youInterest.score;
                        }

                        for (const { interestId, score: meScore } of meInterests) {
                            const youScore = youInterestsMap[interestId];
                            if (youScore === undefined) continue;
                            compatibility += ( // Negative for majorly apart
                                (50 - Math.abs(meScore - youScore))
                                * (k ** (0.02 * Math.max(Math.abs(meScore - 50), Math.abs(youScore - 50))))
                            ) / k;
                        }

                        const { compatibility: oldCompatibility, isSecond } = eligbleUserMap[youId];
                        if (Math.floor(compatibility) != Math.floor(oldCompatibility)) {
                            const isFirst = !isSecond;
                            insertRecords.push(`(${isFirst ? userId : youId}, ${isFirst ? youId : userId}, ${compatibility}, current_timestamp, current_timestamp)`);
                        }
                    }

                    if (insertRecords.length > 0) {
                        const queryUpsertRows = `
                            INSERT INTO user_relations
                                ("user1Id", "user2Id", "compatibility", "updatedCompatibility", "updatedAt")
                            VALUES
                                ${insertRecords.join(', ')}
                            ON CONFLICT ("user1Id", "user2Id") DO UPDATE
                                SET "compatibility" = excluded."compatibility", "updatedCompatibility" = excluded."updatedCompatibility", "updatedAt" = excluded."updatedAt";
                        `;

                        console.log(queryUpsertRows);
                        const upsertResult = await prisma.$executeRawUnsafe(queryUpsertRows);

                        console.log('Compatibility update success!', upsertResult);
                    } else {
                        console.log('No records to upsert');
                    }
                }

                return { ok: true, userInterest: newUserInterest };
                // return { ok: false, errors: formatErrors('test') };
            } catch (err) {
                consoleError('ADD_USER_INTEREST', err);
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

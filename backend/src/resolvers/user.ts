import bcrypt from 'bcrypt';

import { login, logout, updateTokens } from '../authentication';
import { prisma } from '../server';
import { consoleError, formatErrors, getBigUser, getUserRelations } from '../utils';
import { Context } from '../types';
import type { Error, Resolvers } from '../schema/generated';

const hashPassword = (rawPassword: string) => bcrypt.hash(rawPassword, 5);

const resolvers: Resolvers = {
    Query: {
        getUser: async (_parent, { userId }, { userCore }: Context) => {
            console.log('Received request for getUser:', userId);
            const bigUser = await getBigUser(userCore.id, userId);
            return bigUser;
        },
        getUserByHandle: async (_parent, { handle }) => {
            console.log('Received request for getUserByHandle:', handle);
            if (handle.startsWith('@')) handle = handle.substring(1);
            return prisma.user.findFirst({
                where: {
                    OR: [
                        { username: { equals: handle, mode: 'insensitive' } },
                        { email: { equals: handle, mode: 'insensitive' } },
                    ], 
                },
            });
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
        getUserInterests: async (_parent, _, { userCore }: Context) => {
            console.log('Received request for getUserInterests');
            const userId = userCore.id;
            const userInterests = (await prisma.userInterest.findMany({
                where: { userId },
                include: { interest: true },
                orderBy: { score: 'desc' },
            }))
                .map(userInterest => ({ id: `${userInterest.userId}-${userInterest.interestId}`, ...userInterest }));
            return userInterests;
        },
        getMatches: async (_parent, _, { userCore }: Context) => {
            console.log('Received request for getMatches');
            const userId = userCore.id;

            const matches = (await getUserRelations(userId, '"haveMatched" = true AND "areFriends" = false'))
                .map(match => ({ id: match.user.id, ...match }));

            return matches as any;
        },
        getChats: async (_parent, _, { userCore }: Context) => {
            console.log('Received request for getChats');
            const meId = userCore.id;
            const messages = await prisma.message.groupBy({
                by: ['fromId', 'toId'],
                where: { OR: [{ fromId: meId }, { toId: meId }] },
                _max: { createdAt: true },
                orderBy: { _max: { createdAt: 'desc' } },
            });
            const chatters = [...new Set(messages.map(({ fromId, toId, _max: { createdAt } }) => ({ userId: fromId !== meId ? fromId : toId, createdAt })))];
            const chattersMap = Object.assign({}, ...chatters.map(({ userId, createdAt }) => ({ [userId]: +createdAt })));
            // console.log(chattersMap);
            const friends = await getUserRelations(meId, '"areFriends" = true');
            const friendsUpdatedMap = Object.assign({}, ...friends.map(({ user, friendDate, matchDate }) => ({ [user.id]: Math.max(+friendDate, +matchDate, chattersMap[user.id] ?? 0 ) })));
            // console.log(friendsUpdatedMap);
            const users = friends.map(relation => relation.user).sort((a, b) => friendsUpdatedMap[b.id] - friendsUpdatedMap[a.id]);
            return users;
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

                const existingUser = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { username: { equals: args.username, mode: 'insensitive' } },
                            { email: { equals: args.email, mode: 'insensitive' } },
                        ], 
                    },
                });

                if (existingUser) {
                    if (existingUser.username.toLowerCase() === args.username.toLowerCase()) {
                        parseErrors.push({ field: 'username', message: 'Username already exists.' });
                    }
                    if (existingUser.email.toLowerCase() === args.email.toLowerCase()) {
                        parseErrors.push({ field: 'email', message: 'Email already exists.' });
                    }
                    throw new Error('User already exists.');
                }

                if (Number.isNaN(args.universityId)) {
                    parseErrors.push({ field: 'universityId', message: 'University not valid' });
                    throw new Error('University not valid');
                }

                args.password = await hashPassword(rawPass);

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
        deleteUser: async (_parent, _, { userCore }: Context) => {
            try {
                console.log('Received request for deleteUser');
                const user = await prisma.user.delete({ where: { id: userCore.id } });

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
        addFriend: async (_parent, { userId, remove }, { userCore }: Context) => {
            try {
                console.log('Received request for addFriend', userId, remove);
                const meId = userCore.id;

                // await prisma.userRelation.updateMany({
                //     where: { AND: [{ OR: [{ user1Id: meId }, { user1Id: userId }] }, { OR: [{ user2Id: meId }, { user2Id: userId }] }] },
                //     data: { areFriends: !remove, friendDate: !remove ? new Date() : null, ...(remove ? { haveMatched: false, matchDate: null } : {}) },
                // });
                const isFirst = meId < userId;

                const upsertResult = await prisma.$executeRaw`
                    INSERT INTO user_relations
                        ("user1Id", "user2Id", "areFriends", "friendDate", "updatedAt")
                    VALUES
                        (${isFirst ? meId : userId}, ${isFirst ? userId : meId}, ${!remove}, current_timestamp, current_timestamp)
                    ON CONFLICT ("user1Id", "user2Id") DO UPDATE
                        SET "areFriends" = excluded."areFriends", "friendDate" = excluded."friendDate", "updatedAt" = excluded."updatedAt";
                `;
                console.log('Upsert success:', upsertResult);
                const bigUser = await getBigUser(meId, userId);

                return {
                    ok: true,
                    user: bigUser,
                };
            } catch (err) {
                consoleError('ADD_FRIEND', err);
                return {
                    ok: false,
                    errors: formatErrors(err),
                };
            }
        },
        addUserInterests: async (_parent, { userInterests }, { userCore }: Context) => {
            try {
                const userId = userCore.id;
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
        addUserInterest: async (_parent, { userInterest, override }, { userCore }: Context) => {
            try {
                const meId = userCore.id;
                console.log('Received request for addUserInterest:', meId, userInterest);
                const nowDate = new Date();

                const userInterestToCreate = {
                    ...userInterest,
                    userId: meId,
                };

                let newUserInterest;

                if (override && userInterest.score == -1) {
                    await prisma.userInterest.delete({
                        where: { userId_interestId: { userId: meId, interestId: userInterest.interestId } },
                    });
                } else if (override) {
                    newUserInterest = await prisma.userInterest.update({
                        data: userInterestToCreate,
                        include: { interest: true },
                        where: { userId_interestId: { userId: meId, interestId: userInterest.interestId } },
                    });
                } else {
                    newUserInterest = await prisma.userInterest.create({ data: userInterestToCreate, include: { interest: true } });
                }

                await prisma.user.update({
                    where: { id: meId },
                    data: { updatedInterests: nowDate },
                });

                const meInterests = await prisma.userInterest.findMany({
                    where: { userId: meId },
                    select: { interestId: true, score: true },
                });

                const eligibleUsers: any = (await prisma.$queryRaw`
                        SELECT u.id, COALESCE(rel."compatibility", 0) as "compatibility", (case when u.id <> rel."user2Id" then 1 else 0 end) as "isSecond"
                        FROM users u
                        LEFT JOIN user_relations rel ON ((rel."user1Id" = ${meId} AND rel."user2Id" = u.id) OR (rel."user1Id" = u.id AND rel."user2Id" = ${meId}))
                        WHERE (rel."user1Id" IS NULL OR (rel."areFriends" = false AND rel."haveMatched" = false)) AND u.id <> ${meId};
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
                        const isFirst = meId < youId;
                        insertRecords.push(`(${isFirst ? meId : youId}, ${isFirst ? youId : meId}, ${compatibility}, current_timestamp, current_timestamp)`);
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
        updateMe: async (_parent, rawArgs, { req, res, userCore }: Context) => {
            try {
                console.log(userCore);
                const meId = userCore.id;
                console.log('Received request for updateMe:', meId, rawArgs);
                const { oldPassword, ...args } = rawArgs;

                if (args.password) {
                    const user = await prisma.user.findUnique({ where: { id: meId } });
                    if (!user) throw new Error('User not found.');
                    console.log(oldPassword, user.password);
                    const isValid = await bcrypt.compare(oldPassword, user.password);
                    if (!isValid) throw new Error('Incorrect current password.');
                    args.password = await hashPassword(args.password);
                }

                const user = await prisma.user.update({
                    where: { id: meId },
                    data: args,
                });

                if (args.username || args.universityId) {
                    await updateTokens(req, res, userCore);
                }

                return { ok: true, user };
            } catch (err) {
                consoleError('UPDATE_ME', err);
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
            const relations = await getUserRelations(userId);
            return relations;
        },
        posts: async ({ id: userId }, { limit }, { userCore }: Context) => {
            const { universityId } = userCore;

            const posts = await prisma.post.findMany({
                // Could improve as prisma.posts.findMany where creatorId=userId
                where: { creatorId: userId, universityId },
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

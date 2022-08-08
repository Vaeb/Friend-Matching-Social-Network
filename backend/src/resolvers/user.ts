import bcrypt from 'bcrypt';
import { withFilter } from 'graphql-subscriptions';

import { login, logout, updateTokens } from '../authentication';
import { prisma } from '../server';
import {
    consoleError, formatErrors, getBigUser, getChats, getUserRelations, setupMatchSettings, 
} from '../utils';
import { Context, Context2 } from '../types';
import { FriendRequestType, FriendStatus, Match, MatchesStore } from '../schema/generated';
import type { Error, Resolvers } from '../schema/generated';
import { User } from '@prisma/client';
import { MANUAL_MATCH, FRIEND_REQUEST, pubsub, AUTO_MATCH, MANUAL_MATCH_AVAILABLE } from '../pubsub';
import { relevantAutoMatch, relevantFriendRequest, relevantManualMatch } from '../permissions';

const hashPassword = (rawPassword: string) => bcrypt.hash(rawPassword, 5);

const getMatches = async (meId: number) =>
    (await getUserRelations(meId, '"haveMatched" = true AND "areFriends" = false'))
        .map(match => ({ id: match.user.id, ...match }));

const getFriendRequests = async (meId: number) =>
    (await prisma.friendRequests.findMany({
        select: {
            sender: true,
        },
        where: {
            receiverId: meId,
        },
    })).map(fr => fr.sender);

const resolvers: Resolvers = {
    Subscription: {
        friendRequest: {
            resolve: (async (payload: FriendStatus, _, context: Context2) => {
                const { id: meId } = context.userCore;

                const bigUser = await getBigUser(meId, payload.initiator.id);
                const usersSendingFr = await getFriendRequests(meId);
                const chatUsers = await getChats(meId);
                const matches = await getMatches(meId);

                return {
                    fr: { id: meId, users: usersSendingFr },
                    chats: { id: meId, users: chatUsers },
                    matches: { id: meId, matches },
                    user: bigUser,
                };
            }) as any,
            subscribe: withFilter(
                () => pubsub.asyncIterator(FRIEND_REQUEST),
                relevantFriendRequest
            ) as any,
        },
        newAutoMatch: {
            resolve: (async (payload, _, context: Context2) => {
                const { id: meId } = context.userCore;
                const { matchIdMap } = payload;
                
                const user = await prisma.user.findUnique({ where: { id: matchIdMap[meId] } });

                const result: Match = { id: user.id, user };

                return result;
            }) as any,
            subscribe: withFilter(
                () => pubsub.asyncIterator(AUTO_MATCH),
                relevantAutoMatch
            ) as any,
        },
        newManualMatch: {
            resolve: (async (payload, _, context: Context2) => {
                const { id: meId, universityId } = context.userCore;

                console.log('Getting matches for manual match');
                const me = await getBigUser(meId, meId, universityId);
                const matches = await getMatches(meId);

                const result: MatchesStore = { id: meId, me, matches };
                return result;
            }) as any,
            subscribe: withFilter(
                () => pubsub.asyncIterator(MANUAL_MATCH),
                relevantManualMatch
            ) as any,
        },
        manualMatchAvailable: {
            resolve: (async (payload, _, context: Context2) => {
                const { id: meId } = context.userCore;
                const { matchIdMap } = payload;

                return matchIdMap[meId];
            }) as any,
            subscribe: withFilter(
                () => pubsub.asyncIterator(MANUAL_MATCH_AVAILABLE),
                relevantAutoMatch
            ) as any,
        },
    },
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
        me: async (_parent, _, { userCore }: Context) => {
            if (!userCore) return null;
            // for (const user of await prisma.user.findMany()) {
            //     setupUserRelations(user.id, user.universityId);
            // }
            const me = await getBigUser(userCore.id, userCore.id, userCore.universityId);
            return me;
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
            const { id: meId } = userCore;

            const matches = await getMatches(meId);

            return { id: meId, matches };
        },
        getFriendRequests: async (_parent, _, { userCore }: Context) => {
            console.log('Received request for getFriendRequests');
            const { id: meId } = userCore;

            const usersSendingFr = await getFriendRequests(meId);

            return { id: meId, users: usersSendingFr };
        },
        getChats: async (_parent, _, { userCore }: Context) => {
            console.log('Received request for getChats');
            const { id: meId } = userCore;
            const users = await getChats(meId);
            return { id: meId, users };
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

                await setupMatchSettings(user.id, user.universityId, true);
                // await setupUserRelations(user.id, user.universityId);

                console.log('Success! Logging in...');
                await login(args.username, rawPass, res);

                return {
                    ok: true,
                    user,
                    user2: user,
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
                    user2: user,
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
                const { id: meId } = userCore;
                let type: FriendRequestType;
                let bigUser: User;
                let sender;
                let receiver;

                const me = await prisma.user.findUnique({ where: { id: meId } });

                const meReceiver = await prisma.friendRequests.findUnique({
                    where: {
                        senderId_receiverId: { senderId: userId, receiverId: meId },
                    },
                });

                if (meReceiver || remove) {
                    if (remove) {
                        type = FriendRequestType.Remove;
                    } else {
                        type = FriendRequestType.Accept;
                    }
                    const isFirst = meId < userId;
                    const upsertResult = await prisma.$executeRaw`
                        INSERT INTO user_relations
                            ("user1Id", "user2Id", "areFriends", "haveMatched", "friendDate", "updatedAt")
                        VALUES
                            (${isFirst ? meId : userId}, ${isFirst ? userId : meId}, ${!remove}, false, timezone('utc', now()), timezone('utc', now()))
                        ON CONFLICT ("user1Id", "user2Id") DO UPDATE
                            SET "areFriends" = excluded."areFriends", "haveMatched" = excluded."haveMatched", "friendDate" = excluded."friendDate", "updatedAt" = excluded."updatedAt";
                    `;
                    console.log('Upsert success:', upsertResult);
                    if (type === FriendRequestType.Accept) {
                        await prisma.friendRequests.delete({
                            where: { senderId_receiverId: { senderId: userId, receiverId: meId } },
                        });
                    }
                    bigUser = await getBigUser(meId, userId);
                    sender = bigUser;
                    receiver = me;
                } else {
                    type = FriendRequestType.Request;
                    await prisma.friendRequests.create({
                        data: {
                            senderId: meId,
                            receiverId: userId,
                        },
                    });
                    bigUser = await getBigUser(meId, userId);
                    sender = me;
                    receiver = bigUser;
                }

                pubsub.publish(FRIEND_REQUEST, {
                    sender,
                    receiver,
                    initiator: me,
                    consumer: bigUser,
                    type,
                });

                const usersSendingFr = await getFriendRequests(meId);
                const chatUsers = await getChats(meId);
                const matches = await getMatches(meId);

                return {
                    ok: true,
                    user: bigUser,
                    fr: { id: meId, users: usersSendingFr },
                    chats: { id: meId, users: chatUsers },
                    matches: { id: meId, matches },
                    type,
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
                const { id: meId } = userCore;
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
                        insertRecords.push(`(${isFirst ? meId : youId}, ${isFirst ? youId : meId}, ${compatibility}, timezone('utc', now()), timezone('utc', now()))`);
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
                const { id: meId, universityId } = userCore;
                console.log('Received request for updateMe:', meId, rawArgs);
                const { oldPassword, universityEmail, ...args } = rawArgs;

                if (args.password) {
                    const user = await prisma.user.findUnique({ where: { id: meId } });
                    if (!user) throw new Error('User not found.');
                    console.log(oldPassword, user.password);
                    const isValid = await bcrypt.compare(oldPassword, user.password);
                    if (!isValid) throw new Error('Incorrect current password.');
                    args.password = await hashPassword(args.password);
                }

                if (universityEmail) {
                    const university = await prisma.university.findUnique({ where: { id: universityId } });
                    const emailRegex = new RegExp(university.emailRegex, 'i');
                    console.log(emailRegex);
                    if (!emailRegex.test(universityEmail)) throw new Error('Invalid university email.');
                    await prisma.user.update({
                        where: { id: meId },
                        data: {
                            universities: {
                                create: {
                                    uniEmail: universityEmail,
                                    university: {
                                        connect: { id: universityId },
                                    },
                                },
                            },
                        },
                    });
                }

                const me = await prisma.user.update({
                    where: { id: meId },
                    data: args,
                });

                if (args.universityId) {
                    setupMatchSettings(me.id, me.universityId);
                }

                if (args.username || args.universityId) {
                    await updateTokens(req, res, userCore);
                }

                const bigUser = await getBigUser(me.id, me.id, me.universityId);

                return { ok: true, user: bigUser, user2: bigUser };
            } catch (err) {
                consoleError('UPDATE_ME', err);
                return {
                    ok: false,
                    errors: formatErrors(err),
                };
            }
        },
        updateMatchSettings: async (_parent, args, { userCore }: Context) => {
            try {
                console.log(userCore);
                const { id: meId, universityId } = userCore;
                console.log('Received request for updateMatchSettings:', meId, args);

                await prisma.matchSettings.update({
                    where: { userId_universityId: { userId: meId, universityId } },
                    data: args,
                });

                const bigUser = await getBigUser(meId, meId, universityId);

                return { ok: true, user: bigUser, user2: bigUser };
            } catch (err) {
                consoleError('UPDATE_MATCH_SETTINGS', err);
                return {
                    ok: false,
                    errors: formatErrors(err),
                };
            }
        },
        manualMatch: async (_parent, _args, { userCore }: Context) => {
            try {
                const { id: meId, universityId } = userCore;
                console.log('Received request for manualMatch:', meId);
                
                const userId = (await prisma.matchSettings.findUnique({
                    select: { nextManualMatchId: true },
                    where: { userId_universityId: { userId: meId, universityId } },
                }))?.nextManualMatchId;

                if (!userId) return { success: false };

                const addMatchQuery = `
                    INSERT INTO user_relations
                        ("user1Id", "user2Id", "haveMatched", "matchDate", "updatedAt")
                    VALUES
                        (${meId < userId ? meId : userId}, ${meId < userId ? userId : meId}, true, timezone('utc', now()), timezone('utc', now()))
                    ON CONFLICT ("user1Id", "user2Id") DO UPDATE
                        SET "haveMatched" = excluded."haveMatched", "matchDate" = excluded."matchDate", "updatedAt" = excluded."updatedAt";
                `;

                console.log(addMatchQuery);
                const numUpdated = await prisma.$executeRawUnsafe(addMatchQuery);
                console.log('Updated', numUpdated, 'match!');

                await prisma.matchSettings.update({
                    where: { userId_universityId: { userId: meId, universityId } },
                    data: { nextManualMatchId: null },
                });

                await prisma.matchSettings.update({
                    where: { userId_universityId: { userId, universityId } },
                    data: { nextManualMatchId: null },
                });

                const matches = await getMatches(meId);

                pubsub.publish(MANUAL_MATCH, {
                    consumerId: userId,
                    initiatorId: meId,
                });

                const me = await getBigUser(meId, meId, universityId);

                return { success: true, matchesStore: { id: meId, matches }, me };
            } catch (err) {
                consoleError('MANUAL_MATCH', err);
                return { success: false };
            }
        },
    },
    User: {
        // relations: async ({ id: userId }) => {
        //     // const relations = await prisma.userRelations.findMany({
        //     //     // Could improve as prisma.posts.findMany where authorId=userId
        //     //     where: { OR: [{ user1Id: userId }, { user2Id: userId }] },
        //     //     include: { user1: true, user2: true },
        //     // });

        //     // Two choices:
        //     // 1. Add each relation twice (interchange user1 and user2) and have a separate table for the relation data
        //     // b. Possible performance benefit: Can keep each user1 row stored on a server shard close to user1
        //     // 2. Add each relation once and require all queries involving relations to be raw SQL + extra TS to parse together
        //     const relations = await getUserRelations(userId);
        //     return relations;
        // },
        // posts: async ({ id: userId }, { limit }, { userCore }: Context) => {
        //     const { universityId } = userCore;

        //     const posts = await prisma.post.findMany({
        //         // Could improve as prisma.posts.findMany where authorId=userId
        //         where: { authorId: userId, universityId },
        //         take: limit ?? undefined,
        //         include: { author: true },
        //     });

        //     return posts;
        // },
        // savedPosts: async ({ id: userId }, { limit }) => {
        //     const me = await prisma.user.findUnique({
        //         // Possible equivalent for many-to-many?
        //         where: { id: userId },
        //         select: {
        //             savedPosts: { take: limit ?? undefined, include: { author: true } },
        //         },
        //     });

        //     return me?.savedPosts ?? [];
        // },
    },
};

export default resolvers;

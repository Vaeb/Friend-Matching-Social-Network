import nodeUtils from 'util';
import {
    Comment, Post, PostReaction, CommentReaction, User, UserRelation, PostReactionUser, 
} from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { prisma } from './server';
import { Post as GPost, Comment as GComment } from './schema/generated';

// type Modify<O, R> = Omit<O, keyof R> & R;

export const formatErrors = (...errors: any[]) => {
    return errors.map((e) => {
        let field: string | undefined;

        if (e instanceof PrismaClientKnownRequestError && e.meta?.target) {
            field = (e.meta.target as any)[0];
        } else if (e instanceof Error) {
            field = 'Caught Error';
        }

        if (field != null) return { field, message: `${e.name}: ${e.message}` };

        return { field: 'Caught Unknown Error', message: nodeUtils.format(e) };
    });
};

export function badStatus(field: string, message: string): { ok: false, errors: { field: string, message: string }[] };
export function badStatus<T extends boolean>(field: string, message: string, sound: T): { ok: false, sound: T, errors: { field: string, message: string }[] };
export function badStatus<T extends boolean>(field: string, message: string, sound?: T) {
    return { ok: false, errors: [{ field, message }], sound } as any;
}

// const pick = <T extends Record<string, unknown>, K extends keyof T>(object: T, keys: K, swaps?: [string, any]): Pick<T, K> => {
//     return keys.reduce<Record<string, unknown>>((newObj, key) => {
//         if (typeof key === 'string') {
//             if (object[key]) newObj[key] = object[key];
//         } else {
//             newObj[key[0]] = key[1];
//         }
//         return newObj;
//     }, {}) as any;
// };

// const swap = <T extends Record<string, unknown>, K extends Array<[string, unknown]>>(obj: T, swaps: K) => {
//     let baseObj = obj;
//     for (const swap of swaps) {
//         baseObj = baseObj as Modify<typeof baseObj, { typeof swap[0]: typeof swap[1] }>;
//     }
// };

// function edit<O extends Record<string, unknown>, K extends keyof O, V>(object: O, key: K, value: V) {
//     const object2 = object as unknown as Modify<O, { [key]: V }>;
//     // object2.K;
//     // object2[key] = value;
//     // return object2;
// }

// export const pickUser = (user: User | null) => {
//     if (!user) return null;

//     const dateNum = +user.createdAt;

//     const pickedUser = pick(user, [
//         'id',
//         'username',
//         'email',
//         'name',
//         'matchQuality',
//         'visEmail',
//         'visInterests',
//         'createdAt',
//     ]);
//     const newUser = pickedUser as unknown as Modify<typeof pickedUser, { createdAt: number }>;
//     newUser.createdAt = dateNum;
    
//     // const newUser2 = edit(newUser, 'createdAt', dateNum);

//     return newUser;
// };

// export function pickPrismaObj<R>(tableName, dataExtended: Exclude<any, null>): R;
// export function pickPrismaObj<R>(tableName, dataExtended: null): R | null;
export const pickPrismaObj = <R>(tableName: string, dataExtended: any): R => {
    if (!dataExtended) return null;

    // @ts-ignore
    const fieldData: any[] = prisma._dmmf.modelMap[tableName].fields;
    const result = {};

    for (const data of fieldData) {
        const { name, type } = data;
        if (!(name in dataExtended)) continue;
        let value = dataExtended[name];
        if (type === 'DateTime' && value != null) {
            value = new Date(value);
        }
        result[name] = value;
    }

    return result as R;
};

export const consoleError = (name: string, err: any) => {
    console.log('++++++++++++++++++++++++++++++++');
    console.log(`> ${name} ERROR:`, err);
    console.log('--------------------------------');
};

export const cloneDeepJson = (obj: any) => JSON.parse(JSON.stringify(obj));

export const cloneObj = <T>(obj: T, fixBuffer?: boolean): T => {
    let copy;

    if (obj == null || typeof (obj) !== 'object') return obj;

    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy as unknown as T;
    }

    if (obj instanceof Array) {
        copy = [];
        const len = obj.length;
        for (let i = 0; i < len; i++) {
            copy[i] = cloneObj(obj[i], fixBuffer);
        }
        return copy as unknown as T;
    }

    if (fixBuffer && obj instanceof Buffer) {
        copy = obj.readUIntBE(0, 1);
        return copy as unknown as T;
    }

    if (obj instanceof Object && !(obj instanceof Buffer)) {
        copy = {} as Record<string, any>;
        for (const [attr, objAttr] of Object.entries(obj)) {
            copy[attr] = cloneObj(objAttr, fixBuffer);
        }
        return copy as T;
    }

    console.log("Couldn't clone obj, returning real value");

    return obj;
};

type PartialUserRelation = Pick<UserRelation, 'areFriends' | 'friendDate' | 'compatibility' | 'updatedCompatibility' | 'haveMatched' | 'matchDate'>;

export const getUserRelations = async (userId: number, bonusWhere?: string, otherUserId?: number) => {
    if (userId === otherUserId) return [];

    const queryParams = [userId];
    if (otherUserId != null) queryParams.push(otherUserId);

    const rawRelations = (await prisma.$queryRawUnsafe(`
        SELECT "areFriends", "friendDate", "compatibility", "updatedCompatibility", "haveMatched", "matchDate", u.*
        FROM user_relations rel
        JOIN users u ON (rel."user1Id" <> $1 AND rel."user1Id" = u.id) OR (rel."user2Id" <> $1 AND rel."user2Id" = u.id)
        WHERE (rel."user1Id" = $1 OR rel."user2Id" = $1)${otherUserId != null ? ' AND (rel."user1Id" = $2 OR rel."user2Id" = $2)' : ''}${bonusWhere ? ` AND (${bonusWhere})` : ''}
        ORDER BY "updatedAt" DESC
    `, ...queryParams)) as (UserRelation & User)[];

    const relations = rawRelations.map((rawRelation) => {
        const user = pickPrismaObj<User>('User', rawRelation);
        const userRelation = pickPrismaObj<PartialUserRelation>('UserRelation', rawRelation);
        const result = { ...userRelation, user };
        return result;
    });

    return relations;
};

export const getBigUser = async (meId, userId: number, universityId?: number) => {
    const [userRelation] = meId != userId ? await getUserRelations(meId, undefined, userId) : [];

    const userDetails = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            university: { select: { name: true } },
            universities: { select: { universityId: true } },
            matchSettings: {
                select: {
                    manualEnabled: true, lastAutoMatched: true, autoFreq: true, nextManualMatchId: true, studentsOnly: true, snoozedUntil: true, 
                },
                where: { universityId },
            },
            sentFriendRequests: { select: { createdAt: true }, where: { receiverId: meId } },
            receivedFriendRequests: { select: { createdAt: true }, where: { senderId: meId } },
        },
    });

    const { university } = userDetails;
    const uniConfirmed = userDetails.universities.some(uni => uni.universityId === universityId);
    const matchSettings: Partial<typeof userDetails.matchSettings[0]> = userDetails.matchSettings?.[0] ?? {};
    const receivedFrFrom = userDetails.sentFriendRequests.length > 0;
    const sentFrTo = userDetails.receivedFriendRequests.length > 0;

    if (userRelation) { // Other User
        const { user: baseUser, ...bigUser } = { ...userRelation, ...userRelation.user };

        const fullUser = {
            ...bigUser, uniConfirmed, uni: university.name, ...matchSettings, receivedFrFrom, sentFrTo, 
        };

        return fullUser;
    } else { // Me or Other User
        const {
            university: _1,
            matchSettings: _2,
            sentFriendRequests: _3,
            receivedFriendRequests: _4,
            universities: _5,
            ...fullUser
        } = {
            ...userDetails, uniConfirmed, uni: university.name, ...matchSettings, receivedFrFrom, sentFrTo, 
        };

        return fullUser;
    }
};

export const setupMatchSettings = async (meId, universityId, onRegister = false) => { // Will need to update user_relations (and delete when matching disabled for uni)
    console.log(meId, universityId);
    const matchSettings = await prisma.matchSetting.upsert({
        where: { userId_universityId: { userId: meId, universityId } },
        update: {},
        create: {
            userId: meId,
            universityId,
            manualEnabled: onRegister,
        },
    });
    return matchSettings;
};

// export const setupUserRelations = async (meId, universityId) => {
//     const users = await prisma.matchSetting.findMany({
//         where: {
//             universityId,
//             userId: { not: meId },
//             OR: [{ manualEnabled: true }, { autoFreq: { gt: 0 } }],
//         },
//         select: { userId: true },
//     });
//     await prisma.userRelation.createMany({
//         data: users.map(user => ({
//             user1Id: user.userId < meId ? user.userId : meId,
//             user2Id: user.userId < meId ? meId : user.userId,
//         })),
//         skipDuplicates: true,
//     });
// };

type FullComment = Comment & {
    author: User;
    reactions: CommentReaction[];
    // comments: Comment[];
};

export const fixComments = (comments: FullComment[]) => {
    return comments.map((rawComment) => {
        // const { author, comments, reactions, ...post } = rawPost;
        const numLikes = rawComment.reactions.filter(reaction => reaction.type === 'like').length;
        const comment: GComment = { ...rawComment, numLikes };
        return comment;
    }).reverse();
};

type FullPostReaction = (PostReaction & {
    users: PostReactionUser[];
});

type FullPost = Post & {
    author: User & {
        relations1?: UserRelation[];
        relations2?: UserRelation[];
    };
    reactions: FullPostReaction[];
    comments: FullComment[];
};

export type GPostExtra = GPost & {
    relation?: UserRelation;
};

export const fixPosts = <T extends (FullPost | FullPost[])>(posts: T, meId: number): T extends FullPost ? GPostExtra : GPostExtra[] => {
    const wasArray = Array.isArray(posts);
    const postsArr: FullPost[] = wasArray ? posts : [posts];
    const newPosts = postsArr.map((rawPost) => {
        // const { author, comments, reactions, ...post } = rawPost;
        const numLikes = rawPost.reactions.find(({ type }) => type === 'like')?.num ?? 0;
        const meLiked = !!rawPost.reactions.find(({ type }) => type === 'like')?.users.some(({ userId }) => userId === meId);
        const relation = rawPost.author.relations1?.[0] ?? rawPost.author.relations2?.[0] ?? undefined;
        const post: GPostExtra = { ...rawPost, numLikes, comments: fixComments(rawPost.comments), meLiked, relation };
        return post;
    });
    return (wasArray ? newPosts : newPosts[0]) as T extends FullPost ? GPostExtra : GPostExtra[];
};

export const getChats = async (meId: number) => {
    const messages = await prisma.message.groupBy({
        by: ['fromId', 'toId'],
        where: { OR: [{ fromId: meId }, { toId: meId }] },
        _max: { createdAt: true },
        orderBy: { _max: { createdAt: 'desc' } },
    });
    const numberUnseen = await prisma.message.groupBy({
        by: ['fromId', 'toId'],
        where: { toId: meId, seen: false },
        _count: true,
        orderBy: { _max: { createdAt: 'desc' } },
    });
    const numberUnseenMap: Record<string, number> = Object.assign({}, ...numberUnseen.map(({ fromId, _count }) => ({ [fromId]: _count })));
    // console.log('messages', messages);
    // console.log('numberUnseen', numberUnseen);
    const chattersMap = {};
    messages.forEach(({ fromId, toId, _max: { createdAt } }) => {
        const userId = fromId !== meId ? fromId : toId;
        if (!chattersMap[userId]) chattersMap[userId] = +createdAt;
        else chattersMap[userId] = Math.max(chattersMap[userId], +createdAt);
    });
    // const chattersMap = Object.assign({}, ...chatters.map(({ userId, createdAt }) => ({ [userId]: +createdAt })));
    // console.log(chattersMap);
    const friends = await getUserRelations(meId, '"areFriends" = true');
    const friendsUpdatedMap = Object.assign({}, ...friends.map(({ user, friendDate, matchDate }) => ({ [user.id]: Math.max(+friendDate, +matchDate, chattersMap[user.id] ?? 0 ) })));
    // console.log(friendsUpdatedMap);
    const users = friends.map(({ user }) => ({ ...user, unseenChats: numberUnseenMap[user.id] ?? 0 })).sort((a, b) => friendsUpdatedMap[b.id] - friendsUpdatedMap[a.id]);
    return users;
};

// export const fixPost = (posts: FullPost[] | FullPost) => {
//     const wasArray = Array.isArray(posts);
//     if (!Array.isArray(posts)) posts = [posts];
//     return posts.map((rawPost) => {
//         // const { author, comments, reactions, ...post } = rawPost;
//         const numLikes = rawPost.reactions.filter(reaction => reaction.type === 'like').length;
//         const post: GPost = { ...rawPost, numLikes, comments: fixComments(rawPost.comments) };
//         return post;
//     });
// };

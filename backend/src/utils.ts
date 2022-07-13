import nodeUtils from 'util';
import pick from 'lodash-es/pick';
import { User, UserRelations } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { prisma } from './server';

type Modify<O, R> = Omit<O, keyof R> & R;

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
//         'matchPrecision',
//         'visEmail',
//         'visInterests',
//         'createdAt',
//     ]);
//     const newUser = pickedUser as unknown as Modify<typeof pickedUser, { createdAt: number }>;
//     newUser.createdAt = dateNum;
    
//     // const newUser2 = edit(newUser, 'createdAt', dateNum);

//     return newUser;
// };

export function pickUserData<T extends User>(userExtended: T): User;
export function pickUserData<T extends User>(userExtended: T | null): User | null;
export function pickUserData<T extends User>(userExtended: T | null) {
    if (!userExtended) return null;

    // @ts-ignore
    const userFieldData: any[] = prisma._dmmf.modelMap.User.fields;
    const user: any = {};

    for (const data of userFieldData) {
        const { name, type }: any = data;
        let value = (userExtended as any)[name];
        if (type === 'DateTime' && value != null) {
            value = new Date(value);
        }
        user[name] = value;
    }

    return user as User;
}

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

export const getUserRelations = async (userId: number, bonusWhere?: string) => {
    const rawRelations = (await prisma.$queryRaw`
        SELECT "areFriends", "compatibility", "updatedCompatibility", "haveMatched", "matchDate", u.*
        FROM user_relations rel
        JOIN users u ON (rel."user1Id" <> ${userId} AND rel."user1Id" = u.id) OR (rel."user2Id" <> ${userId} AND rel."user2Id" = u.id)
        WHERE rel."user1Id" = ${userId} OR rel."user2Id" = ${userId}
    `) as (UserRelations & User)[];

    const relations = rawRelations.map((rawRelation) => {
        const user = pickUserData(rawRelation);
        const result: Record<string, any> = { user };
        for (const [key, value] of Object.entries(rawRelation)) {
            if (!(key in user)) {
                result[key] = value;
            }
        }
        return result;
    });

    return relations;
};
import nodeUtils from 'util';
import pick from 'lodash-es/pick';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

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

export const pickUser = (user: User | null) => {
    if (!user) return null;

    const dateNum = +user.createdAt;

    const pickedUser = pick(user, [
        'id',
        'username',
        'email',
        'name',
        'matchPrecision',
        'visEmail',
        'visInterests',
        'createdAt',
    ]);
    const newUser = pickedUser as unknown as Modify<typeof pickedUser, { createdAt: number }>;
    newUser.createdAt = dateNum;
    
    // const newUser2 = edit(newUser, 'createdAt', dateNum);

    return newUser;
};

export const consoleError = (name: string, err: any) => {
    console.log('++++++++++++++++++++++++++++++++');
    console.log(`> ${name} ERROR:`, err);
    console.log('--------------------------------');
};

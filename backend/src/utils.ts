import nodeUtils from 'util';

export const formatError = (e: any) => {
    if (e instanceof Error) {
        return `${e.name}: ${e.message}`;
    }

    return `Unknown error: ${nodeUtils.format(e)}`;
};

export function badStatus(error: string): { ok: false, error: string };
export function badStatus<T>(error: string, sound: T): { ok: false, error: string, sound: T };
export function badStatus<T>(error: string, sound?: T) {
    return { ok: false, error, sound } as const;
}

// export const stripStatus = (status: any): { ok: boolean, error: string } => {
//     const { ok, error } = status;
//     return { ok, error };
// };

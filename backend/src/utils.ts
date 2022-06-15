import nodeUtils from 'util';

export const formatError = (e: any) => {
    if (e instanceof Error) {
        return `${e.name}: ${e.message}`;
    }

    return `Unknown error: ${nodeUtils.format(e)}`;
};

export function badStatus(message: string): { ok: false, error: string };
export function badStatus<T>(message: string, sound: T): { ok: false, error: string, sound: T };
export function badStatus<T>(message: string, sound?: T) {
    return { ok: false, error: message, sound } as const;
}

export const stripStatus = (status: any): { ok: boolean, message: string } => {
    const { ok, message } = status;
    return { ok, message };
};

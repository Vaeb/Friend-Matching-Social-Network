import nodeUtils from 'util';

import { PrismaClient } from '../types';

export const formatError = (e: any, prisma: PrismaClient): any[] => {
    if (e instanceof Error) {
        return [{ path: '', message: `${e.name}: ${e.message}` }];
    }

    return [{ path: '', message: `Unknown error: ${nodeUtils.format(e)}` }];
};

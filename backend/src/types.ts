import PrismaWrapper from '@prisma/client';

export type PrismaClient = PrismaWrapper.PrismaClient;

export interface Context {
    serverUrl: string;
}

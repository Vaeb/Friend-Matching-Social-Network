import PrismaWrapper from '@prisma/client';
import express from 'express';

export type PrismaClient = PrismaWrapper.PrismaClient;

export type UserCore = { id: number; username: string; };
export type UserIdentifier = { id: number; };

export type ExpressRequest = express.Request;
export type UseRequest = ExpressRequest & { userCore: UserCore };
export type ExpressResponse = express.Response;

export interface Context {
    req: UseRequest;
    res: ExpressResponse;
    serverUrl: string;
    userCore: UserCore;
}

export type NextFunction = express.NextFunction;

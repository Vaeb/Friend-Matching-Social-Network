import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { CookieOptions } from 'express';
import { User } from '@prisma/client';

import { prisma } from './server';
import { auth } from './private';
import { badStatus } from './utils';
import { Context, ExpressRequest, UserCore, UserIdentifier } from './types';

const cookieOptions: CookieOptions = { httpOnly: true };

const generateTokens = (user: User, secretRefresh: string) => {
    const userCore: UserCore = { id: user.id, username: user.username };
    const userIdentifier: UserIdentifier = { id: user.id };

    const tokenAccess = jwt.sign(userCore, auth.SECRET1, { expiresIn: '45m' });
    const tokenRefresh = jwt.sign(userIdentifier, secretRefresh, { expiresIn: '7d' });

    return { tokenAccess, tokenRefresh, userCore, userIdentifier };
};

type RefreshTokensPayload = {
    tokenAccess: string;
    tokenRefresh: string;
    user: User;
    userCore: UserCore;
} | Record<string, never>;

const refreshTokens = async (tokenAccessOld: string, tokenRefreshOld: string): Promise<RefreshTokensPayload> => {
    let userId: number | undefined;
    console.log('Refreshing tokens...');

    try {
        ({ id: userId } = jwt.decode(tokenAccessOld) as any);
    } catch (err) {
        console.log('Failed to decode tokenAccessOld:', err);
    }
    if (!userId) return {};

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return {};

    const secretRefresh = `${user.password}${auth.SECRET2BASE}`;
    try {
        jwt.verify(tokenRefreshOld, secretRefresh);
    } catch (err) {
        console.log('Failed to verify tokenRefreshOld:', err);
        return {};
    }

    const { tokenAccess, tokenRefresh, userCore } = generateTokens(user, secretRefresh);
    return { tokenAccess, tokenRefresh, user, userCore };
};

export const getUserCoreFromTokens = (tokens: any) => {
    const userCore = jwt.verify(tokens.tokenAccess, auth.SECRET1) as UserCore;
    return userCore;
};

export const authenticateTokens = async (reqOrig: ExpressRequest, res: Context['res'], next: any) => {
    const req = reqOrig as Context['req'];
    const { tokenAccess, tokenRefresh } = req.cookies;
    if (!tokenAccess || !tokenRefresh) {
        console.log('No tokens, continuing...');
        return next();
    }

    console.log('Checking access token...');
    try {
        const userCore = getUserCoreFromTokens(req.cookies);
        req.userCore = userCore;
    } catch (err) {
        console.log('Access expired, refreshing tokens...');
        const newTokens = await refreshTokens(tokenAccess, tokenRefresh);

        if (!newTokens.tokenRefresh) {
            res.clearCookie('tokenAccess');
            res.clearCookie('tokenRefresh');
            res.clearCookie('username');
            console.log('Failed to refresh');
            return next();
        }

        req.userCore = newTokens.userCore;
        res.cookie('tokenAccess', newTokens.tokenAccess, cookieOptions);
        res.cookie('tokenRefresh', newTokens.tokenRefresh, cookieOptions);
        res.cookie('username', newTokens.userCore.username, cookieOptions);
        console.log('Refreshed tokens cookies!', req.userCore.username, tokenAccess, tokenRefresh);
    }

    console.log('Access granted to', req.userCore.username);
    next();
};

const loginLookup = async (handle: string, handleType: string, password: string) => {
    const user = await prisma.user.findFirst({ where: { [handleType]: { equals: handle, mode: 'insensitive' } } });
    if (!user) return badStatus('handle', 'Invalid username/email', false);

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return badStatus('password', 'Incorrect password', true);

    return { ok: true, user, sound: true } as const;
};

export const login = async (handle: string, password: string, res: Context['res']) => {
    let result = await loginLookup(handle, 'username', password);
    if (!result.ok && !result.sound) result = await loginLookup(handle, 'email', password);
    if (!result.ok) {
        const { sound, ...status } = result;
        console.log('Bad login:', result);
        return status;
    }

    const { user } = result;
    const secretRefresh = `${user.password}${auth.SECRET2BASE}`;
    const { tokenAccess, tokenRefresh } = await generateTokens(user, secretRefresh);

    res.cookie('tokenAccess', tokenAccess, cookieOptions);
    res.cookie('tokenRefresh', tokenRefresh, cookieOptions);
    res.cookie('username', user.username, cookieOptions);

    console.log('Login success!', user.username, tokenAccess, tokenRefresh);

    return {
        ok: true,
        user,
    } as const;
};

export const logout = async (userCore: Context['userCore'], res: Context['res']) => {
    res.clearCookie('tokenAccess');
    res.clearCookie('tokenRefresh');
    res.clearCookie('username');

    console.log('Logout success!', res.cookie);

    return {
        ok: true,
        user: userCore,
    } as const;
};

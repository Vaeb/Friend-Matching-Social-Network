import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';

import { prisma } from './server';
import { auth } from './private';
import { badStatus } from './utils';
import { Context, ExpressRequest, UserCore, UserIdentifier } from './types';

const cookieOptions = { httpOnly: true };

const generateTokens = (user: User, secretRefresh: string) => {
    const userCore: UserCore = { id: user.id, username: user.username };
    const userIdentifier: UserIdentifier = { id: user.id };

    const tokenAccess = jwt.sign(userCore, auth.SECRET1, { expiresIn: '45m' });
    const tokenRefresh = jwt.sign(userIdentifier, secretRefresh, { expiresIn: '7d' });

    return { tokenAccess, tokenRefresh, userCore, userIdentifier };
};

type RefreshTokensPayload =
    {
        tokenAccess: string;
        tokenRefresh: string;
        user: User;
        userCore: UserCore;
    } | Record<string, never>;
const refreshTokens = async (tokenAccessOld: string, tokenRefreshOld: string): Promise<RefreshTokensPayload> => {
    let userId: number | undefined;

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

export const authenticateTokens = async (reqOrig: ExpressRequest, res: Context['res'], next: any) => {
    const req = reqOrig as Context['req'];
    const { tokenAccess, tokenRefresh } = req.cookies;
    if (!tokenAccess || !tokenRefresh) return next();

    try {
        const userCore = jwt.verify(tokenAccess, auth.SECRET1) as UserCore;
        req.userCore = userCore;
    } catch (err) {
        console.log('Failed to authenticate with tokenAccess, refreshing tokens...');
        const newTokens = await refreshTokens(tokenAccess, tokenRefresh);

        if (!newTokens.tokenRefresh) {
            res.clearCookie('tokenAccess');
            res.clearCookie('tokenRefresh');
            console.log('Failed to refresh');
            return next();
        }

        req.userCore = newTokens.userCore;
        res.cookie('tokenAccess', newTokens.tokenAccess, cookieOptions);
        res.cookie('tokenRefresh', newTokens.tokenRefresh, cookieOptions);
    }

    next();
};

const loginLookup = async (handle: string, handleType: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { [handleType]: handle } });
    if (!user) return badStatus(`Invalid username/email: <${handle}>`, false);

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return badStatus(`Invalid password: <${password}>`, true);

    return { ok: true, user, sound: true } as const;
};

export const login = async (handle: string, password: string, res: Context['res']) => {
    let result = await loginLookup(handle, 'username', password);
    if (!result.ok && !result.sound) result = await loginLookup(handle, 'email', password);
    if (!result.ok) {
        const { sound, ...status } = result;
        return status;
    }

    const { user } = result;
    const secretRefresh = `${user.password}${auth.SECRET2BASE}`;
    const { tokenAccess, tokenRefresh } = await generateTokens(user, secretRefresh);

    res.cookie('tokenAccess', tokenAccess, cookieOptions);
    res.cookie('tokenRefresh', tokenRefresh, cookieOptions);

    return {
        ok: true,
        user,
    } as const;
};

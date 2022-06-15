import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '@prisma/client';

import { prisma } from './server';
import { auth } from './private';
import { badStatus, stripStatus } from './utils';

export const generateTokens = (user: User, secretRefresh: string) => {
    const userCore = { id: user.id, username: user.username };
    const userIdentifier = { id: user.id };

    const tokenAccess = jwt.sign(
        { user: userCore },
        auth.SECRET1,
        { expiresIn: '45m' }
    );

    const tokenRefresh = jwt.sign(
        { user: userIdentifier },
        secretRefresh,
        { expiresIn: '7d' }
    );

    return { tokenAccess, tokenRefresh };
};

type RefreshTokensPayload = {
    tokenAccess: string;
    tokenRefresh: string;
    user: User;
} | Record<string, never>;
export const refreshTokens = async (tokenAccessOld: string, tokenRefreshOld: string): Promise<RefreshTokensPayload> => {
    let userId: number | undefined;

    try {
        ({ user: { id: userId } } = (jwt.decode(tokenAccessOld) as any));
    } catch (err) {
        console.log('Failed to decode tokenAccessOld:', err);
    }
    if (!userId) return {};

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return {};

    const secretRefresh = `${user.password}${auth.SECRET2}`;
    try {
        jwt.verify(tokenRefreshOld, secretRefresh);
    } catch (err) {
        console.log('Failed to verify tokenRefreshOld:', err);
        return {};
    }
    
    const { tokenAccess, tokenRefresh } = generateTokens(user, secretRefresh);
    return { tokenAccess, tokenRefresh, user };
};

const loginLookup = async (handle: string, handleType: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { [handleType]: handle } });
    if (!user) return badStatus(`Invalid username/email: '${handle}'`, false);

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return badStatus(`Invalid password: ${password}`, true);

    return { ok: true, user, sound: true } as const;
};

export const login = async (handle: string, password: string) => {
    let result = await loginLookup(handle, 'username', password);
    if (!result.ok && !result.sound) result = await loginLookup(handle, 'email', password);
    if (!result.ok) return stripStatus(result);

    const { user } = result;
    const secretRefresh = `${user.password}${auth.SECRET2}`;
    const { tokenAccess, tokenRefresh } = await generateTokens(user, secretRefresh);

    return { ok: true, username: user.username, email: user.email, forename: user.forename, surname: user.surname } as const;
};

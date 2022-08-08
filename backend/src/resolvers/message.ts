import { prisma } from '../server';
import { consoleError, formatErrors, getChats } from '../utils';
import { Context, Context2 } from '../types';
import type { Error, Resolvers } from '../schema/generated';
import { NEW_MESSAGE, pubsub, REFRESH_CHATS } from '../pubsub';
import { permUser, relevantConsumer, relevantMessage } from '../permissions';
import { withFilter } from 'graphql-subscriptions';

const getMessages = async (meId: number, target: number, limit?: number) => {
    if (limit === undefined) limit = 50;

    const messages = (await prisma.message.findMany({
        where: { AND: [{ OR: [{ fromId: target }, { toId: target }] }, { OR: [{ fromId: meId }, { toId: meId }] }] },
        include: { from: true, to: true },
        orderBy: { createdAt: 'desc' },
        take: limit ?? undefined,
    })).reverse();

    return messages;
};

const resolvers: Resolvers = {
    Subscription: {
        newMessage: {
            resolve: (async (payload: any, _, { userCore }: Context2) => {
                const { id: meId } = userCore;

                console.log('Parsing messages', meId);
                const userId = payload.fromId === meId ? payload.toId : payload.fromId;
                const messages = await getMessages(payload.fromId, payload.toId, undefined);

                // if (meId === payload.fromId) return null;

                return { id: userId, messages };
            }) as any,
            subscribe: withFilter(
                () => pubsub.asyncIterator(NEW_MESSAGE),
                relevantMessage
            ) as any,
        },
        newChats: {
            resolve: (async (payload: any, _, { userCore }: Context2) => {
                const { id: meId } = userCore;

                console.log('Refreshing chats (subscr)');
                const users = await getChats(meId);

                return { id: meId, users };
            }) as any,
            subscribe: withFilter(
                () => pubsub.asyncIterator(REFRESH_CHATS),
                relevantConsumer
            ) as any,
        },
    },
    Query: {
        pingTest: permUser.chainResolver((_parent, { target, limit }, { userCore }: Context) => {
            console.log('Pong!', new Date());
            return 'Pong';
        }),
        getMessages: async (_parent, { target, limit }, { userCore }: Context) => {
            if (limit === undefined) limit = 50;
            console.log('Received request for getMessages:', target, limit);
            const { id: meId } = userCore;

            const messages = await getMessages(meId, target, limit);

            return { id: target, messages };
        },
    },
    Mutation: {
        sendMessage: async (_parent, { to: userId, text }, { userCore }: Context) => {
            try {
                const { id: meId } = userCore;
                console.log('Received request for sendMessage:', meId, userId);

                const message = await prisma.message.create({
                    data: {
                        fromId: meId,
                        toId: userId,
                        text,
                    },
                    include: { from: true, to: true },
                });

                pubsub.publish(NEW_MESSAGE, {
                    fromId: meId,
                    toId: userId,
                });

                pubsub.publish(REFRESH_CHATS, {
                    consumerIdMap: { [meId]: true, [userId]: true },
                });

                return {
                    ok: true,
                    message,
                };
            } catch (err) {
                consoleError('sendMessage', err);

                return {
                    ok: false,
                    errors: formatErrors(err),
                };
            }
        },
        clearSeen: async (_parent, { userId }, { userCore }: Context) => {
            try {
                const { id: meId } = userCore;
                console.log('Received request for clearSeen:', meId, userId);

                await prisma.message.updateMany({
                    where: { fromId: userId, toId: meId, seen: false },
                    data: { seen: true },
                });

                const users = await getChats(meId);

                return {
                    ok: true,
                    chatsStore: { id: meId, users },
                };
            } catch (err) {
                consoleError('CLEAR_SEEN', err);

                return {
                    ok: false,
                    errors: formatErrors(err),
                };
            }
        },
    },
};

export default resolvers;

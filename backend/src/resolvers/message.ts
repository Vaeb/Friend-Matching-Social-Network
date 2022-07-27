import { prisma } from '../server';
import { consoleError, formatErrors } from '../utils';
import { Context } from '../types';
import type { Error, Resolvers } from '../schema/generated';
import { NEW_MESSAGE, pubsub } from '../pubsub';

const resolvers: Resolvers = {
    Subscription: {
        newMessage: {
            resolve: payload => payload.message,
            subscribe: () => pubsub.asyncIterator(NEW_MESSAGE) as any,
        },
    },
    Query: {
        getMessages: (_parent, { target, limit }, { userCore }: Context) => {
            console.log('Received request for getMessages:', target, limit);
            const meId = userCore.id;
            return prisma.message.findMany({
                where: { AND: [{ OR: [{ fromId: target }, { toId: target }] }, { OR: [{ fromId: meId }, { toId: meId }] }] },
                include: { from: true, to: true },
                orderBy: { createdAt: 'asc' },
                take: limit ?? undefined,
            });
        },
    },
    Mutation: {
        sendMessage: async (_parent, args, { userCore }: Context) => {
            try {
                console.log('Received request for sendMessage:', args);

                const message = await prisma.message.create({
                    data: {
                        fromId: userCore.id,
                        toId: args.to,
                        text: args.text,
                    },
                    include: { from: true, to: true },
                });

                pubsub.publish(NEW_MESSAGE, {
                    message: { ...message, createdAt: +message.createdAt },
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
    },
};

export default resolvers;

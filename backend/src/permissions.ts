import { Post, User } from '@prisma/client';
import { FriendRequestType, FriendStatus } from './schema/generated';
import { Context, Context2 } from './types';

type EitherContext = Context | Context2;

type InnerResolver = (a, b, c: EitherContext, d) => any;

interface F {
    (a, b, c: EitherContext, d): any;
    chainResolver?: (childResolver: InnerResolver) => F;
}

type ResolverFunc = (a, b, c: EitherContext, d) => any;

//

export const chainResolver = (resolverFunc: F) => {
    console.log(111);
    resolverFunc.chainResolver = (childResolver) => {
        console.log(222);
        return chainResolver(async (parent, args, context, info) => {
            // console.log('RUN FUNC', 'parent', parent, 'args', args, 'context', context);
            const result = await resolverFunc(parent, args, context, info); // part of resolverFunc
            if (result === false) return;
            return childResolver(parent, args, context, info); // part of resolverFunc, runs new chain code, continues down chain stack (above line)
        });
    };
    return resolverFunc;
};

export const permUser = chainResolver((_parent, args, context) => {
    const meId = context?.userCore?.id;
    if (meId == null) return false;
    return true;
});

export const permPostNotAuthor = chainResolver((payload, _, { userCore: { id: meId } }) => {
    const { post } = payload;

    // console.log('PASSES:', post.authorId !== meId);

    return post.authorId !== meId;
});

export const relevantFriendRequest = chainResolver((payload: FriendStatus, _, { userCore: { id: meId } }) => {
    console.log('GOT FRIEND REQUEST SUBSCR...', payload.initiator.id);
    const { consumer } = payload;

    if (consumer.id === meId) {
        return true;
    }

    return false;
});

export const relevantMatch = chainResolver((payload: any, _, { userCore: { id: meId } }) => {
    console.log('GOT AUTO/AVAILABLE MATCH SUBSCR...', meId);
    const { matchIdMap } = payload;

    if (matchIdMap[meId]) {
        return true;
    }

    return false;
});

export const relevantManualMatch = chainResolver((payload: any, _, { userCore: { id: meId } }) => {
    console.log('GOT MANUAL MATCH SUBSCR...', meId);
    const { consumerId } = payload;

    if (consumerId === meId) {
        return true;
    }

    return false;
});

export const relevantMessage = chainResolver((payload: any, _, { userCore: { id: meId } }) => {
    console.log('GOT MESSAGE SUBSCR...', meId);
    const { fromId, toId } = payload;

    if (fromId === meId || toId === meId) {
        return true;
    }

    return false;
});

export const relevantConsumer = chainResolver((payload: any, _, { userCore: { id: meId } }) => {
    console.log('GOT CONSUMER SUBSCR...', meId);
    const { consumerIdMap } = payload;

    if (consumerIdMap[meId]) {
        return true;
    }

    return false;
});

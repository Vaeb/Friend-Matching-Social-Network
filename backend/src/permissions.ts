import { Post, User } from '@prisma/client';
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

type FullPost = Post & { creator: User };

export const permPostNotAuthor = chainResolver((payload, _, { userCore: { id: meId } }) => {
    const { post } = payload;

    // console.log('PASSES:', post.creatorId !== meId);

    return post.creatorId !== meId;
});

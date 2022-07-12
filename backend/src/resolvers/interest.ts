import { prisma } from '../server';
// import { formatErrors } from '../utils';
// import { Context } from '../types';
import type { Resolvers } from '../schema/generated';

const resolvers: Resolvers = {
    Query: {
        getInterests: (_parent, { limit }) => {
            console.log('Received request for getInterests:', limit);
            return prisma.interest.findMany({
                orderBy: { name: 'asc' },
                take: limit ?? undefined,
            });
        },
    },
};

export default resolvers;

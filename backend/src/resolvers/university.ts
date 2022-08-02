import { prisma } from '../server';
import { consoleError, formatErrors } from '../utils';
import { Context } from '../types';
import type { Error, Resolvers } from '../schema/generated';

const resolvers: Resolvers = {
    Query: {
        getUniversities: async (_parent, _args, { userCore }: Context) => {
            return prisma.university.findMany({ orderBy: { name: 'asc' } });
        },
    },
};

export default resolvers;

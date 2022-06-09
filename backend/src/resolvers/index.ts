// import { GraphQLScalarType } from 'graphql';
import { mergeResolvers } from '@graphql-tools/merge';

import user from './user';
import post from './post';

export default mergeResolvers([user, post]);

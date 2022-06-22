import { mergeTypeDefs } from '@graphql-tools/merge';

import meta from './meta';
import user from './user';
import post from './post';

export default mergeTypeDefs([meta, user, post]);

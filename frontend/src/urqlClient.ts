import { createClient, ssrExchange, dedupExchange, fetchExchange } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';

import { GetUserInterestsDocument, MeDocument } from './generated/graphql';

const isServer = typeof window === 'undefined';
const ssrCache = ssrExchange({ isClient: !isServer });

const graphqlUrl = process.env.NEXT_PUBLIC_ENV === 'PROD' ? 'http://vaeb.io:4000/graphql' : 'http://localhost:4000/graphql';

console.log('IS SSR:', isServer, process.env.NEXT_PUBLIC_ENV);

const client = createClient({
    url: graphqlUrl,
    exchanges: [
        dedupExchange,
        cacheExchange({
            updates: {
                Mutation: {
                    login: (_result, _args, cache, _info) => {
                        const result = _result as any;
                        cache.updateQuery({ query: MeDocument }, (query) => {
                            if (result.login.errors) {
                                return query;
                            } else {
                                console.log('Clearing "me" cache.');
                                return {
                                    me: result.login.user,
                                } as any;
                            }
                        });
                    },
                    logout: (_result, _args, cache, _info) => {
                        const result = _result as any;
                        cache.updateQuery({ query: MeDocument }, (query) => {
                            if (result.logout.errors) {
                                return query;
                            } else {
                                console.log('Clearing "me" cache.');
                                return {
                                    me: null,
                                } as any;
                            }
                        });
                    },
                    register: (_result, _args, cache, _info) => {
                        const result = _result as any;
                        cache.updateQuery({ query: MeDocument }, (query) => {
                            if (result.register.errors) {
                                return query;
                            } else {
                                console.log('Clearing "me" cache.');
                                return {
                                    me: result.register.user,
                                } as any;
                            }
                        });
                    },
                    addUserInterest: (_result, _args, cache, _info) => {
                        const result = _result as any;
                        if (result?.addUserInterest?.ok) {
                            cache.updateQuery(
                                {
                                    query: GetUserInterestsDocument,
                                    variables: { userId: _args.userId },
                                },
                                (_data) => {
                                    const data = _data as any;
                                    console.log('Updating data.getUserInterests', data.getUserInterests,
                                        'by pushing _result.addUserInterest.userInterest', result.addUserInterest.userInterest);
                                    data.getUserInterests.push(result.addUserInterest.userInterest);
                                    return data;
                                }
                            );
                        }
                    },
                },
            },
        }),
        ssrCache,
        fetchExchange,
    ],
    fetchOptions: { credentials: 'include' as const },
});

export { client, ssrCache };

import { createClient, ssrExchange, dedupExchange, fetchExchange } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import { MeDocument } from './generated/graphql';

const isServer = typeof window === 'undefined';
const ssrCache = ssrExchange({ isClient: !isServer });

console.log('IS SERVER:', isServer);

const client = createClient({
    url: 'http://localhost:4000/graphql',
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
                },
            },
        }),
        ssrCache,
        fetchExchange,
    ],
    fetchOptions: { credentials: 'include' as const },
});

export { client, ssrCache };

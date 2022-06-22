import {
    createClient,
    ssrExchange,
    dedupExchange,
    cacheExchange,
    fetchExchange,
} from 'urql';

const isServer = typeof window === 'undefined';
const ssrCache = ssrExchange({ isClient: !isServer });

console.log('IS SERVER:', isServer);

const client = createClient({
    url: 'http://localhost:4000/graphql',
    exchanges: [dedupExchange, cacheExchange, ssrCache, fetchExchange],
    fetchOptions: { credentials: 'include' as const },
});

export { client, ssrCache };

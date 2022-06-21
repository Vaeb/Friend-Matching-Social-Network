import {
    createClient,
    ssrExchange,
    dedupExchange,
    cacheExchange,
    fetchExchange,
} from 'urql';

const isServer = typeof window === 'undefined';
const ssrCache = ssrExchange({ isClient: !isServer });

const client = createClient({
    url: 'http://localhost:4000/graphql',
    exchanges: [dedupExchange, cacheExchange, ssrCache, fetchExchange],
});

export { client, ssrCache };

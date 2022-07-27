import { createClient, ssrExchange, dedupExchange, fetchExchange } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';

import { GetChatsDocument, GetMatchesDocument, GetMessagesDocument, GetPostsFromFriendsDocument, GetUserDocument, GetUserInterestsDocument, MeDocument } from './generated/graphql';
import { getPostsFromFriendsLimits } from './utils/limits';

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
                        const args = _args as any;
                        if (result?.addUserInterest?.ok) {
                            cache.updateQuery(
                                {
                                    query: GetUserInterestsDocument,
                                    // variables: { userId: args.userId },
                                },
                                (_data) => {
                                    const data = _data as any;
                                    const { userInterest } = result.addUserInterest;
                                    console.log('Updating data.getUserInterests', data.getUserInterests,
                                        'by pushing _result.addUserInterest.userInterest', userInterest);
                                    const oldIndex = data.getUserInterests.findIndex(({ interest: { id } }: any) => id == args.userInterest.interestId);
                                    if (oldIndex != -1) {
                                        console.log('Deleting old from cache...', oldIndex);
                                        data.getUserInterests.splice(oldIndex, 1);
                                    }
                                    if (userInterest != null) {
                                        const nextLowestIndex = data.getUserInterests.findIndex(({ score }: any) => score < userInterest.score);
                                        data.getUserInterests.splice(nextLowestIndex > -1 ? nextLowestIndex : data.getUserInterests.length, 0, userInterest);
                                    }
                                    return data;
                                }
                            );
                        }
                    },
                    sendMessage: (_result, _args, cache, _info) => {
                        const result = _result as any;
                        const args = _args as any;
                        if (result?.sendMessage?.ok) {
                            cache.updateQuery(
                                {
                                    query: GetMessagesDocument,
                                    variables: { target: args.to },
                                },
                                (_data) => {
                                    const data = _data as any;
                                    const { message } = result.sendMessage;
                                    data.getMessages.push(message);
                                    return data;
                                }
                            );
                        }
                    },
                    sendPost: (_result, _args, cache, _info) => {
                        const result = _result as any;
                        // const args = _args as any;
                        if (result?.sendPost?.ok) {
                            for (const limit of Object.values(getPostsFromFriendsLimits)) {
                                cache.updateQuery(
                                    {
                                        query: GetPostsFromFriendsDocument,
                                        variables: { limit },
                                    },
                                    (_data) => {
                                        const data = _data as any;
                                        const { post } = result.sendPost;
                                        (data.getPostsFromFriends as any[]).splice(0, 0, post);
                                        return data;
                                    }
                                );
                            }
                        }
                    },
                    addFriend: (_result, _args, cache, _info) => {
                        const result = _result as any;
                        const args = _args as any;
                        if (result?.addFriend?.ok) {
                            cache.updateQuery(
                                {
                                    query: GetUserDocument,
                                    variables: { userId: args.userId },
                                },
                                (_data) => {
                                    const data = _data as any;
                                    const { user } = result.addFriend;
                                    data.getUser = user;
                                    return data;
                                }
                            );
                            if (!args.remove) {
                                cache.updateQuery(
                                    {
                                        query: GetMatchesDocument,
                                    },
                                    (_data) => {
                                        const data = _data as any;
                                        const { user } = result.addFriend;
                                        const oldIndex = data.getMatches.findIndex(({ user: { id } }: any) => id == user.id);
                                        data.getMatches.splice(oldIndex, 1);
                                        return data;
                                    }
                                );
                            }
                            cache.updateQuery(
                                {
                                    query: GetChatsDocument,
                                },
                                (_data) => {
                                    const data = _data as any;
                                    const { user } = result.addFriend;
                                    if (args.remove) {
                                        const oldIndex = data.getChats.findIndex(({ id }: any) => id == user.id);
                                        data.getChats.splice(oldIndex, 1);
                                    } else {
                                        data.getChats.unshift(user);
                                    }
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

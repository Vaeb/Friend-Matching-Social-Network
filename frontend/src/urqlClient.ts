import { createClient, ssrExchange, dedupExchange, fetchExchange, subscriptionExchange } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import { devtoolsExchange } from '@urql/devtools';
import { createClient as createWSClient } from 'graphql-ws';

import {
    GetChatsDocument,
    GetMatchesDocument,
    GetMessagesDocument,
    GetUserDocument,
    GetUserInterestsDocument,
    MeDocument,
} from './generated/graphql';
import { graphqlUrl, wsUrl } from './defaults';

const isServer = typeof window === 'undefined';
const ssrCache = ssrExchange({ isClient: !isServer });

console.log('IS SSR:', isServer, process.env.NEXT_PUBLIC_ENV);

const exchanges = [
    devtoolsExchange,
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
                                console.log(
                                    'Updating data.getUserInterests',
                                    data.getUserInterests,
                                    'by pushing _result.addUserInterest.userInterest',
                                    userInterest
                                );
                                const oldIndex = data.getUserInterests.findIndex(
                                    ({ interest: { id } }: any) => id == args.userInterest.interestId
                                );
                                if (oldIndex != -1) {
                                    console.log('Deleting old from cache...', oldIndex);
                                    data.getUserInterests.splice(oldIndex, 1);
                                }
                                if (userInterest != null) {
                                    const nextLowestIndex = data.getUserInterests.findIndex(
                                        ({ score }: any) => score < userInterest.score
                                    );
                                    data.getUserInterests.splice(
                                        nextLowestIndex > -1 ? nextLowestIndex : data.getUserInterests.length,
                                        0,
                                        userInterest
                                    );
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
                                if (!data?.getMessages) return data;
                                const { message } = result.sendMessage;
                                data.getMessages.push(message);
                                return data;
                            }
                        );
                    }
                },
                // sendPost: (_result, _args, cache, _info) => {
                //     const result = _result as any;
                //     // const args = _args as any;
                //     if (result?.sendPost?.ok) {
                //         cache.updateQuery(
                //             {
                //                 query: GetPostsWeightedDocument,
                //             },
                //             (_data) => {
                //                 const data = _data as any;
                //                 const { post } = result.sendPost;
                //                 (data.getPostsWeighted as any[]).unshift(post);
                //                 return data;
                //             }
                //         );
                //     }
                // },
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
            Subscription: {
                newMessage: (_result, _args, cache, _info) => {
                    const result = _result as any;
                    const args = _args as any;
                    // console.log(1111, result, result?.newMessage);
                    // console.log(2222, args);
                    if (result?.newMessage) {
                        const message = result.newMessage;
                        cache.updateQuery(
                            {
                                query: GetMessagesDocument,
                                variables: { target: message.from.id },
                            },
                            (_data) => {
                                const data = _data as any;
                                if (!data?.getMessages) return data;
                                // console.log(4444, args.to, data, message);
                                data.getMessages.push(message);
                                // console.log('added', data);
                                return data;
                            }
                        );
                    }
                },
                // newPost: (_result, _args, cache, _info) => {
                //     const result = _result as any;
                //     const args = _args as any;
                //     if (result?.newPost) {
                //         const post = result.newPost;
                //         cache.updateQuery(
                //             {
                //                 query: GetPostsWeightedDocument,
                //             },
                //             (_data) => {
                //                 const data = _data as any;
                //                 if (!data?.getPostsWeighted) return data;
                //                 console.log('OLD DATA:', { ...data.getPostsWeighted });
                //                 if (post.text !== 'ff') (data.getPostsWeighted.posts as any[]).unshift(post);
                //                 console.log('NEW DATA:', { ...data.getPostsWeighted });
                //                 return data;
                //             }
                //         );
                //     }
                // },
            },
        },
    }),
    ssrCache,
    fetchExchange,
];

if (!isServer) {
    const wsClient = createWSClient({
        url: wsUrl,
    });

    const subExchange = subscriptionExchange({
        forwardSubscription: operation => ({
            subscribe: sink => ({
                unsubscribe: wsClient.subscribe(operation, sink),
            }),
        }),
    });

    exchanges.push(subExchange);
}

const client = createClient({
    url: graphqlUrl,
    exchanges,
    fetchOptions: { credentials: 'include' as const },
});

export { client, ssrCache };

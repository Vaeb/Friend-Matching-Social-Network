import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Date custom scalar type */
  Date: any;
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  errors?: Maybe<Array<Error>>;
  ok: Scalars['Boolean'];
  user?: Maybe<User>;
};

export type AuthResponseCore = {
  __typename?: 'AuthResponseCore';
  errors?: Maybe<Array<Error>>;
  ok: Scalars['Boolean'];
  user?: Maybe<UserCore>;
};

export type Error = {
  __typename?: 'Error';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type GenResponse = {
  __typename?: 'GenResponse';
  errors?: Maybe<Array<Error>>;
  ok: Scalars['Boolean'];
};

export type Interest = {
  __typename?: 'Interest';
  description?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type Match = {
  __typename?: 'Match';
  matchDate: Scalars['Date'];
  user: User;
};

export type Message = {
  __typename?: 'Message';
  createdAt: Scalars['Date'];
  from: User;
  id: Scalars['Int'];
  text: Scalars['String'];
  to: User;
};

export type MessageResponse = {
  __typename?: 'MessageResponse';
  errors?: Maybe<Array<Error>>;
  message?: Maybe<Message>;
  ok: Scalars['Boolean'];
};

export type MessageSubResponse = {
  __typename?: 'MessageSubResponse';
  fromMe: Scalars['Boolean'];
  meId: Scalars['Boolean'];
  message: Message;
  otherId: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addFriend: AuthResponse;
  addUserInterest: UserInterestResponse;
  addUserInterests: GenResponse;
  deleteUser: AuthResponse;
  login: AuthResponse;
  logout: AuthResponseCore;
  register: AuthResponse;
  sendMessage: MessageResponse;
  sendPost: SendPostResponse;
};


export type MutationAddFriendArgs = {
  remove?: InputMaybe<Scalars['Boolean']>;
  userId: Scalars['Int'];
};


export type MutationAddUserInterestArgs = {
  override?: InputMaybe<Scalars['Boolean']>;
  userInterest: UserInterestInput;
};


export type MutationAddUserInterestsArgs = {
  userInterests: Array<UserInterestInput>;
};


export type MutationLoginArgs = {
  handle: Scalars['String'];
  password: Scalars['String'];
};


export type MutationRegisterArgs = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationSendMessageArgs = {
  text: Scalars['String'];
  to: Scalars['Int'];
};


export type MutationSendPostArgs = {
  text: Scalars['String'];
};

export type Post = {
  __typename?: 'Post';
  createdAt: Scalars['Date'];
  creator: User;
  id: Scalars['Int'];
  text: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getChats: Array<User>;
  getInterests: Array<Interest>;
  getMatches: Array<Match>;
  getMessages: Array<Message>;
  getPost?: Maybe<Post>;
  getPosts: Array<Post>;
  getPostsFromFriends: Array<Post>;
  getPostsFromUser: Array<Post>;
  getUser?: Maybe<User>;
  getUserByHandle?: Maybe<User>;
  getUserInterests: Array<UserInterest>;
  getUsers: Array<User>;
  me?: Maybe<User>;
};


export type QueryGetInterestsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryGetMessagesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  target: Scalars['Int'];
};


export type QueryGetPostArgs = {
  id: Scalars['Int'];
};


export type QueryGetPostsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryGetPostsFromFriendsArgs = {
  cursor?: InputMaybe<Scalars['Int']>;
};


export type QueryGetPostsFromUserArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  userId: Scalars['Int'];
};


export type QueryGetUserArgs = {
  userId: Scalars['Int'];
};


export type QueryGetUserByHandleArgs = {
  handle: Scalars['String'];
};


export type QueryGetUsersArgs = {
  limit?: InputMaybe<Scalars['Int']>;
};

export type SendPostResponse = {
  __typename?: 'SendPostResponse';
  errors?: Maybe<Array<Error>>;
  ok: Scalars['Boolean'];
  post?: Maybe<Post>;
};

export type Subscription = {
  __typename?: 'Subscription';
  newMessage: Message;
  newPost: Post;
};

export type User = {
  __typename?: 'User';
  areFriends?: Maybe<Scalars['Boolean']>;
  compatibility?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['Date']>;
  email: Scalars['String'];
  friendDate?: Maybe<Scalars['Date']>;
  haveMatched?: Maybe<Scalars['Boolean']>;
  id: Scalars['Int'];
  matchDate?: Maybe<Scalars['Date']>;
  matchPrecision: Scalars['Int'];
  name: Scalars['String'];
  posts?: Maybe<Array<Maybe<Post>>>;
  relations?: Maybe<Array<Maybe<UserRelation>>>;
  savedPosts?: Maybe<Array<Maybe<Post>>>;
  updatedAt?: Maybe<Scalars['Date']>;
  updatedCompatibility?: Maybe<Scalars['Date']>;
  updatedInterests?: Maybe<Scalars['Date']>;
  username: Scalars['String'];
  visEmail: Scalars['Int'];
  visInterests: Scalars['Int'];
};


export type UserPostsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
};


export type UserSavedPostsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
};

export type UserCore = {
  __typename?: 'UserCore';
  id: Scalars['Int'];
  username: Scalars['String'];
};

export type UserInterest = {
  __typename?: 'UserInterest';
  interest: Interest;
  interestId: Scalars['Int'];
  score: Scalars['Int'];
  user?: Maybe<User>;
  userId: Scalars['Int'];
};

export type UserInterestInput = {
  interestId: Scalars['Int'];
  score: Scalars['Int'];
};

export type UserInterestResponse = {
  __typename?: 'UserInterestResponse';
  errors?: Maybe<Array<Error>>;
  ok: Scalars['Boolean'];
  userInterest?: Maybe<UserInterest>;
};

export type UserRelation = {
  __typename?: 'UserRelation';
  areFriends: Scalars['Boolean'];
  compatibility?: Maybe<Scalars['Int']>;
  haveMatched: Scalars['Boolean'];
  user: User;
};

export type AddFriendMutationVariables = Exact<{
  userId: Scalars['Int'];
  remove?: InputMaybe<Scalars['Boolean']>;
}>;


export type AddFriendMutation = { __typename?: 'Mutation', addFriend: { __typename?: 'AuthResponse', ok: boolean, errors?: Array<{ __typename?: 'Error', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, name: string, visInterests: number, createdAt?: any | null, areFriends?: boolean | null, friendDate?: any | null, haveMatched?: boolean | null, matchDate?: any | null } | null } };

export type AddUserInterestMutationVariables = Exact<{
  userInterest: UserInterestInput;
  override?: InputMaybe<Scalars['Boolean']>;
}>;


export type AddUserInterestMutation = { __typename?: 'Mutation', addUserInterest: { __typename?: 'UserInterestResponse', ok: boolean, errors?: Array<{ __typename?: 'Error', field: string, message: string }> | null, userInterest?: { __typename?: 'UserInterest', score: number, interest: { __typename?: 'Interest', id: number, name: string } } | null } };

export type LoginMutationVariables = Exact<{
  handle: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthResponse', ok: boolean, errors?: Array<{ __typename?: 'Error', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string } | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: { __typename?: 'AuthResponseCore', ok: boolean, errors?: Array<{ __typename?: 'Error', field: string, message: string }> | null, user?: { __typename?: 'UserCore', id: number, username: string } | null } };

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  name: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'AuthResponse', ok: boolean, errors?: Array<{ __typename?: 'Error', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string } | null } };

export type SendMessageMutationVariables = Exact<{
  to: Scalars['Int'];
  text: Scalars['String'];
}>;


export type SendMessageMutation = { __typename?: 'Mutation', sendMessage: { __typename?: 'MessageResponse', ok: boolean, errors?: Array<{ __typename?: 'Error', field: string, message: string }> | null, message?: { __typename?: 'Message', id: number, text: string, createdAt: any, from: { __typename?: 'User', id: number }, to: { __typename?: 'User', id: number } } | null } };

export type SendPostMutationVariables = Exact<{
  text: Scalars['String'];
}>;


export type SendPostMutation = { __typename?: 'Mutation', sendPost: { __typename?: 'SendPostResponse', ok: boolean, errors?: Array<{ __typename?: 'Error', field: string, message: string }> | null, post?: { __typename?: 'Post', id: number, text: string, createdAt: any, creator: { __typename?: 'User', id: number, username: string, name: string } } | null } };

export type GetChatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetChatsQuery = { __typename?: 'Query', getChats: Array<{ __typename?: 'User', id: number, username: string, name: string }> };

export type GetInterestsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetInterestsQuery = { __typename?: 'Query', getInterests: Array<{ __typename?: 'Interest', id: number, name: string }> };

export type GetMatchesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMatchesQuery = { __typename?: 'Query', getMatches: Array<{ __typename?: 'Match', matchDate: any, user: { __typename?: 'User', id: number, username: string, name: string } }> };

export type GetMessagesQueryVariables = Exact<{
  target: Scalars['Int'];
}>;


export type GetMessagesQuery = { __typename?: 'Query', getMessages: Array<{ __typename?: 'Message', id: number, text: string, createdAt: any, from: { __typename?: 'User', id: number }, to: { __typename?: 'User', id: number } }> };

export type GetPostsFromFriendsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPostsFromFriendsQuery = { __typename?: 'Query', getPostsFromFriends: Array<{ __typename?: 'Post', id: number, text: string, createdAt: any, creator: { __typename?: 'User', id: number, username: string, name: string } }> };

export type GetPostsFromUserQueryVariables = Exact<{
  userId: Scalars['Int'];
  limit?: InputMaybe<Scalars['Int']>;
}>;


export type GetPostsFromUserQuery = { __typename?: 'Query', getPostsFromUser: Array<{ __typename?: 'Post', id: number, text: string, createdAt: any, creator: { __typename?: 'User', id: number, username: string, name: string } }> };

export type GetUserQueryVariables = Exact<{
  userId: Scalars['Int'];
}>;


export type GetUserQuery = { __typename?: 'Query', getUser?: { __typename?: 'User', id: number, username: string, name: string, visInterests: number, createdAt?: any | null, areFriends?: boolean | null, friendDate?: any | null, haveMatched?: boolean | null, matchDate?: any | null } | null };

export type GetUserByHandleQueryVariables = Exact<{
  handle: Scalars['String'];
}>;


export type GetUserByHandleQuery = { __typename?: 'Query', getUserByHandle?: { __typename?: 'User', id: number, username: string, name: string, visInterests: number, createdAt?: any | null } | null };

export type GetUserInterestsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserInterestsQuery = { __typename?: 'Query', getUserInterests: Array<{ __typename?: 'UserInterest', score: number, interest: { __typename?: 'Interest', id: number, name: string } }> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: number, username: string, name: string } | null };

export type NewMessageSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NewMessageSubscription = { __typename?: 'Subscription', newMessage: { __typename?: 'Message', id: number, text: string, createdAt: any, from: { __typename?: 'User', id: number }, to: { __typename?: 'User', id: number } } };

export type NewPostSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NewPostSubscription = { __typename?: 'Subscription', newPost: { __typename?: 'Post', id: number, text: string, createdAt: any, creator: { __typename?: 'User', id: number, username: string, name: string } } };

import { IntrospectionQuery } from 'graphql';
export default {
  "__schema": {
    "queryType": {
      "name": "Query"
    },
    "mutationType": {
      "name": "Mutation"
    },
    "subscriptionType": {
      "name": "Subscription"
    },
    "types": [
      {
        "kind": "OBJECT",
        "name": "AuthResponse",
        "fields": [
          {
            "name": "errors",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "OBJECT",
                  "name": "Error",
                  "ofType": null
                }
              }
            },
            "args": []
          },
          {
            "name": "ok",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "user",
            "type": {
              "kind": "OBJECT",
              "name": "User",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "AuthResponseCore",
        "fields": [
          {
            "name": "errors",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "OBJECT",
                  "name": "Error",
                  "ofType": null
                }
              }
            },
            "args": []
          },
          {
            "name": "ok",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "user",
            "type": {
              "kind": "OBJECT",
              "name": "UserCore",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Error",
        "fields": [
          {
            "name": "field",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "message",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "GenResponse",
        "fields": [
          {
            "name": "errors",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "OBJECT",
                  "name": "Error",
                  "ofType": null
                }
              }
            },
            "args": []
          },
          {
            "name": "ok",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Interest",
        "fields": [
          {
            "name": "description",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Match",
        "fields": [
          {
            "name": "matchDate",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "user",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "User",
                "ofType": null
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Message",
        "fields": [
          {
            "name": "createdAt",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "from",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "User",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "text",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "to",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "User",
                "ofType": null
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "MessageResponse",
        "fields": [
          {
            "name": "errors",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "OBJECT",
                  "name": "Error",
                  "ofType": null
                }
              }
            },
            "args": []
          },
          {
            "name": "message",
            "type": {
              "kind": "OBJECT",
              "name": "Message",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "ok",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "MessageSubResponse",
        "fields": [
          {
            "name": "fromMe",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "meId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "message",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "Message",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "otherId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Mutation",
        "fields": [
          {
            "name": "addFriend",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "AuthResponse",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "remove",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "userId",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "addUserInterest",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "UserInterestResponse",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "override",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "userInterest",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "addUserInterests",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "GenResponse",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "userInterests",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "LIST",
                    "ofType": {
                      "kind": "NON_NULL",
                      "ofType": {
                        "kind": "SCALAR",
                        "name": "Any"
                      }
                    }
                  }
                }
              }
            ]
          },
          {
            "name": "deleteUser",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "AuthResponse",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "login",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "AuthResponse",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "handle",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "password",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "logout",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "AuthResponseCore",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "register",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "AuthResponse",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "email",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "name",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "password",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "username",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "sendMessage",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "MessageResponse",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "text",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
              {
                "name": "to",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "sendPost",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "SendPostResponse",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "text",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Post",
        "fields": [
          {
            "name": "createdAt",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "creator",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "User",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "text",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Query",
        "fields": [
          {
            "name": "getChats",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "User",
                    "ofType": null
                  }
                }
              }
            },
            "args": []
          },
          {
            "name": "getInterests",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "Interest",
                    "ofType": null
                  }
                }
              }
            },
            "args": [
              {
                "name": "limit",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "getMatches",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "Match",
                    "ofType": null
                  }
                }
              }
            },
            "args": []
          },
          {
            "name": "getMessages",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "Message",
                    "ofType": null
                  }
                }
              }
            },
            "args": [
              {
                "name": "limit",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "target",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "getPost",
            "type": {
              "kind": "OBJECT",
              "name": "Post",
              "ofType": null
            },
            "args": [
              {
                "name": "id",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "getPosts",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "Post",
                    "ofType": null
                  }
                }
              }
            },
            "args": [
              {
                "name": "limit",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "getPostsFromFriends",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "Post",
                    "ofType": null
                  }
                }
              }
            },
            "args": [
              {
                "name": "cursor",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "getPostsFromUser",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "Post",
                    "ofType": null
                  }
                }
              }
            },
            "args": [
              {
                "name": "limit",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "userId",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "getUser",
            "type": {
              "kind": "OBJECT",
              "name": "User",
              "ofType": null
            },
            "args": [
              {
                "name": "userId",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "getUserByHandle",
            "type": {
              "kind": "OBJECT",
              "name": "User",
              "ofType": null
            },
            "args": [
              {
                "name": "handle",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              }
            ]
          },
          {
            "name": "getUserInterests",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "UserInterest",
                    "ofType": null
                  }
                }
              }
            },
            "args": []
          },
          {
            "name": "getUsers",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "User",
                    "ofType": null
                  }
                }
              }
            },
            "args": [
              {
                "name": "limit",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "me",
            "type": {
              "kind": "OBJECT",
              "name": "User",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "SendPostResponse",
        "fields": [
          {
            "name": "errors",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "OBJECT",
                  "name": "Error",
                  "ofType": null
                }
              }
            },
            "args": []
          },
          {
            "name": "ok",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "post",
            "type": {
              "kind": "OBJECT",
              "name": "Post",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "Subscription",
        "fields": [
          {
            "name": "newMessage",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "Message",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "newPost",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "Post",
                "ofType": null
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "User",
        "fields": [
          {
            "name": "areFriends",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "compatibility",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "createdAt",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "email",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "friendDate",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "haveMatched",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "matchDate",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "matchPrecision",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "name",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "posts",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "Post",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "limit",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "relations",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "UserRelation",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "savedPosts",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "OBJECT",
                "name": "Post",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "limit",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "updatedAt",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "updatedCompatibility",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "updatedInterests",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "username",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "visEmail",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "visInterests",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "UserCore",
        "fields": [
          {
            "name": "id",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "username",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "UserInterest",
        "fields": [
          {
            "name": "interest",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "Interest",
                "ofType": null
              }
            },
            "args": []
          },
          {
            "name": "interestId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "score",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "user",
            "type": {
              "kind": "OBJECT",
              "name": "User",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "userId",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "UserInterestResponse",
        "fields": [
          {
            "name": "errors",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "OBJECT",
                  "name": "Error",
                  "ofType": null
                }
              }
            },
            "args": []
          },
          {
            "name": "ok",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "userInterest",
            "type": {
              "kind": "OBJECT",
              "name": "UserInterest",
              "ofType": null
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "UserRelation",
        "fields": [
          {
            "name": "areFriends",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "compatibility",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "haveMatched",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "SCALAR",
                "name": "Any"
              }
            },
            "args": []
          },
          {
            "name": "user",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "User",
                "ofType": null
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "SCALAR",
        "name": "Any"
      }
    ],
    "directives": []
  }
} as unknown as IntrospectionQuery;

export const AddFriendDocument = gql`
    mutation AddFriend($userId: Int!, $remove: Boolean) {
  addFriend(userId: $userId, remove: $remove) {
    ok
    errors {
      field
      message
    }
    user {
      id
      username
      name
      visInterests
      createdAt
      areFriends
      friendDate
      haveMatched
      matchDate
    }
  }
}
    `;

export function useAddFriendMutation() {
  return Urql.useMutation<AddFriendMutation, AddFriendMutationVariables>(AddFriendDocument);
};
export const AddUserInterestDocument = gql`
    mutation AddUserInterest($userInterest: UserInterestInput!, $override: Boolean) {
  addUserInterest(userInterest: $userInterest, override: $override) {
    ok
    errors {
      field
      message
    }
    userInterest {
      interest {
        id
        name
      }
      score
    }
  }
}
    `;

export function useAddUserInterestMutation() {
  return Urql.useMutation<AddUserInterestMutation, AddUserInterestMutationVariables>(AddUserInterestDocument);
};
export const LoginDocument = gql`
    mutation Login($handle: String!, $password: String!) {
  login(handle: $handle, password: $password) {
    ok
    errors {
      field
      message
    }
    user {
      id
      username
    }
  }
}
    `;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout {
    ok
    errors {
      field
      message
    }
    user {
      id
      username
    }
  }
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($username: String!, $email: String!, $password: String!, $name: String!) {
  register(username: $username, email: $email, password: $password, name: $name) {
    ok
    errors {
      field
      message
    }
    user {
      id
      username
    }
  }
}
    `;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const SendMessageDocument = gql`
    mutation SendMessage($to: Int!, $text: String!) {
  sendMessage(to: $to, text: $text) {
    ok
    errors {
      field
      message
    }
    message {
      id
      text
      from {
        id
      }
      to {
        id
      }
      createdAt
    }
  }
}
    `;

export function useSendMessageMutation() {
  return Urql.useMutation<SendMessageMutation, SendMessageMutationVariables>(SendMessageDocument);
};
export const SendPostDocument = gql`
    mutation SendPost($text: String!) {
  sendPost(text: $text) {
    ok
    errors {
      field
      message
    }
    post {
      id
      text
      creator {
        id
        username
        name
      }
      createdAt
    }
  }
}
    `;

export function useSendPostMutation() {
  return Urql.useMutation<SendPostMutation, SendPostMutationVariables>(SendPostDocument);
};
export const GetChatsDocument = gql`
    query GetChats {
  getChats {
    id
    username
    name
  }
}
    `;

export function useGetChatsQuery(options?: Omit<Urql.UseQueryArgs<GetChatsQueryVariables>, 'query'>) {
  return Urql.useQuery<GetChatsQuery>({ query: GetChatsDocument, ...options });
};
export const GetInterestsDocument = gql`
    query GetInterests {
  getInterests {
    id
    name
  }
}
    `;

export function useGetInterestsQuery(options?: Omit<Urql.UseQueryArgs<GetInterestsQueryVariables>, 'query'>) {
  return Urql.useQuery<GetInterestsQuery>({ query: GetInterestsDocument, ...options });
};
export const GetMatchesDocument = gql`
    query GetMatches {
  getMatches {
    user {
      id
      username
      name
    }
    matchDate
  }
}
    `;

export function useGetMatchesQuery(options?: Omit<Urql.UseQueryArgs<GetMatchesQueryVariables>, 'query'>) {
  return Urql.useQuery<GetMatchesQuery>({ query: GetMatchesDocument, ...options });
};
export const GetMessagesDocument = gql`
    query GetMessages($target: Int!) {
  getMessages(target: $target) {
    id
    text
    from {
      id
    }
    to {
      id
    }
    createdAt
  }
}
    `;

export function useGetMessagesQuery(options: Omit<Urql.UseQueryArgs<GetMessagesQueryVariables>, 'query'>) {
  return Urql.useQuery<GetMessagesQuery>({ query: GetMessagesDocument, ...options });
};
export const GetPostsFromFriendsDocument = gql`
    query GetPostsFromFriends {
  getPostsFromFriends {
    id
    text
    creator {
      id
      username
      name
    }
    createdAt
  }
}
    `;

export function useGetPostsFromFriendsQuery(options?: Omit<Urql.UseQueryArgs<GetPostsFromFriendsQueryVariables>, 'query'>) {
  return Urql.useQuery<GetPostsFromFriendsQuery>({ query: GetPostsFromFriendsDocument, ...options });
};
export const GetPostsFromUserDocument = gql`
    query GetPostsFromUser($userId: Int!, $limit: Int) {
  getPostsFromUser(userId: $userId, limit: $limit) {
    id
    text
    creator {
      id
      username
      name
    }
    createdAt
  }
}
    `;

export function useGetPostsFromUserQuery(options: Omit<Urql.UseQueryArgs<GetPostsFromUserQueryVariables>, 'query'>) {
  return Urql.useQuery<GetPostsFromUserQuery>({ query: GetPostsFromUserDocument, ...options });
};
export const GetUserDocument = gql`
    query GetUser($userId: Int!) {
  getUser(userId: $userId) {
    id
    username
    name
    visInterests
    createdAt
    areFriends
    friendDate
    haveMatched
    matchDate
  }
}
    `;

export function useGetUserQuery(options: Omit<Urql.UseQueryArgs<GetUserQueryVariables>, 'query'>) {
  return Urql.useQuery<GetUserQuery>({ query: GetUserDocument, ...options });
};
export const GetUserByHandleDocument = gql`
    query GetUserByHandle($handle: String!) {
  getUserByHandle(handle: $handle) {
    id
    username
    name
    visInterests
    createdAt
  }
}
    `;

export function useGetUserByHandleQuery(options: Omit<Urql.UseQueryArgs<GetUserByHandleQueryVariables>, 'query'>) {
  return Urql.useQuery<GetUserByHandleQuery>({ query: GetUserByHandleDocument, ...options });
};
export const GetUserInterestsDocument = gql`
    query GetUserInterests {
  getUserInterests {
    interest {
      id
      name
    }
    score
  }
}
    `;

export function useGetUserInterestsQuery(options?: Omit<Urql.UseQueryArgs<GetUserInterestsQueryVariables>, 'query'>) {
  return Urql.useQuery<GetUserInterestsQuery>({ query: GetUserInterestsDocument, ...options });
};
export const MeDocument = gql`
    query Me {
  me {
    id
    username
    name
  }
}
    `;

export function useMeQuery(options?: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'>) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const NewMessageDocument = gql`
    subscription NewMessage {
  newMessage {
    id
    text
    from {
      id
    }
    to {
      id
    }
    createdAt
  }
}
    `;

export function useNewMessageSubscription<TData = NewMessageSubscription>(options: Omit<Urql.UseSubscriptionArgs<NewMessageSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<NewMessageSubscription, TData>) {
  return Urql.useSubscription<NewMessageSubscription, TData, NewMessageSubscriptionVariables>({ query: NewMessageDocument, ...options }, handler);
};
export const NewPostDocument = gql`
    subscription NewPost {
  newPost {
    id
    text
    creator {
      id
      username
      name
    }
    createdAt
  }
}
    `;

export function useNewPostSubscription<TData = NewPostSubscription>(options: Omit<Urql.UseSubscriptionArgs<NewPostSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<NewPostSubscription, TData>) {
  return Urql.useSubscription<NewPostSubscription, TData, NewPostSubscriptionVariables>({ query: NewPostDocument, ...options }, handler);
};
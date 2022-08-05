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
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Error = {
  __typename?: 'Error';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type File = {
  __typename?: 'File';
  encoding: Scalars['String'];
  filename: Scalars['String'];
  mimetype: Scalars['String'];
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
  id: Scalars['Int'];
  matchDate: Scalars['Date'];
  user: User;
};

export type Me = {
  __typename?: 'Me';
  autoFreq?: Maybe<Scalars['Int']>;
  birthDate?: Maybe<Scalars['Date']>;
  color?: Maybe<Scalars['String']>;
  confirmedUniversityIds?: Maybe<Array<Scalars['Int']>>;
  createdAt?: Maybe<Scalars['Date']>;
  email: Scalars['String'];
  id: Scalars['Int'];
  lastAutoMatched?: Maybe<Scalars['Date']>;
  manualEnabled?: Maybe<Scalars['Boolean']>;
  matchPrecision: Scalars['Int'];
  matchStudents?: Maybe<Scalars['Boolean']>;
  name: Scalars['String'];
  snoozedUntil?: Maybe<Scalars['Date']>;
  uni?: Maybe<Scalars['String']>;
  universityId?: Maybe<Scalars['Int']>;
  updatedAt?: Maybe<Scalars['Date']>;
  updatedInterests?: Maybe<Scalars['Date']>;
  username: Scalars['String'];
  visEmail: Scalars['Int'];
  visInterests: Scalars['Int'];
};

export type MeMultiResponse = {
  __typename?: 'MeMultiResponse';
  errors?: Maybe<Array<Error>>;
  ok: Scalars['Boolean'];
  user?: Maybe<Me>;
  user2?: Maybe<User>;
};

export type MeResponse = {
  __typename?: 'MeResponse';
  errors?: Maybe<Array<Error>>;
  ok: Scalars['Boolean'];
  user?: Maybe<Me>;
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
  addFriend: UserResponse;
  addUserInterest: UserInterestResponse;
  addUserInterests: GenResponse;
  deleteUser: MeMultiResponse;
  login: MeMultiResponse;
  logout: MeMultiResponse;
  register: MeMultiResponse;
  sendMessage: MessageResponse;
  sendPost: SendPostResponse;
  singleUpload: File;
  updateMatchSettings: MeMultiResponse;
  updateMe: MeMultiResponse;
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
  universityId: Scalars['Int'];
  username: Scalars['String'];
};


export type MutationSendMessageArgs = {
  text: Scalars['String'];
  to: Scalars['Int'];
};


export type MutationSendPostArgs = {
  studentsOnly: Scalars['Boolean'];
  text: Scalars['String'];
};


export type MutationSingleUploadArgs = {
  file: Scalars['Upload'];
};


export type MutationUpdateMatchSettingsArgs = {
  autoFreq?: InputMaybe<Scalars['Int']>;
  manualEnabled?: InputMaybe<Scalars['Boolean']>;
  matchStudents?: InputMaybe<Scalars['Boolean']>;
  snoozedUntil?: InputMaybe<Scalars['Date']>;
};


export type MutationUpdateMeArgs = {
  birthDate?: InputMaybe<Scalars['Date']>;
  color?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  oldPassword?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  universityId?: InputMaybe<Scalars['Int']>;
  username?: InputMaybe<Scalars['String']>;
};

export type Post = {
  __typename?: 'Post';
  createdAt: Scalars['Date'];
  creator: User;
  id: Scalars['Int'];
  studentsOnly: Scalars['Boolean'];
  text: Scalars['String'];
  universityId: Scalars['Int'];
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
  getPostsWeighted: WeightedPosts;
  getUniversities: Array<University>;
  getUser?: Maybe<User>;
  getUserByHandle?: Maybe<User>;
  getUserInterests: Array<UserInterest>;
  getUsers: Array<User>;
  me?: Maybe<Me>;
  ping: Scalars['String'];
  pingTest?: Maybe<Scalars['String']>;
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


export type QueryGetPostsWeightedArgs = {
  cursor?: InputMaybe<Scalars['Int']>;
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
  heartbeat: Scalars['String'];
  newMessage: Message;
  newPost: Post;
  newPosts?: Maybe<Array<Post>>;
};

export type University = {
  __typename?: 'University';
  id: Scalars['Int'];
  name: Scalars['String'];
  publicRestricted: Scalars['Int'];
  shortName?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  areFriends?: Maybe<Scalars['Boolean']>;
  birthDate?: Maybe<Scalars['Date']>;
  color?: Maybe<Scalars['String']>;
  compatibility?: Maybe<Scalars['Int']>;
  confirmedUniversityIds?: Maybe<Array<Scalars['Int']>>;
  createdAt?: Maybe<Scalars['Date']>;
  friendDate?: Maybe<Scalars['Date']>;
  haveMatched?: Maybe<Scalars['Boolean']>;
  id: Scalars['Int'];
  matchDate?: Maybe<Scalars['Date']>;
  name: Scalars['String'];
  updatedAt?: Maybe<Scalars['Date']>;
  updatedCompatibility?: Maybe<Scalars['Date']>;
  username: Scalars['String'];
  visEmail: Scalars['Int'];
  visInterests: Scalars['Int'];
};

export type UserCore = {
  __typename?: 'UserCore';
  id: Scalars['Int'];
  username: Scalars['String'];
};

export type UserCoreResponse = {
  __typename?: 'UserCoreResponse';
  errors?: Maybe<Array<Error>>;
  ok: Scalars['Boolean'];
  user?: Maybe<UserCore>;
};

export type UserInterest = {
  __typename?: 'UserInterest';
  id: Scalars['String'];
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

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<Error>>;
  ok: Scalars['Boolean'];
  user?: Maybe<User>;
};

export type WeightedPosts = {
  __typename?: 'WeightedPosts';
  id: Scalars['Int'];
  posts: Array<Post>;
};

export type MeMdFieldsFragment = { __typename?: 'Me', birthDate?: any | null, uni?: string | null, manualEnabled?: boolean | null, lastAutoMatched?: any | null, autoFreq?: number | null, snoozedUntil?: any | null, matchStudents?: boolean | null, name: string, universityId?: number | null, color?: string | null, id: number, username: string };

export type MeSmFieldsFragment = { __typename?: 'Me', name: string, universityId?: number | null, color?: string | null, id: number, username: string };

export type MeXsFieldsFragment = { __typename?: 'Me', id: number, username: string };

export type UserLgFieldsFragment = { __typename?: 'User', visInterests: number, createdAt?: any | null, areFriends?: boolean | null, friendDate?: any | null, haveMatched?: boolean | null, matchDate?: any | null, birthDate?: any | null, name: string, color?: string | null, id: number, username: string };

export type UserMdFieldsFragment = { __typename?: 'User', birthDate?: any | null, name: string, color?: string | null, id: number, username: string };

export type UserSmFieldsFragment = { __typename?: 'User', name: string, color?: string | null, id: number, username: string };

export type UserXsFieldsFragment = { __typename?: 'User', id: number, username: string };

export type AddFriendMutationVariables = Exact<{
  userId: Scalars['Int'];
  remove?: InputMaybe<Scalars['Boolean']>;
}>;


export type AddFriendMutation = { __typename?: 'Mutation', addFriend: { __typename?: 'UserResponse', ok: boolean, errors?: Array<{ __typename?: 'Error', field: string, message: string }> | null, user?: { __typename?: 'User', visInterests: number, createdAt?: any | null, areFriends?: boolean | null, friendDate?: any | null, haveMatched?: boolean | null, matchDate?: any | null, birthDate?: any | null, name: string, color?: string | null, id: number, username: string } | null } };

export type AddUserInterestMutationVariables = Exact<{
  userInterest: UserInterestInput;
  override?: InputMaybe<Scalars['Boolean']>;
}>;


export type AddUserInterestMutation = { __typename?: 'Mutation', addUserInterest: { __typename?: 'UserInterestResponse', ok: boolean, errors?: Array<{ __typename?: 'Error', field: string, message: string }> | null, userInterest?: { __typename?: 'UserInterest', score: number, interest: { __typename?: 'Interest', id: number, name: string } } | null } };

export type LoginMutationVariables = Exact<{
  handle: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'MeMultiResponse', ok: boolean, errors?: Array<{ __typename?: 'Error', field: string, message: string }> | null, user?: { __typename?: 'Me', id: number, username: string } | null, user2?: { __typename?: 'User', id: number, username: string } | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: { __typename?: 'MeMultiResponse', ok: boolean, errors?: Array<{ __typename?: 'Error', field: string, message: string }> | null, user?: { __typename?: 'Me', id: number, username: string } | null, user2?: { __typename?: 'User', id: number, username: string } | null } };

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  name: Scalars['String'];
  universityId: Scalars['Int'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'MeMultiResponse', ok: boolean, errors?: Array<{ __typename?: 'Error', field: string, message: string }> | null, user?: { __typename?: 'Me', id: number, username: string } | null, user2?: { __typename?: 'User', id: number, username: string } | null } };

export type SendMessageMutationVariables = Exact<{
  to: Scalars['Int'];
  text: Scalars['String'];
}>;


export type SendMessageMutation = { __typename?: 'Mutation', sendMessage: { __typename?: 'MessageResponse', ok: boolean, errors?: Array<{ __typename?: 'Error', field: string, message: string }> | null, message?: { __typename?: 'Message', id: number, text: string, createdAt: any, from: { __typename?: 'User', id: number }, to: { __typename?: 'User', id: number } } | null } };

export type SendPostMutationVariables = Exact<{
  text: Scalars['String'];
  studentsOnly: Scalars['Boolean'];
}>;


export type SendPostMutation = { __typename?: 'Mutation', sendPost: { __typename?: 'SendPostResponse', ok: boolean, errors?: Array<{ __typename?: 'Error', field: string, message: string }> | null, post?: { __typename?: 'Post', id: number, text: string, createdAt: any, creator: { __typename?: 'User', name: string, color?: string | null, id: number, username: string } } | null } };

export type SingleUploadMutationVariables = Exact<{
  file: Scalars['Upload'];
}>;


export type SingleUploadMutation = { __typename?: 'Mutation', singleUpload: { __typename?: 'File', filename: string } };

export type UpdateMeMutationVariables = Exact<{
  username?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  oldPassword?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  color?: InputMaybe<Scalars['String']>;
  birthDate?: InputMaybe<Scalars['Date']>;
  universityId?: InputMaybe<Scalars['Int']>;
}>;


export type UpdateMeMutation = { __typename?: 'Mutation', updateMe: { __typename?: 'MeMultiResponse', ok: boolean, errors?: Array<{ __typename?: 'Error', field: string, message: string }> | null, user?: { __typename?: 'Me', birthDate?: any | null, uni?: string | null, manualEnabled?: boolean | null, lastAutoMatched?: any | null, autoFreq?: number | null, snoozedUntil?: any | null, matchStudents?: boolean | null, name: string, universityId?: number | null, color?: string | null, id: number, username: string } | null, user2?: { __typename?: 'User', birthDate?: any | null, name: string, color?: string | null, id: number, username: string } | null } };

export type GetChatsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetChatsQuery = { __typename?: 'Query', getChats: Array<{ __typename?: 'User', name: string, color?: string | null, id: number, username: string }> };

export type GetInterestsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetInterestsQuery = { __typename?: 'Query', getInterests: Array<{ __typename?: 'Interest', id: number, name: string }> };

export type GetMatchesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMatchesQuery = { __typename?: 'Query', getMatches: Array<{ __typename?: 'Match', id: number, matchDate: any, user: { __typename?: 'User', name: string, color?: string | null, id: number, username: string } }> };

export type GetMessagesQueryVariables = Exact<{
  target: Scalars['Int'];
}>;


export type GetMessagesQuery = { __typename?: 'Query', getMessages: Array<{ __typename?: 'Message', id: number, text: string, createdAt: any, from: { __typename?: 'User', id: number }, to: { __typename?: 'User', id: number } }> };

export type GetPostsFromUserQueryVariables = Exact<{
  userId: Scalars['Int'];
  limit?: InputMaybe<Scalars['Int']>;
}>;


export type GetPostsFromUserQuery = { __typename?: 'Query', getPostsFromUser: Array<{ __typename?: 'Post', id: number, text: string, createdAt: any, creator: { __typename?: 'User', name: string, color?: string | null, id: number, username: string } }> };

export type GetPostsWeightedQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPostsWeightedQuery = { __typename?: 'Query', getPostsWeighted: { __typename?: 'WeightedPosts', id: number, posts: Array<{ __typename?: 'Post', id: number, text: string, universityId: number, studentsOnly: boolean, createdAt: any, creator: { __typename?: 'User', name: string, color?: string | null, id: number, username: string } }> } };

export type GetUniversitiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUniversitiesQuery = { __typename?: 'Query', getUniversities: Array<{ __typename?: 'University', id: number, name: string, shortName?: string | null, publicRestricted: number }> };

export type GetUserQueryVariables = Exact<{
  userId: Scalars['Int'];
}>;


export type GetUserQuery = { __typename?: 'Query', getUser?: { __typename?: 'User', visInterests: number, createdAt?: any | null, areFriends?: boolean | null, friendDate?: any | null, haveMatched?: boolean | null, matchDate?: any | null, birthDate?: any | null, name: string, color?: string | null, id: number, username: string } | null };

export type GetUserByHandleQueryVariables = Exact<{
  handle: Scalars['String'];
}>;


export type GetUserByHandleQuery = { __typename?: 'Query', getUserByHandle?: { __typename?: 'User', id: number, username: string } | null };

export type GetUserInterestsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserInterestsQuery = { __typename?: 'Query', getUserInterests: Array<{ __typename?: 'UserInterest', id: string, score: number, interest: { __typename?: 'Interest', id: number, name: string } }> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'Me', birthDate?: any | null, uni?: string | null, manualEnabled?: boolean | null, lastAutoMatched?: any | null, autoFreq?: number | null, snoozedUntil?: any | null, matchStudents?: boolean | null, name: string, universityId?: number | null, color?: string | null, id: number, username: string } | null };

export type HeartbeatSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type HeartbeatSubscription = { __typename?: 'Subscription', heartbeat: string };

export type NewMessageSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NewMessageSubscription = { __typename?: 'Subscription', newMessage: { __typename?: 'Message', id: number, text: string, createdAt: any, from: { __typename?: 'User', id: number }, to: { __typename?: 'User', id: number } } };

export type NewPostSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NewPostSubscription = { __typename?: 'Subscription', newPost: { __typename?: 'Post', id: number, text: string, universityId: number, studentsOnly: boolean, createdAt: any, creator: { __typename?: 'User', name: string, color?: string | null, id: number, username: string } } };

export type NewPostsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NewPostsSubscription = { __typename?: 'Subscription', newPosts?: Array<{ __typename?: 'Post', id: number, text: string, universityId: number, studentsOnly: boolean, createdAt: any, creator: { __typename?: 'User', name: string, color?: string | null, id: number, username: string } }> | null };

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
        "name": "File",
        "fields": [
          {
            "name": "encoding",
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
            "name": "filename",
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
            "name": "mimetype",
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
        "name": "Me",
        "fields": [
          {
            "name": "autoFreq",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "birthDate",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "color",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "confirmedUniversityIds",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
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
            "name": "lastAutoMatched",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "manualEnabled",
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
            "name": "matchStudents",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
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
            "name": "snoozedUntil",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "uni",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "universityId",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
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
        "name": "MeMultiResponse",
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
              "name": "Me",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "user2",
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
        "name": "MeResponse",
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
              "name": "Me",
              "ofType": null
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
                "name": "UserResponse",
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
                "name": "MeMultiResponse",
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
                "name": "MeMultiResponse",
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
                "name": "MeMultiResponse",
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
                "name": "MeMultiResponse",
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
                "name": "universityId",
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
                "name": "studentsOnly",
                "type": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Any"
                  }
                }
              },
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
          },
          {
            "name": "singleUpload",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "File",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "file",
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
            "name": "updateMatchSettings",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "MeMultiResponse",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "autoFreq",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "manualEnabled",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "matchStudents",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "snoozedUntil",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
            ]
          },
          {
            "name": "updateMe",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "MeMultiResponse",
                "ofType": null
              }
            },
            "args": [
              {
                "name": "birthDate",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "color",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "email",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "name",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "oldPassword",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "password",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "universityId",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              },
              {
                "name": "username",
                "type": {
                  "kind": "SCALAR",
                  "name": "Any"
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
            "name": "studentsOnly",
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
            "name": "universityId",
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
            "name": "getPostsWeighted",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "OBJECT",
                "name": "WeightedPosts",
                "ofType": null
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
            "name": "getUniversities",
            "type": {
              "kind": "NON_NULL",
              "ofType": {
                "kind": "LIST",
                "ofType": {
                  "kind": "NON_NULL",
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "University",
                    "ofType": null
                  }
                }
              }
            },
            "args": []
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
              "name": "Me",
              "ofType": null
            },
            "args": []
          },
          {
            "name": "ping",
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
            "name": "pingTest",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
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
            "name": "heartbeat",
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
          },
          {
            "name": "newPosts",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "OBJECT",
                  "name": "Post",
                  "ofType": null
                }
              }
            },
            "args": []
          }
        ],
        "interfaces": []
      },
      {
        "kind": "OBJECT",
        "name": "University",
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
            "name": "publicRestricted",
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
            "name": "shortName",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
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
            "name": "birthDate",
            "type": {
              "kind": "SCALAR",
              "name": "Any"
            },
            "args": []
          },
          {
            "name": "color",
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
            "name": "confirmedUniversityIds",
            "type": {
              "kind": "LIST",
              "ofType": {
                "kind": "NON_NULL",
                "ofType": {
                  "kind": "SCALAR",
                  "name": "Any"
                }
              }
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
        "name": "UserCoreResponse",
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
        "name": "UserInterest",
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
        "kind": "OBJECT",
        "name": "UserResponse",
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
        "name": "WeightedPosts",
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
            "name": "posts",
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
export const MeXsFieldsFragmentDoc = gql`
    fragment MeXsFields on Me {
  id
  username
}
    `;
export const MeSmFieldsFragmentDoc = gql`
    fragment MeSmFields on Me {
  ...MeXsFields
  name
  universityId
  color
}
    ${MeXsFieldsFragmentDoc}`;
export const MeMdFieldsFragmentDoc = gql`
    fragment MeMdFields on Me {
  ...MeSmFields
  birthDate
  uni
  manualEnabled
  lastAutoMatched
  autoFreq
  snoozedUntil
  matchStudents
}
    ${MeSmFieldsFragmentDoc}`;
export const UserXsFieldsFragmentDoc = gql`
    fragment UserXsFields on User {
  id
  username
}
    `;
export const UserSmFieldsFragmentDoc = gql`
    fragment UserSmFields on User {
  ...UserXsFields
  name
  color
}
    ${UserXsFieldsFragmentDoc}`;
export const UserMdFieldsFragmentDoc = gql`
    fragment UserMdFields on User {
  ...UserSmFields
  birthDate
}
    ${UserSmFieldsFragmentDoc}`;
export const UserLgFieldsFragmentDoc = gql`
    fragment UserLgFields on User {
  ...UserMdFields
  visInterests
  createdAt
  areFriends
  friendDate
  haveMatched
  matchDate
}
    ${UserMdFieldsFragmentDoc}`;
export const AddFriendDocument = gql`
    mutation AddFriend($userId: Int!, $remove: Boolean) {
  addFriend(userId: $userId, remove: $remove) {
    ok
    errors {
      field
      message
    }
    user {
      ...UserLgFields
    }
  }
}
    ${UserLgFieldsFragmentDoc}`;

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
      ...MeXsFields
    }
    user2 {
      ...UserXsFields
    }
  }
}
    ${MeXsFieldsFragmentDoc}
${UserXsFieldsFragmentDoc}`;

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
      ...MeXsFields
    }
    user2 {
      ...UserXsFields
    }
  }
}
    ${MeXsFieldsFragmentDoc}
${UserXsFieldsFragmentDoc}`;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($username: String!, $email: String!, $password: String!, $name: String!, $universityId: Int!) {
  register(
    username: $username
    email: $email
    password: $password
    name: $name
    universityId: $universityId
  ) {
    ok
    errors {
      field
      message
    }
    user {
      ...MeXsFields
    }
    user2 {
      ...UserXsFields
    }
  }
}
    ${MeXsFieldsFragmentDoc}
${UserXsFieldsFragmentDoc}`;

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
    mutation SendPost($text: String!, $studentsOnly: Boolean!) {
  sendPost(text: $text, studentsOnly: $studentsOnly) {
    ok
    errors {
      field
      message
    }
    post {
      id
      text
      creator {
        ...UserSmFields
      }
      createdAt
    }
  }
}
    ${UserSmFieldsFragmentDoc}`;

export function useSendPostMutation() {
  return Urql.useMutation<SendPostMutation, SendPostMutationVariables>(SendPostDocument);
};
export const SingleUploadDocument = gql`
    mutation SingleUpload($file: Upload!) {
  singleUpload(file: $file) {
    filename
  }
}
    `;

export function useSingleUploadMutation() {
  return Urql.useMutation<SingleUploadMutation, SingleUploadMutationVariables>(SingleUploadDocument);
};
export const UpdateMeDocument = gql`
    mutation UpdateMe($username: String, $email: String, $oldPassword: String, $password: String, $name: String, $color: String, $birthDate: Date, $universityId: Int) {
  updateMe(
    username: $username
    email: $email
    oldPassword: $oldPassword
    password: $password
    name: $name
    color: $color
    birthDate: $birthDate
    universityId: $universityId
  ) {
    ok
    errors {
      field
      message
    }
    user {
      ...MeMdFields
    }
    user2 {
      ...UserMdFields
    }
  }
}
    ${MeMdFieldsFragmentDoc}
${UserMdFieldsFragmentDoc}`;

export function useUpdateMeMutation() {
  return Urql.useMutation<UpdateMeMutation, UpdateMeMutationVariables>(UpdateMeDocument);
};
export const GetChatsDocument = gql`
    query GetChats {
  getChats {
    ...UserSmFields
  }
}
    ${UserSmFieldsFragmentDoc}`;

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
    id
    user {
      ...UserSmFields
    }
    matchDate
  }
}
    ${UserSmFieldsFragmentDoc}`;

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
export const GetPostsFromUserDocument = gql`
    query GetPostsFromUser($userId: Int!, $limit: Int) {
  getPostsFromUser(userId: $userId, limit: $limit) {
    id
    text
    creator {
      ...UserSmFields
    }
    createdAt
  }
}
    ${UserSmFieldsFragmentDoc}`;

export function useGetPostsFromUserQuery(options: Omit<Urql.UseQueryArgs<GetPostsFromUserQueryVariables>, 'query'>) {
  return Urql.useQuery<GetPostsFromUserQuery>({ query: GetPostsFromUserDocument, ...options });
};
export const GetPostsWeightedDocument = gql`
    query GetPostsWeighted {
  getPostsWeighted {
    id
    posts {
      id
      text
      universityId
      studentsOnly
      creator {
        ...UserSmFields
      }
      createdAt
    }
  }
}
    ${UserSmFieldsFragmentDoc}`;

export function useGetPostsWeightedQuery(options?: Omit<Urql.UseQueryArgs<GetPostsWeightedQueryVariables>, 'query'>) {
  return Urql.useQuery<GetPostsWeightedQuery>({ query: GetPostsWeightedDocument, ...options });
};
export const GetUniversitiesDocument = gql`
    query GetUniversities {
  getUniversities {
    id
    name
    shortName
    publicRestricted
  }
}
    `;

export function useGetUniversitiesQuery(options?: Omit<Urql.UseQueryArgs<GetUniversitiesQueryVariables>, 'query'>) {
  return Urql.useQuery<GetUniversitiesQuery>({ query: GetUniversitiesDocument, ...options });
};
export const GetUserDocument = gql`
    query GetUser($userId: Int!) {
  getUser(userId: $userId) {
    ...UserLgFields
  }
}
    ${UserLgFieldsFragmentDoc}`;

export function useGetUserQuery(options: Omit<Urql.UseQueryArgs<GetUserQueryVariables>, 'query'>) {
  return Urql.useQuery<GetUserQuery>({ query: GetUserDocument, ...options });
};
export const GetUserByHandleDocument = gql`
    query GetUserByHandle($handle: String!) {
  getUserByHandle(handle: $handle) {
    ...UserXsFields
  }
}
    ${UserXsFieldsFragmentDoc}`;

export function useGetUserByHandleQuery(options: Omit<Urql.UseQueryArgs<GetUserByHandleQueryVariables>, 'query'>) {
  return Urql.useQuery<GetUserByHandleQuery>({ query: GetUserByHandleDocument, ...options });
};
export const GetUserInterestsDocument = gql`
    query GetUserInterests {
  getUserInterests {
    id
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
    ...MeMdFields
  }
}
    ${MeMdFieldsFragmentDoc}`;

export function useMeQuery(options?: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'>) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const HeartbeatDocument = gql`
    subscription Heartbeat {
  heartbeat
}
    `;

export function useHeartbeatSubscription<TData = HeartbeatSubscription>(options: Omit<Urql.UseSubscriptionArgs<HeartbeatSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<HeartbeatSubscription, TData>) {
  return Urql.useSubscription<HeartbeatSubscription, TData, HeartbeatSubscriptionVariables>({ query: HeartbeatDocument, ...options }, handler);
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
    universityId
    studentsOnly
    creator {
      ...UserSmFields
    }
    createdAt
  }
}
    ${UserSmFieldsFragmentDoc}`;

export function useNewPostSubscription<TData = NewPostSubscription>(options: Omit<Urql.UseSubscriptionArgs<NewPostSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<NewPostSubscription, TData>) {
  return Urql.useSubscription<NewPostSubscription, TData, NewPostSubscriptionVariables>({ query: NewPostDocument, ...options }, handler);
};
export const NewPostsDocument = gql`
    subscription NewPosts {
  newPosts {
    id
    text
    universityId
    studentsOnly
    creator {
      ...UserSmFields
    }
    createdAt
  }
}
    ${UserSmFieldsFragmentDoc}`;

export function useNewPostsSubscription<TData = NewPostsSubscription>(options: Omit<Urql.UseSubscriptionArgs<NewPostsSubscriptionVariables>, 'query'> = {}, handler?: Urql.SubscriptionHandler<NewPostsSubscription, TData>) {
  return Urql.useSubscription<NewPostsSubscription, TData, NewPostsSubscriptionVariables>({ query: NewPostsDocument, ...options }, handler);
};
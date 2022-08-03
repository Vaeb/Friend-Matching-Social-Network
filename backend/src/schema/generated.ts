import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
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
  deleteUser: UserResponse;
  login: UserResponse;
  logout: UserResponse;
  register: UserResponse;
  sendMessage: MessageResponse;
  sendPost: SendPostResponse;
  singleUpload: File;
  updateMe: UserResponse;
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
  me?: Maybe<User>;
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
  uni?: Maybe<Scalars['String']>;
  universityId?: Maybe<Scalars['Int']>;
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



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  Error: ResolverTypeWrapper<Error>;
  File: ResolverTypeWrapper<File>;
  GenResponse: ResolverTypeWrapper<GenResponse>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Interest: ResolverTypeWrapper<Interest>;
  Match: ResolverTypeWrapper<Match>;
  Message: ResolverTypeWrapper<Message>;
  MessageResponse: ResolverTypeWrapper<MessageResponse>;
  MessageSubResponse: ResolverTypeWrapper<MessageSubResponse>;
  Mutation: ResolverTypeWrapper<{}>;
  Post: ResolverTypeWrapper<Post>;
  Query: ResolverTypeWrapper<{}>;
  SendPostResponse: ResolverTypeWrapper<SendPostResponse>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Subscription: ResolverTypeWrapper<{}>;
  University: ResolverTypeWrapper<University>;
  Upload: ResolverTypeWrapper<Scalars['Upload']>;
  User: ResolverTypeWrapper<User>;
  UserCore: ResolverTypeWrapper<UserCore>;
  UserCoreResponse: ResolverTypeWrapper<UserCoreResponse>;
  UserInterest: ResolverTypeWrapper<UserInterest>;
  UserInterestInput: UserInterestInput;
  UserInterestResponse: ResolverTypeWrapper<UserInterestResponse>;
  UserRelation: ResolverTypeWrapper<UserRelation>;
  UserResponse: ResolverTypeWrapper<UserResponse>;
  WeightedPosts: ResolverTypeWrapper<WeightedPosts>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  Date: Scalars['Date'];
  Error: Error;
  File: File;
  GenResponse: GenResponse;
  Int: Scalars['Int'];
  Interest: Interest;
  Match: Match;
  Message: Message;
  MessageResponse: MessageResponse;
  MessageSubResponse: MessageSubResponse;
  Mutation: {};
  Post: Post;
  Query: {};
  SendPostResponse: SendPostResponse;
  String: Scalars['String'];
  Subscription: {};
  University: University;
  Upload: Scalars['Upload'];
  User: User;
  UserCore: UserCore;
  UserCoreResponse: UserCoreResponse;
  UserInterest: UserInterest;
  UserInterestInput: UserInterestInput;
  UserInterestResponse: UserInterestResponse;
  UserRelation: UserRelation;
  UserResponse: UserResponse;
  WeightedPosts: WeightedPosts;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type ErrorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Error'] = ResolversParentTypes['Error']> = {
  field?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FileResolvers<ContextType = any, ParentType extends ResolversParentTypes['File'] = ResolversParentTypes['File']> = {
  encoding?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  filename?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mimetype?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GenResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['GenResponse'] = ResolversParentTypes['GenResponse']> = {
  errors?: Resolver<Maybe<Array<ResolversTypes['Error']>>, ParentType, ContextType>;
  ok?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InterestResolvers<ContextType = any, ParentType extends ResolversParentTypes['Interest'] = ResolversParentTypes['Interest']> = {
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MatchResolvers<ContextType = any, ParentType extends ResolversParentTypes['Match'] = ResolversParentTypes['Match']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  matchDate?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MessageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Message'] = ResolversParentTypes['Message']> = {
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  from?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  to?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MessageResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['MessageResponse'] = ResolversParentTypes['MessageResponse']> = {
  errors?: Resolver<Maybe<Array<ResolversTypes['Error']>>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['Message']>, ParentType, ContextType>;
  ok?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MessageSubResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['MessageSubResponse'] = ResolversParentTypes['MessageSubResponse']> = {
  fromMe?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  meId?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['Message'], ParentType, ContextType>;
  otherId?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addFriend?: Resolver<ResolversTypes['UserResponse'], ParentType, ContextType, RequireFields<MutationAddFriendArgs, 'userId'>>;
  addUserInterest?: Resolver<ResolversTypes['UserInterestResponse'], ParentType, ContextType, RequireFields<MutationAddUserInterestArgs, 'userInterest'>>;
  addUserInterests?: Resolver<ResolversTypes['GenResponse'], ParentType, ContextType, RequireFields<MutationAddUserInterestsArgs, 'userInterests'>>;
  deleteUser?: Resolver<ResolversTypes['UserResponse'], ParentType, ContextType>;
  login?: Resolver<ResolversTypes['UserResponse'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'handle' | 'password'>>;
  logout?: Resolver<ResolversTypes['UserResponse'], ParentType, ContextType>;
  register?: Resolver<ResolversTypes['UserResponse'], ParentType, ContextType, RequireFields<MutationRegisterArgs, 'email' | 'name' | 'password' | 'universityId' | 'username'>>;
  sendMessage?: Resolver<ResolversTypes['MessageResponse'], ParentType, ContextType, RequireFields<MutationSendMessageArgs, 'text' | 'to'>>;
  sendPost?: Resolver<ResolversTypes['SendPostResponse'], ParentType, ContextType, RequireFields<MutationSendPostArgs, 'studentsOnly' | 'text'>>;
  singleUpload?: Resolver<ResolversTypes['File'], ParentType, ContextType, RequireFields<MutationSingleUploadArgs, 'file'>>;
  updateMe?: Resolver<ResolversTypes['UserResponse'], ParentType, ContextType, Partial<MutationUpdateMeArgs>>;
};

export type PostResolvers<ContextType = any, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = {
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  creator?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  studentsOnly?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  universityId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getChats?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  getInterests?: Resolver<Array<ResolversTypes['Interest']>, ParentType, ContextType, Partial<QueryGetInterestsArgs>>;
  getMatches?: Resolver<Array<ResolversTypes['Match']>, ParentType, ContextType>;
  getMessages?: Resolver<Array<ResolversTypes['Message']>, ParentType, ContextType, RequireFields<QueryGetMessagesArgs, 'target'>>;
  getPost?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<QueryGetPostArgs, 'id'>>;
  getPosts?: Resolver<Array<ResolversTypes['Post']>, ParentType, ContextType, Partial<QueryGetPostsArgs>>;
  getPostsFromFriends?: Resolver<Array<ResolversTypes['Post']>, ParentType, ContextType, Partial<QueryGetPostsFromFriendsArgs>>;
  getPostsFromUser?: Resolver<Array<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<QueryGetPostsFromUserArgs, 'userId'>>;
  getPostsWeighted?: Resolver<ResolversTypes['WeightedPosts'], ParentType, ContextType, Partial<QueryGetPostsWeightedArgs>>;
  getUniversities?: Resolver<Array<ResolversTypes['University']>, ParentType, ContextType>;
  getUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryGetUserArgs, 'userId'>>;
  getUserByHandle?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryGetUserByHandleArgs, 'handle'>>;
  getUserInterests?: Resolver<Array<ResolversTypes['UserInterest']>, ParentType, ContextType>;
  getUsers?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, Partial<QueryGetUsersArgs>>;
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  ping?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pingTest?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type SendPostResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['SendPostResponse'] = ResolversParentTypes['SendPostResponse']> = {
  errors?: Resolver<Maybe<Array<ResolversTypes['Error']>>, ParentType, ContextType>;
  ok?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  post?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  heartbeat?: SubscriptionResolver<ResolversTypes['String'], "heartbeat", ParentType, ContextType>;
  newMessage?: SubscriptionResolver<ResolversTypes['Message'], "newMessage", ParentType, ContextType>;
  newPost?: SubscriptionResolver<ResolversTypes['Post'], "newPost", ParentType, ContextType>;
  newPosts?: SubscriptionResolver<Maybe<Array<ResolversTypes['Post']>>, "newPosts", ParentType, ContextType>;
};

export type UniversityResolvers<ContextType = any, ParentType extends ResolversParentTypes['University'] = ResolversParentTypes['University']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  publicRestricted?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  shortName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  areFriends?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  birthDate?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  color?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  compatibility?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  friendDate?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  haveMatched?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  matchDate?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  matchPrecision?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  posts?: Resolver<Maybe<Array<Maybe<ResolversTypes['Post']>>>, ParentType, ContextType, Partial<UserPostsArgs>>;
  relations?: Resolver<Maybe<Array<Maybe<ResolversTypes['UserRelation']>>>, ParentType, ContextType>;
  savedPosts?: Resolver<Maybe<Array<Maybe<ResolversTypes['Post']>>>, ParentType, ContextType, Partial<UserSavedPostsArgs>>;
  uni?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  universityId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  updatedCompatibility?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  updatedInterests?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  visEmail?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  visInterests?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserCoreResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserCore'] = ResolversParentTypes['UserCore']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserCoreResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserCoreResponse'] = ResolversParentTypes['UserCoreResponse']> = {
  errors?: Resolver<Maybe<Array<ResolversTypes['Error']>>, ParentType, ContextType>;
  ok?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['UserCore']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserInterestResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserInterest'] = ResolversParentTypes['UserInterest']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  interest?: Resolver<ResolversTypes['Interest'], ParentType, ContextType>;
  interestId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  score?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserInterestResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserInterestResponse'] = ResolversParentTypes['UserInterestResponse']> = {
  errors?: Resolver<Maybe<Array<ResolversTypes['Error']>>, ParentType, ContextType>;
  ok?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  userInterest?: Resolver<Maybe<ResolversTypes['UserInterest']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserRelationResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserRelation'] = ResolversParentTypes['UserRelation']> = {
  areFriends?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  compatibility?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  haveMatched?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserResponse'] = ResolversParentTypes['UserResponse']> = {
  errors?: Resolver<Maybe<Array<ResolversTypes['Error']>>, ParentType, ContextType>;
  ok?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type WeightedPostsResolvers<ContextType = any, ParentType extends ResolversParentTypes['WeightedPosts'] = ResolversParentTypes['WeightedPosts']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  posts?: Resolver<Array<ResolversTypes['Post']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Date?: GraphQLScalarType;
  Error?: ErrorResolvers<ContextType>;
  File?: FileResolvers<ContextType>;
  GenResponse?: GenResponseResolvers<ContextType>;
  Interest?: InterestResolvers<ContextType>;
  Match?: MatchResolvers<ContextType>;
  Message?: MessageResolvers<ContextType>;
  MessageResponse?: MessageResponseResolvers<ContextType>;
  MessageSubResponse?: MessageSubResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SendPostResponse?: SendPostResponseResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  University?: UniversityResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  UserCore?: UserCoreResolvers<ContextType>;
  UserCoreResponse?: UserCoreResponseResolvers<ContextType>;
  UserInterest?: UserInterestResolvers<ContextType>;
  UserInterestResponse?: UserInterestResponseResolvers<ContextType>;
  UserRelation?: UserRelationResolvers<ContextType>;
  UserResponse?: UserResponseResolvers<ContextType>;
  WeightedPosts?: WeightedPostsResolvers<ContextType>;
};


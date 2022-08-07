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

export type ChatsStore = {
  __typename?: 'ChatsStore';
  id: Scalars['Int'];
  users: Array<User>;
};

export type Comment = {
  __typename?: 'Comment';
  author: User;
  children?: Maybe<Array<Comment>>;
  createdAt: Scalars['Date'];
  id: Scalars['Int'];
  numLikes: Scalars['Int'];
  parent?: Maybe<Comment>;
  post?: Maybe<Post>;
  reactions?: Maybe<Array<Reaction>>;
  text: Scalars['String'];
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

export type FrStore = {
  __typename?: 'FrStore';
  id: Scalars['Int'];
  users: Array<User>;
};

export type FriendRequestPubsub = {
  __typename?: 'FriendRequestPubsub';
  chats: ChatsStore;
  fr: FrStore;
  matches: MatchesStore;
  user: User;
};

export enum FriendRequestType {
  Accept = 'ACCEPT',
  Remove = 'REMOVE',
  Request = 'REQUEST'
}

export type FriendResponse = {
  __typename?: 'FriendResponse';
  chats?: Maybe<ChatsStore>;
  errors?: Maybe<Array<Error>>;
  fr?: Maybe<FrStore>;
  matches?: Maybe<MatchesStore>;
  me?: Maybe<Me>;
  ok: Scalars['Boolean'];
  type?: Maybe<FriendRequestType>;
  user?: Maybe<User>;
};

export type FriendStatus = {
  __typename?: 'FriendStatus';
  consumer?: Maybe<User>;
  initiator?: Maybe<User>;
  receiver?: Maybe<User>;
  sender?: Maybe<User>;
  type?: Maybe<FriendRequestType>;
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

export type ManualMatchResponse = {
  __typename?: 'ManualMatchResponse';
  matchesStore?: Maybe<MatchesStore>;
  me?: Maybe<Me>;
  success: Scalars['Boolean'];
};

export type Match = {
  __typename?: 'Match';
  id: Scalars['Int'];
  matchDate?: Maybe<Scalars['Date']>;
  user: User;
};

export type MatchesStore = {
  __typename?: 'MatchesStore';
  id: Scalars['Int'];
  matches: Array<Match>;
  me?: Maybe<Me>;
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
  matchQuality: Scalars['Int'];
  matchingEnabled: Scalars['Boolean'];
  name: Scalars['String'];
  nextManualMatchId?: Maybe<Scalars['Int']>;
  snoozedUntil?: Maybe<Scalars['Date']>;
  studentsOnly?: Maybe<Scalars['Boolean']>;
  uni?: Maybe<Scalars['String']>;
  uniConfirmed?: Maybe<Scalars['Boolean']>;
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
  addFriend: FriendResponse;
  addUserInterest: UserInterestResponse;
  addUserInterests: GenResponse;
  deleteUser: MeMultiResponse;
  login: MeMultiResponse;
  logout: MeMultiResponse;
  manualMatch: ManualMatchResponse;
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
  snoozedUntil?: InputMaybe<Scalars['Date']>;
  studentsOnly?: InputMaybe<Scalars['Boolean']>;
};


export type MutationUpdateMeArgs = {
  birthDate?: InputMaybe<Scalars['Date']>;
  color?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  matchQuality?: InputMaybe<Scalars['Int']>;
  matchingEnabled?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  oldPassword?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  universityEmail?: InputMaybe<Scalars['String']>;
  universityId?: InputMaybe<Scalars['Int']>;
  username?: InputMaybe<Scalars['String']>;
};

export type Post = {
  __typename?: 'Post';
  author: User;
  comments: Array<Comment>;
  createdAt: Scalars['Date'];
  id: Scalars['Int'];
  numLikes: Scalars['Int'];
  reactions?: Maybe<Array<Reaction>>;
  studentsOnly: Scalars['Boolean'];
  text: Scalars['String'];
  universityId: Scalars['Int'];
};

export type PostsStore = {
  __typename?: 'PostsStore';
  id: Scalars['Int'];
  posts: Array<Post>;
};

export type Query = {
  __typename?: 'Query';
  getChats: ChatsStore;
  getFriendRequests: FrStore;
  getInterests: Array<Interest>;
  getMatches: MatchesStore;
  getMessages: Array<Message>;
  getPost?: Maybe<Post>;
  getPosts: Array<Post>;
  getPostsFromFriends: Array<Post>;
  getPostsFromUser: Array<Post>;
  getPostsWeighted: PostsStore;
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
  view: Scalars['String'];
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

export type Reaction = {
  __typename?: 'Reaction';
  num: Scalars['Int'];
  type: Scalars['String'];
  userIds?: Maybe<Array<Scalars['Int']>>;
};

export type SendPostResponse = {
  __typename?: 'SendPostResponse';
  errors?: Maybe<Array<Error>>;
  ok: Scalars['Boolean'];
  post?: Maybe<Post>;
};

export type Subscription = {
  __typename?: 'Subscription';
  friendRequest: FriendRequestPubsub;
  heartbeat: Scalars['String'];
  manualMatchAvailable: Scalars['Int'];
  newAutoMatch: Match;
  newManualMatch: MatchesStore;
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
  receivedFrFrom?: Maybe<Scalars['Boolean']>;
  sentFrTo?: Maybe<Scalars['Boolean']>;
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
  ChatsStore: ResolverTypeWrapper<ChatsStore>;
  Comment: ResolverTypeWrapper<Comment>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  Error: ResolverTypeWrapper<Error>;
  File: ResolverTypeWrapper<File>;
  FrStore: ResolverTypeWrapper<FrStore>;
  FriendRequestPubsub: ResolverTypeWrapper<FriendRequestPubsub>;
  FriendRequestType: FriendRequestType;
  FriendResponse: ResolverTypeWrapper<FriendResponse>;
  FriendStatus: ResolverTypeWrapper<FriendStatus>;
  GenResponse: ResolverTypeWrapper<GenResponse>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Interest: ResolverTypeWrapper<Interest>;
  ManualMatchResponse: ResolverTypeWrapper<ManualMatchResponse>;
  Match: ResolverTypeWrapper<Match>;
  MatchesStore: ResolverTypeWrapper<MatchesStore>;
  Me: ResolverTypeWrapper<Me>;
  MeMultiResponse: ResolverTypeWrapper<MeMultiResponse>;
  MeResponse: ResolverTypeWrapper<MeResponse>;
  Message: ResolverTypeWrapper<Message>;
  MessageResponse: ResolverTypeWrapper<MessageResponse>;
  MessageSubResponse: ResolverTypeWrapper<MessageSubResponse>;
  Mutation: ResolverTypeWrapper<{}>;
  Post: ResolverTypeWrapper<Post>;
  PostsStore: ResolverTypeWrapper<PostsStore>;
  Query: ResolverTypeWrapper<{}>;
  Reaction: ResolverTypeWrapper<Reaction>;
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
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  ChatsStore: ChatsStore;
  Comment: Comment;
  Date: Scalars['Date'];
  Error: Error;
  File: File;
  FrStore: FrStore;
  FriendRequestPubsub: FriendRequestPubsub;
  FriendResponse: FriendResponse;
  FriendStatus: FriendStatus;
  GenResponse: GenResponse;
  Int: Scalars['Int'];
  Interest: Interest;
  ManualMatchResponse: ManualMatchResponse;
  Match: Match;
  MatchesStore: MatchesStore;
  Me: Me;
  MeMultiResponse: MeMultiResponse;
  MeResponse: MeResponse;
  Message: Message;
  MessageResponse: MessageResponse;
  MessageSubResponse: MessageSubResponse;
  Mutation: {};
  Post: Post;
  PostsStore: PostsStore;
  Query: {};
  Reaction: Reaction;
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
};

export type ChatsStoreResolvers<ContextType = any, ParentType extends ResolversParentTypes['ChatsStore'] = ResolversParentTypes['ChatsStore']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Comment'] = ResolversParentTypes['Comment']> = {
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  children?: Resolver<Maybe<Array<ResolversTypes['Comment']>>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  numLikes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  parent?: Resolver<Maybe<ResolversTypes['Comment']>, ParentType, ContextType>;
  post?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType>;
  reactions?: Resolver<Maybe<Array<ResolversTypes['Reaction']>>, ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
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

export type FrStoreResolvers<ContextType = any, ParentType extends ResolversParentTypes['FrStore'] = ResolversParentTypes['FrStore']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FriendRequestPubsubResolvers<ContextType = any, ParentType extends ResolversParentTypes['FriendRequestPubsub'] = ResolversParentTypes['FriendRequestPubsub']> = {
  chats?: Resolver<ResolversTypes['ChatsStore'], ParentType, ContextType>;
  fr?: Resolver<ResolversTypes['FrStore'], ParentType, ContextType>;
  matches?: Resolver<ResolversTypes['MatchesStore'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FriendResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['FriendResponse'] = ResolversParentTypes['FriendResponse']> = {
  chats?: Resolver<Maybe<ResolversTypes['ChatsStore']>, ParentType, ContextType>;
  errors?: Resolver<Maybe<Array<ResolversTypes['Error']>>, ParentType, ContextType>;
  fr?: Resolver<Maybe<ResolversTypes['FrStore']>, ParentType, ContextType>;
  matches?: Resolver<Maybe<ResolversTypes['MatchesStore']>, ParentType, ContextType>;
  me?: Resolver<Maybe<ResolversTypes['Me']>, ParentType, ContextType>;
  ok?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['FriendRequestType']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FriendStatusResolvers<ContextType = any, ParentType extends ResolversParentTypes['FriendStatus'] = ResolversParentTypes['FriendStatus']> = {
  consumer?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  initiator?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  receiver?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  sender?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['FriendRequestType']>, ParentType, ContextType>;
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

export type ManualMatchResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['ManualMatchResponse'] = ResolversParentTypes['ManualMatchResponse']> = {
  matchesStore?: Resolver<Maybe<ResolversTypes['MatchesStore']>, ParentType, ContextType>;
  me?: Resolver<Maybe<ResolversTypes['Me']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MatchResolvers<ContextType = any, ParentType extends ResolversParentTypes['Match'] = ResolversParentTypes['Match']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  matchDate?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MatchesStoreResolvers<ContextType = any, ParentType extends ResolversParentTypes['MatchesStore'] = ResolversParentTypes['MatchesStore']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  matches?: Resolver<Array<ResolversTypes['Match']>, ParentType, ContextType>;
  me?: Resolver<Maybe<ResolversTypes['Me']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Me'] = ResolversParentTypes['Me']> = {
  autoFreq?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  birthDate?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  color?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  confirmedUniversityIds?: Resolver<Maybe<Array<ResolversTypes['Int']>>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  lastAutoMatched?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  manualEnabled?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  matchQuality?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  matchingEnabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nextManualMatchId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  snoozedUntil?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  studentsOnly?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  uni?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  uniConfirmed?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  universityId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  updatedInterests?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  visEmail?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  visInterests?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MeMultiResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['MeMultiResponse'] = ResolversParentTypes['MeMultiResponse']> = {
  errors?: Resolver<Maybe<Array<ResolversTypes['Error']>>, ParentType, ContextType>;
  ok?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['Me']>, ParentType, ContextType>;
  user2?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MeResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['MeResponse'] = ResolversParentTypes['MeResponse']> = {
  errors?: Resolver<Maybe<Array<ResolversTypes['Error']>>, ParentType, ContextType>;
  ok?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['Me']>, ParentType, ContextType>;
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
  addFriend?: Resolver<ResolversTypes['FriendResponse'], ParentType, ContextType, RequireFields<MutationAddFriendArgs, 'userId'>>;
  addUserInterest?: Resolver<ResolversTypes['UserInterestResponse'], ParentType, ContextType, RequireFields<MutationAddUserInterestArgs, 'userInterest'>>;
  addUserInterests?: Resolver<ResolversTypes['GenResponse'], ParentType, ContextType, RequireFields<MutationAddUserInterestsArgs, 'userInterests'>>;
  deleteUser?: Resolver<ResolversTypes['MeMultiResponse'], ParentType, ContextType>;
  login?: Resolver<ResolversTypes['MeMultiResponse'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'handle' | 'password'>>;
  logout?: Resolver<ResolversTypes['MeMultiResponse'], ParentType, ContextType>;
  manualMatch?: Resolver<ResolversTypes['ManualMatchResponse'], ParentType, ContextType>;
  register?: Resolver<ResolversTypes['MeMultiResponse'], ParentType, ContextType, RequireFields<MutationRegisterArgs, 'email' | 'name' | 'password' | 'universityId' | 'username'>>;
  sendMessage?: Resolver<ResolversTypes['MessageResponse'], ParentType, ContextType, RequireFields<MutationSendMessageArgs, 'text' | 'to'>>;
  sendPost?: Resolver<ResolversTypes['SendPostResponse'], ParentType, ContextType, RequireFields<MutationSendPostArgs, 'studentsOnly' | 'text'>>;
  singleUpload?: Resolver<ResolversTypes['File'], ParentType, ContextType, RequireFields<MutationSingleUploadArgs, 'file'>>;
  updateMatchSettings?: Resolver<ResolversTypes['MeMultiResponse'], ParentType, ContextType, Partial<MutationUpdateMatchSettingsArgs>>;
  updateMe?: Resolver<ResolversTypes['MeMultiResponse'], ParentType, ContextType, Partial<MutationUpdateMeArgs>>;
};

export type PostResolvers<ContextType = any, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = {
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  comments?: Resolver<Array<ResolversTypes['Comment']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  numLikes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  reactions?: Resolver<Maybe<Array<ResolversTypes['Reaction']>>, ParentType, ContextType>;
  studentsOnly?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  universityId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PostsStoreResolvers<ContextType = any, ParentType extends ResolversParentTypes['PostsStore'] = ResolversParentTypes['PostsStore']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  posts?: Resolver<Array<ResolversTypes['Post']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getChats?: Resolver<ResolversTypes['ChatsStore'], ParentType, ContextType>;
  getFriendRequests?: Resolver<ResolversTypes['FrStore'], ParentType, ContextType>;
  getInterests?: Resolver<Array<ResolversTypes['Interest']>, ParentType, ContextType, Partial<QueryGetInterestsArgs>>;
  getMatches?: Resolver<ResolversTypes['MatchesStore'], ParentType, ContextType>;
  getMessages?: Resolver<Array<ResolversTypes['Message']>, ParentType, ContextType, RequireFields<QueryGetMessagesArgs, 'target'>>;
  getPost?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<QueryGetPostArgs, 'id'>>;
  getPosts?: Resolver<Array<ResolversTypes['Post']>, ParentType, ContextType, Partial<QueryGetPostsArgs>>;
  getPostsFromFriends?: Resolver<Array<ResolversTypes['Post']>, ParentType, ContextType, Partial<QueryGetPostsFromFriendsArgs>>;
  getPostsFromUser?: Resolver<Array<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<QueryGetPostsFromUserArgs, 'userId'>>;
  getPostsWeighted?: Resolver<ResolversTypes['PostsStore'], ParentType, ContextType, RequireFields<QueryGetPostsWeightedArgs, 'view'>>;
  getUniversities?: Resolver<Array<ResolversTypes['University']>, ParentType, ContextType>;
  getUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryGetUserArgs, 'userId'>>;
  getUserByHandle?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryGetUserByHandleArgs, 'handle'>>;
  getUserInterests?: Resolver<Array<ResolversTypes['UserInterest']>, ParentType, ContextType>;
  getUsers?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, Partial<QueryGetUsersArgs>>;
  me?: Resolver<Maybe<ResolversTypes['Me']>, ParentType, ContextType>;
  ping?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pingTest?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type ReactionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Reaction'] = ResolversParentTypes['Reaction']> = {
  num?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userIds?: Resolver<Maybe<Array<ResolversTypes['Int']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SendPostResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['SendPostResponse'] = ResolversParentTypes['SendPostResponse']> = {
  errors?: Resolver<Maybe<Array<ResolversTypes['Error']>>, ParentType, ContextType>;
  ok?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  post?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  friendRequest?: SubscriptionResolver<ResolversTypes['FriendRequestPubsub'], "friendRequest", ParentType, ContextType>;
  heartbeat?: SubscriptionResolver<ResolversTypes['String'], "heartbeat", ParentType, ContextType>;
  manualMatchAvailable?: SubscriptionResolver<ResolversTypes['Int'], "manualMatchAvailable", ParentType, ContextType>;
  newAutoMatch?: SubscriptionResolver<ResolversTypes['Match'], "newAutoMatch", ParentType, ContextType>;
  newManualMatch?: SubscriptionResolver<ResolversTypes['MatchesStore'], "newManualMatch", ParentType, ContextType>;
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
  confirmedUniversityIds?: Resolver<Maybe<Array<ResolversTypes['Int']>>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  friendDate?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  haveMatched?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  matchDate?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  receivedFrFrom?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  sentFrTo?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  updatedCompatibility?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
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

export type Resolvers<ContextType = any> = {
  ChatsStore?: ChatsStoreResolvers<ContextType>;
  Comment?: CommentResolvers<ContextType>;
  Date?: GraphQLScalarType;
  Error?: ErrorResolvers<ContextType>;
  File?: FileResolvers<ContextType>;
  FrStore?: FrStoreResolvers<ContextType>;
  FriendRequestPubsub?: FriendRequestPubsubResolvers<ContextType>;
  FriendResponse?: FriendResponseResolvers<ContextType>;
  FriendStatus?: FriendStatusResolvers<ContextType>;
  GenResponse?: GenResponseResolvers<ContextType>;
  Interest?: InterestResolvers<ContextType>;
  ManualMatchResponse?: ManualMatchResponseResolvers<ContextType>;
  Match?: MatchResolvers<ContextType>;
  MatchesStore?: MatchesStoreResolvers<ContextType>;
  Me?: MeResolvers<ContextType>;
  MeMultiResponse?: MeMultiResponseResolvers<ContextType>;
  MeResponse?: MeResponseResolvers<ContextType>;
  Message?: MessageResolvers<ContextType>;
  MessageResponse?: MessageResponseResolvers<ContextType>;
  MessageSubResponse?: MessageSubResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  PostsStore?: PostsStoreResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Reaction?: ReactionResolvers<ContextType>;
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
};


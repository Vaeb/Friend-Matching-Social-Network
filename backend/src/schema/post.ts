export default `
    type Post {
        id: ID!
        creator: User!
        text: String!
        savedBy(limit: Int): [User]!
        createdAt: String!
    }

    type AddPostResponse {
        ok: Boolean!
        errors: [Error!]
        post: Post
    }

    type Query {
        getPost(id: Int!): Post
        getPosts(limit: Int): [Post]!
        getPostsFromUser(userId: Int!, limit: Int): [Post]
    }

    type Mutation {
        addPost(creatorId: Int!, text: String!): AddPostResponse!
    }
`;
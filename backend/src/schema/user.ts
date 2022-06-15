export default `
    type User {
        id: ID!
        username: String!
        email: String!
        forename: String!
        surname: String!
        matchPrecision: Int!
        visEmail: Int!
        visInterests: Int!
        relations: [User]!
        posts(limit: Int): [Post]!
        comments(limit: Int): [Int]!
        reactions(limit: Int): [Int]!
        savedPosts(limit: Int): [Post]!
        createdAt: String!
    }

    type AuthResponse {
        ok: Boolean!
        error: String
        user: User
    }

    type Query {
        getUser(id: Int!): User
        getUsers(limit: Int): [User]!
        whoami: String!
    }

    type Mutation {
        register(username: String!, email: String!, password: String!, forename: String!, surname: String!): AuthResponse!
        login(handle: String!, password: String!): AuthResponse!
        deleteUser(id: Int!): AuthResponse!
    }
`;

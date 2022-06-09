export default `
    type User {
        id: ID!
        username: String!
        email: String!
        firstName: String!
        lastName: String!
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

    type UserResponse {
        ok: Boolean!
        errors: [Error!]
        user: User
    }

    type Query {
        getUser(id: Int!): User
        getUsers(limit: Int): [User]!
    }

    type Mutation {
        register(username: String!, email: String!, password: String!, firstName: String!, lastName: String!): UserResponse!
        login(username: String, email: String, password: String!): UserResponse!
        deleteUser(id: Int!): UserResponse!
    }
`;

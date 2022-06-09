import PrismaWrapper from '@prisma/client';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import express from 'express';

import typeDefs from './schema';
import resolvers from './resolvers';
import { Context } from './types';

const { PrismaClient } = PrismaWrapper;

export const prisma = new PrismaClient();

export const listen = async (): Promise<void> => {
    console.log('Starting server...');

    const app = express();

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => ({
            prisma,
            serverUrl: `${req.protocol}://${req.get('host')}`,
        } as Context),
        plugins: [
            ApolloServerPluginLandingPageLocalDefault({ footer: false, embed: true }),
        ],
    });

    await server.start();

    server.applyMiddleware({ app });

    app.use((_req, res) => {
        res.status(200);
        res.send('This is not a valid API endpoint.');
        res.end();
    });

    app.listen({ port: 4000 }, () => {
        console.log(`Server listening @ http://localhost:4000${server.graphqlPath}`);
    });

    console.log('Setup done!');
};
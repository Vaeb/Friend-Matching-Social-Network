import 'dotenv/config';
import PrismaWrapper from '@prisma/client';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import typeDefs from './schema';
import resolvers from './resolvers';
import { Context } from './types';

const { PrismaClient } = PrismaWrapper;

const corsConfig =
    process.env.ENV === 'PROD'
        ? { origin: 'https://vaeb.io:4000', credentials: true }
        : { origin: 'http://localhost:4000', credentials: true };

export const prisma = new PrismaClient();
console.log('Created prisma client!');

export const listen = async (): Promise<void> => {
    console.log('Starting server...');

    const app = express();
    app.use(cors(corsConfig));
    app.use(cookieParser());

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) =>
            ({
                prisma,
                serverUrl: `${req.protocol}://${req.get('host')}`,
            } as Context),
        plugins: [ApolloServerPluginLandingPageLocalDefault({ footer: false, embed: true })],
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

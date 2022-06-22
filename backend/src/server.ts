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
import { authenticateTokens } from './authentication';

const { PrismaClient } = PrismaWrapper;

// const whitelist = ['https://vaeb.io:3000', 'http://vaeb.io:3000', 'http://localhost:3000', 'http://localhost:3000'];
const corsConfig = {
    origin: function (origin: any, callback: any) {
        if (!origin || /^https?:\/\/(?:vaeb\.io|localhost):(?:3000|4000)\b/.test(origin)) {
            callback(null, true);
        } else {
            console.log('Bad:', origin);
            callback(new Error('Not allowed by CORS (bad origin)'));
        }
    },
    credentials: true,
};

export const prisma = new PrismaClient();
console.log('Created prisma client!');

export const listen = async (): Promise<void> => {
    console.log('Starting server...');

    const app = express();
    app.enable('trust proxy');
    app.use(cors(corsConfig));
    app.use(cookieParser());
    app.use(authenticateTokens);

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req, res }) =>
            ({
                req,
                res,
                serverUrl: `${req.protocol}://${req.get('host')}`,
                userCore: (req as Context['req']).userCore,
            } as Context),
        plugins: [ApolloServerPluginLandingPageLocalDefault({ footer: false, embed: true })],
    });

    await server.start();

    server.applyMiddleware({ app, cors: false });

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

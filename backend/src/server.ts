import 'dotenv/config';
import PrismaWrapper from '@prisma/client';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import fs from 'fs';
import path from 'path';
import http from 'http';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
// @ts-ignore
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';

// Don't import ./utils.ts (b/c prisma cycle)
import typeDefs from './schema';
import resolvers from './resolvers';
import { Context, Context2 } from './types';
import { authenticateTokens, getUserCoreFromTokens } from './authentication';

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

const readCookies = (cookieStr: string) =>
    cookieStr.split(/; */).reduce((obj, str) => {
        if (str === '') return obj;
        const eq = str.indexOf('=');
        const key = eq > 0 ? str.slice(0, eq) : str;
        let val = eq > 0 ? str.slice(eq + 1) : null;
        if (val != null)
            try {
                val = decodeURIComponent(val);
            } catch (ex) {
                /* pass */
            }
        obj[key] = val;
        return obj;
    }, {});

export const listen = async (): Promise<void> => {
    console.log('Starting server...');

    const app = express();
    app.enable('trust proxy');
    app.use(cors(corsConfig));
    app.use(cookieParser());
    app.use(authenticateTokens);

    const httpServer = http.createServer(app);

    const schema = makeExecutableSchema({ typeDefs, resolvers });

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql',
    });

    const serverCleanup = useServer(
        {
            schema,
            context: (ctx) => {
                const cookies = readCookies(ctx.extra.request.headers.cookie);
                const userCore = getUserCoreFromTokens(cookies);
                return {
                    userCore,
                } as Context2;
            },
        },
        wsServer
    );

    const server = new ApolloServer({
        schema,
        context: ({ req, res }) =>
            ({
                req,
                res,
                serverUrl: `${req.protocol}://${req.get('host')}`,
                userCore: (req as Context['req']).userCore,
            } as Context),
        formatError: (err) => {
            console.log('\n>>> Error from GraphQL resolver:');
            console.dir(err, { depth: null });
            return err;
        },
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
            ApolloServerPluginLandingPageLocalDefault({ footer: false, embed: true }),
        ],
    });

    await server.start();

    app.use(graphqlUploadExpress());

    server.applyMiddleware({ app, cors: false });

    app.get('/img/:imageName', function (req, res) {
        const imgPath = path.resolve(`./images/${req.params.imageName}`); // yarn ran from backend/
        console.log('Request for image:', imgPath);
        if (fs.existsSync(imgPath)) {
            res.sendFile(imgPath);
        } else {
            res.sendFile(path.resolve('./images/Default-5b.png'));
        }
    });

    app.use((_req, res) => {
        res.status(200);
        res.send('This is not a valid API endpoint.');
        res.end();
    });

    await new Promise<void>(resolve => httpServer.listen({ port: 4000 }, resolve));

    console.log(`Server listening @ http://localhost:4000${server.graphqlPath}`);

    console.log('Setup done!');
};

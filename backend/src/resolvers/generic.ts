import { GraphQLScalarType, Kind } from 'graphql';
// @ts-ignore
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import { finished } from 'stream/promises';
import fs from 'fs';

import { Resolvers } from '../schema/generated';
import path from 'path';
import { Context } from '../types';
import { HEARTBEAT, pubsub } from '../pubsub';

const dateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value: any) {
        return +value; // Convert outgoing Date to integer for JSON
    },
    parseValue(value: any) {
        return new Date(value); // Convert incoming integer to Date
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
            return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
        }
        return null; // Invalid hard-coded value (not an integer)
    },
});

const resolvers: Resolvers = {
    Date: dateScalar,
    Upload: GraphQLUpload,
    Subscription: {
        heartbeat: {
            resolve: payload => payload,
            subscribe: () => pubsub.asyncIterator(HEARTBEAT) as any,
        },
    },
    Mutation: {
        singleUpload: async (parent, { file }, { userCore }: Context) => {
            console.log('Got request for', file);

            const fileData = await file;
            const { createReadStream, filename, mimetype, encoding } = fileData;

            console.log('Got data from file', 'filename', filename, 'mimetype', mimetype, 'encoding', encoding, 'createReadStream', createReadStream);
            console.log(fileData);

            const stream = createReadStream();

            // const fileExt = filename.match(/\.\w+$/)[0];
            const fileExt = '.png';
            const imgPath = path.resolve(`./images/avatar-${userCore.id}${fileExt}`);

            const out = fs.createWriteStream(imgPath);
            stream.pipe(out);
            await finished(out);
    
            return { filename, mimetype, encoding };
        },
    },
};

export default resolvers;

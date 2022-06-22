// import path from 'path';
// import { fileURLToPath } from 'url';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const typesArray = loadFilesSync('src/schema/*.graphql', { extensions: ['graphql'] });

export default mergeTypeDefs(typesArray);

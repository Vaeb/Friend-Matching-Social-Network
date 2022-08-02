import { listen } from './server';
import sourceMapSupport from 'source-map-support';

sourceMapSupport.install();

process.on('uncaughtException', (err) => {
    console.log('\n>>> Process Errored (Uncaught Exception):');
    console.error(err);
    console.log('Exiting...');
    process.exit(1);
});

process.on('unhandledRejection', (reason, p) => {
    console.log('\n>>> Unhandled Promise Rejection at:', p);
    console.log('Reason:', reason);
});

await listen();

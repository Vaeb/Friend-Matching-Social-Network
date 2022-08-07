import { RedisPubSub } from 'graphql-redis-subscriptions';

export const pubsub = new RedisPubSub({
    connection: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: 6379,
        retryStrategy: attempts => Math.min(attempts * 50, 2000),
    },
});

console.log(123, 'loading pubsub', pubsub != null);

export const HEARTBEAT = 'HEARTBEAT';
export const NEW_MESSAGE = 'NEW_MESSAGE';
export const NEW_POST = 'NEW_POST';
export const NEW_POSTS = 'NEW_POSTS';
export const FRIEND_REQUEST = 'FRIEND_REQUEST';
export const MANUAL_MATCH = 'MANUAL_MATCH';
export const MANUAL_MATCH_AVAILABLE = 'MANUAL_MATCH_AVAILABLE';
export const AUTO_MATCH = 'AUTO_MATCH';

setInterval(() => {
    pubsub.publish(HEARTBEAT, String(+new Date()));
}, 1000 * 40);

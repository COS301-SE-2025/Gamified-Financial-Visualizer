// // redis.ts
// // Shared Redis connection configuration for BullMQ queues and workers
// import { RedisOptions } from 'bullmq';
// import { createClient, RedisClientType  } from 'redis';

// export const redisConnection: RedisOptions = {
//   host: process.env.REDISHOST,
//   port: parseInt(process.env.REDIS_PORT || '6379', 10),
// };

// export const redisClient = createClient({
// socket: {
//     host: redisConnection.host,
//     port: redisConnection.port,
//   },
//   password: process.env.REDIS_PASSWORD,});

// redisClient.on('error', err => console.error('[Redis] Client Error', err));
// // …and a duplicate for pub/sub (so subscriptions don’t block normal commands)
// export const redisSubscriber = redisClient.duplicate();

// (async () => {
//   await redisClient.connect();
//   await redisSubscriber.connect();
// })();

import dotenv from 'dotenv';
dotenv.config();

import { RedisOptions } from 'bullmq';
import { createClient, RedisClientType } from 'redis';

// Parse the Redis URL for BullMQ connection options
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const parsedUrl = new URL(redisUrl);

export const redisConnection: RedisOptions = {
  host: parsedUrl.hostname,
  port: parseInt(parsedUrl.port || '6379', 10),
  password: parsedUrl.password || undefined,
  username: parsedUrl.username || undefined,
};

// Create Redis client using the full URL

export const redisClient: RedisClientType = createClient({ url: redisUrl });
redisClient.on('error', err => console.error('[Redis] Client Error', err));

// …and a duplicate for pub/sub (so subscriptions don’t block normal commands)
// Subscriber client (for pub/sub)
export const redisSubscriber: RedisClientType = createClient({url:redisUrl});
redisSubscriber.on('error', err => console.error('[Redis] Subscriber Error', err));


(async () => {
  try {
    await redisClient.connect();
    await redisSubscriber.connect();
    console.log('[Redis] Connected successfully');
  } catch (error) {
    console.error('[Redis] Connection failed:', error);
  }
})();
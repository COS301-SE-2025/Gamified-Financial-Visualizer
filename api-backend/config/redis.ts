// redis.ts
// Shared Redis connection configuration for BullMQ queues and workers
import { RedisOptions } from 'bullmq';
import { createClient } from 'redis';
import Redis from 'ioredis';

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

// (async () => {
//   await redisClient.connect();
// })();

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('error', err => console.error('[Redis] Client Error', err));

(async () => {
  await redisClient.connect();
})();
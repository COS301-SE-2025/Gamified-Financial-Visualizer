// redis.ts
// Shared Redis connection configuration for BullMQ queues and workers
import { RedisOptions } from 'bullmq';
import { createClient } from 'redis';
import Redis from 'ioredis';

export const redisConnection: RedisOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
};

export const redisClient = createClient({
  url: `redis://${redisConnection.host}:${redisConnection.port}`
});

redisClient.on('error', err => console.error('[Redis] Client Error', err));

(async () => {
  await redisClient.connect();
})();

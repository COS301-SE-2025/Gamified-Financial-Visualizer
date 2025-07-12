// redis.ts
// Shared Redis connection configuration for BullMQ queues and workers
import { RedisOptions } from 'bullmq';
import { createClient, RedisClientType  } from 'redis';

export const redisConnection: RedisOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
};

export const redisClient = createClient({
  url: `redis://${redisConnection.host}:${redisConnection.port}`
});

redisClient.on('error', err => console.error('[Redis] Client Error', err));
// …and a duplicate for pub/sub (so subscriptions don’t block normal commands)
export const redisSubscriber = redisClient.duplicate();

(async () => {
  await redisClient.connect();
  await redisSubscriber.connect();
})();

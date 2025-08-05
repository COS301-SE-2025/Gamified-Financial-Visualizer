// redis.ts
// Shared Redis connection configuration for BullMQ queues and workers
import { RedisOptions } from 'bullmq';
import { createClient, RedisClientType } from 'redis';

export const redisConnection: RedisOptions = {
  host: process.env.REDISHOST,
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
};

export const redisClient = createClient({
  socket: {
    host: redisConnection.host,
    port: redisConnection.port,
  },
  password: process.env.REDIS_PASSWORD,
});

redisClient.on('error', err => console.error('[Redis] Client Error', err));
// …and a duplicate for pub/sub (so subscriptions don’t block normal commands)
// Subscriber client (for pub/sub)
export const redisSubscriber = createClient({
  socket: {
    host: redisConnection.host,
    port: redisConnection.port,
  },
  password: process.env.REDIS_PASSWORD,
});
redisSubscriber.on('error', err => console.error('[Redis] Subscriber Error', err));

(async () => {
  await redisClient.connect();
  await redisSubscriber.connect();
})();

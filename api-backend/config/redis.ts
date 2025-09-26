import dotenv from 'dotenv';
dotenv.config();

import { RedisOptions } from 'bullmq';
import { createClient, RedisClientType } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redisConnection: RedisOptions = {
  host: new URL(redisUrl).hostname,
  port: parseInt(new URL(redisUrl).port || '6379', 10),
  password: new URL(redisUrl).password || undefined,
  username: new URL(redisUrl).username || undefined,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
};

export const redisClient: RedisClientType = createClient({ 
  url: redisUrl,
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 500),
    connectTimeout: 60000,
    lazyConnect: true,
  }
});

// CRITICAL: Don't crash the app on Redis errors
redisClient.on('error', (err) => {
  console.error('[Redis] Client Error:', err.message);
  // Don't throw - just log the error
});

redisClient.on('connect', () => {
  console.log('[Redis] Connected successfully');
});

redisClient.on('reconnecting', () => {
  console.log('[Redis] Reconnecting...');
});

export const redisSubscriber: RedisClientType = createClient({
  url: redisUrl,
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 500),
    connectTimeout: 60000,
    lazyConnect: true,
  }
});

redisSubscriber.on('error', (err) => {
  console.error('[Redis] Subscriber Error:', err.message);
  // Don't throw - just log
});

// Connect with proper error handling
(async () => {
  try {
    await redisClient.connect();
    await redisSubscriber.connect();
  } catch (error) {
    console.error('[Redis] Connection failed, continuing without Redis:', error);
    // Don't exit - let app run without Redis
  }
})();
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
  // BullMQ specific options
  maxRetriesPerRequest: 3,
  lazyConnect: true,
};

// Enhanced Redis client configuration with better error handling and reconnection
const createRedisClient = (clientName: string) => {
  const client = createClient({
    url: redisUrl,
    socket: {
      // Connection timeout
      connectTimeout: 30000,
      // Keep connection alive
      keepAlive: true,
      // Reconnect settings
      reconnectStrategy: (retries) => {
        if (retries > 10) {
          console.error(`[Redis ${clientName}] Too many reconnection attempts, giving up`);
          return false; // Stop reconnecting
        }
        const delay = Math.min(retries * 50, 2000);
        console.log(`[Redis ${clientName}] Reconnecting in ${delay}ms (attempt ${retries})`);
        return delay;
      },
    },
  });

  // Enhanced error handling
  client.on('error', (err) => {
    console.error(`[Redis ${clientName}] Client Error:`, err.message);
    // Don't let Redis errors crash the application
    if (err.code === 'ECONNRESET' || err.code === 'ENOTFOUND' || err.code === 'ETIMEDOUT') {
      console.log(`[Redis ${clientName}] Connection issue detected, will attempt to reconnect...`);
    }
  });

  client.on('connect', () => {
    console.log(`[Redis ${clientName}] Connected successfully`);
  });

  client.on('ready', () => {
    console.log(`[Redis ${clientName}] Ready to accept commands`);
  });

  client.on('end', () => {
    console.log(`[Redis ${clientName}] Connection ended`);
  });

  client.on('reconnecting', () => {
    console.log(`[Redis ${clientName}] Reconnecting...`);
  });

  return client;
};

// Create Redis clients with enhanced error handling
export const redisClient = createRedisClient('Main');
export const redisSubscriber = createRedisClient('Subscriber');

// Enhanced connection function with better error handling
const connectRedis = async () => {
  try {
    console.log('[Redis] Attempting to connect...');
    
    // Connect main client
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    
    // Connect subscriber client
    if (!redisSubscriber.isOpen) {
      await redisSubscriber.connect();
    }
    
    console.log('[Redis] All clients connected successfully');
  } catch (error) {
    console.error('[Redis] Connection failed:', error);
    
    // Don't crash the application, just log the error
    // The reconnect strategy will handle retries
    console.log('[Redis] Will attempt to reconnect automatically...');
  }
};

// Add graceful shutdown handling
process.on('SIGTERM', async () => {
  console.log('[Redis] Received SIGTERM, closing connections...');
  try {
    await redisClient.quit();
    await redisSubscriber.quit();
    console.log('[Redis] Connections closed gracefully');
  } catch (error) {
    console.error('[Redis] Error during shutdown:', error);
  }
});

process.on('SIGINT', async () => {
  console.log('[Redis] Received SIGINT, closing connections...');
  try {
    await redisClient.quit();
    await redisSubscriber.quit();
    console.log('[Redis] Connections closed gracefully');
    process.exit(0);
  } catch (error) {
    console.error('[Redis] Error during shutdown:', error);
    process.exit(1);
  }
});

// Initialize connection
connectRedis();

// Export a helper function to check connection status
export const isRedisConnected = (): boolean => {
  return redisClient.isOpen && redisSubscriber.isOpen;
};

// Export a helper function to reconnect if needed
export const ensureRedisConnection = async (): Promise<void> => {
  if (!isRedisConnected()) {
    await connectRedis();
  }
};
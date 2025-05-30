// queues/notificationQueue.ts
import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

export const notificationQueue = new Queue('notification-tasks', {
  connection: redisConnection,
  defaultJobOptions: {
    removeOnComplete: true,
    attempts: 3,
  }
});

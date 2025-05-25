// Updates leaderboards, pushes friend notifications
import { Worker } from 'bullmq';


// notify friends of goals and leaderboard changes
import { redisClient } from '../../config/redis';
import { notifyFriends, getLeaderboard } from "../../services/community.service"
import { logger } from '../../config/logger';


export async function initializeCommunityWorker() {
   logger.info("[CommunityWorker] Initializing community check...");
   const redis = redisClient
   const queue = new Worker('community', async (job) => {
      try {
         const { userId, goalId } = job.data;
         logger.info(`[CommunityWorker] Processing job for user ${userId} and goal ${goalId}`);

         // Notify friends of the goal completion
         await notifyFriends(userId, goalId);

         // Update the leaderboard
         const leaderboard = await getLeaderboard();
         await redis.set('leaderboard', JSON.stringify(leaderboard));

         logger.info(`[CommunityWorker] Job completed for user ${userId} and goal ${goalId}`);
      } catch (error) {
         logger.error("[CommunityWorker] Error while processing job:", error);
      }
   });
}
// goalScheduler.ts
import cron from "node-cron";
import { initializeGoalWorker } from "../workers/goal.worker";
import { logger } from "../config/logger";

export function scheduleGoalChecks() {
  // Runs every day at 2 AM (adjust as needed)
   cron.schedule("0 2 * * 1", async () => {
  logger.info("[Scheduler] Running scheduled goal check...");
  await initializeGoalWorker();
});
}

import { initializeGoalWorker } from "./goal.worker";
import { initializeAuthUserListener } from "./auth.worker";
import {initializeTransactionWorker} from "./transaction.worker"
import { initializeCommunityWorker } from "./community.worker";
import { initUserWorker } from "./user.worker";
import { logger } from "../../config/logger";

export async function initWorkers() {
  console.log("[Daemon] initWorkers(): mock init");

  await initializeGoalWorker();
  await initializeAuthUserListener();
  await initializeTransactionWorker();
  await initUserWorker();
  await initializeCommunityWorker();
  logger.info("[Daemon] All workers initialized.");

}
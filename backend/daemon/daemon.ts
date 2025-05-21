// daemon.ts
// Entry point for starting background workers and schedulers

import { initWorkers } from "./workers/index";
import { initSchedulers } from "./schedulers/index";
import { logger } from "../config/logger";

async function startDaemon() { 
   try {
      logger.info("[Daemon] Starting workers...");
      await initWorkers();

      logger.info("[Daemon] Starting schedulers...");
      await initSchedulers();

      logger.info("[Daemon] Daemon engine running.");
   } catch (error) {
      logger.error("[Daemon] Failed to start:", error);
      process.exit(1);
   }
}

startDaemon();
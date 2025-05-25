// daemon.ts
// Entry point for starting background workers and schedulers

import { initWorkers } from "./workers/index";
import { initSchedulers } from "./schedulers/index";
import { logger } from "../config/logger";
import pool from "../db";

export async function startDaemon() { 
   try {
      logger.info("[Daemon] Starting workers...");
     // await initWorkers();

      logger.info("[Daemon] Starting schedulers...");
    //  await initSchedulers();

      logger.info("[Daemon] Daemon engine running.");

      const res = await pool.query('SELECT COUNT(*) FROM users;');
      console.log(`👥 Total users: ${res.rows[0].count}`);
      return res.rows[0].count;
   } catch (error) {
      logger.error("[Daemon] Failed to start:", error);
      process.exit(1);
   }
}

startDaemon();
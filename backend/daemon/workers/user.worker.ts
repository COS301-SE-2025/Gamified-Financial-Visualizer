// userWorker.ts
// Handles background logic for initializing or validating user data

import pool from "../../db";
import { logger } from "../../config/logger";

export async function initUserWorker() {
  logger.info("[UserWorker] Checking for existing users...");

  try {
    const result = await pool.query("SELECT COUNT(*) FROM users");
    const count = parseInt(result.rows[0].count, 10);

    if (count === 0) {
      logger.info("[UserWorker] No users found. Seeding test user...");
      await pool.query(
        `INSERT INTO users (id, email, username, name, surname, password)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        ["test-user-1", "test@example.com", "Test User", "+1234567890"]
      );
      logger.info("[UserWorker] Test user seeded.");
    } else {
      logger.info(`[UserWorker] ${count} user(s) already exist.`);
    }
  } catch (err) {
    logger.error("[UserWorker] Error checking or seeding users:", err);
  }
}
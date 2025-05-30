// authWorker.ts
// Listens for Firebase user creation events and initializes user profiles in the database

// import { getAuth } from "firebase-admin/auth";
import { logger } from "../config/logger";
import {createUser} from "../services/auth-services/src/services/auth.service"

export async function initializeAuthUserListener() {
  /*
  const auth = getAuth();

  auth.listUsers()
    .then(listUsersResult => {
      listUsersResult.users.forEach(async userRecord => {
        try {
          logger.info(`[AuthWorker] Syncing user: ${userRecord.uid}`);
          await register(userRecord);
        } catch (err) {
          logger.error(`[AuthWorker] Failed to sync user ${userRecord.uid}:`, err);
        }
      });
    })
    .catch(error => {
      logger.error("[AuthWorker] Error listing users:", error);
    });

  // TODO: Replace with real-time Firebase auth event handling (Cloud Functions or webhook)
  */
}
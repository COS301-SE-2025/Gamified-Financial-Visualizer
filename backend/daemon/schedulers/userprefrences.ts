// notifyUsersScheduler.ts
// Schedules a daily notification reminder to each user via Firebase Cloud Messaging

import cron from 'node-cron';
// Update the import path if the file is named differently or in another location
//import { getAllUsersWithTokens } from '../services/authService';
// Or, if the file does not exist, create it with the required export
// import { sendNotification } from '../services/firebaseService';
// Update the import path below to the correct logger location if different
 //import { logger } from '../config/logger';

export function scheduleUserNotifications() {

  /*
  // Runs every day at 8 AM server time
  cron.schedule('0 8 * * *', async () => {
    logger.info('[Scheduler] Running daily user notification task...');

    try {
      const users = null;

      for (const user of users) {
        if (user.fcm_token) {
          await sendNotification(user.fcm_token, {
            title: 'Daily Reminder',
            body: "Don't forget to log your expenses and check your financial goals!"
          });
        }
      }

      logger.info(`[Scheduler] Notifications sent to ${users.length} users.`);
    } catch (error) {
      logger.error('[Scheduler] Failed to send notifications:', error);
    }
  });
  */
}

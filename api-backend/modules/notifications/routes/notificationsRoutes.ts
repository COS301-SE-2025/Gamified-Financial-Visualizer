// routes/notifications.routes.ts
import { Router, Request, Response } from 'express';
import { logger } from '../../../config/logger';
import * as notifSvc from '../services/notifications.services'; // <- fixed path

// Extend Express Request interface to include 'user'
// declare global {
//   namespace Express {
//     interface User {
//       id: number;
//     }
//     interface Request {
//       user: User;
//     }
//   }
// }

const router = Router();

/**
 * GET /api/notifications/:userId
 * Returns up to 50 most relevant notifications after applying:
 *  - priority sorting,
 *  - viewed filtering (hide viewed older than policy window),
 *  - dismissed filtering (persisted by key).
 */
router.get('/:userId', async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  if (Number.isNaN(userId)) {
     res.status(400).json({ status: 'error', message: 'Invalid userId' });
     return;
  }

  try {
    // 1) Real-time pushes (inbox), but ignore friend_request duplicates (we pull live)
    const inbox = await notifSvc.getUserNotifications(userId);
    const inboxNoFR = inbox.filter((n) => n.type !== 'friend_request');

    // 2) Pull-based sources
    const [pendingFR, goalAlerts, challengeAlerts, budgetAlerts, insights] = await Promise.all([
      notifSvc.getPendingFriendRequests(userId),
      notifSvc.getGoalMilestones(userId),
      notifSvc.getChallengeInvites(userId),
      notifSvc.getBudgetAlerts(userId),
      notifSvc.getFinancialInsightsDigest(userId),
    ]);

    // 3) Merge + priority + sort + cap
    const all = [
      ...pendingFR.map((n) => ({ ...n, priority: 1 })),
      ...inboxNoFR.map((n) => ({ ...n, priority: n.type === 'friend_request' ? 1 : 2 })),
      ...goalAlerts.map((n) => ({ ...n, priority: 2 })),
      ...challengeAlerts.map((n) => ({ ...n, priority: 2 })),
      ...budgetAlerts.map((n) => ({ ...n, priority: 1 })),
      ...insights.map((n) => ({ ...n, priority: 3 })),
    ]
      // Service should attach a stable key; if not, it’ll still work (just less ideal for dismiss)
      .sort((a, b) => a.priority - b.priority || b.timestamp - a.timestamp)
      .slice(0, 50);

    // 4) Filter: viewed-old → dismissed
    const withoutViewed = await notifSvc.filterOutExpiredViewed(userId, all);
    const filtered = await notifSvc.filterOutDismissed(userId, withoutViewed);

   res.json({ status: 'success', data: filtered });
   return;
  } catch (err) {
    logger.error('Failed to fetch notifications', err);
     res.status(500).json({ status: 'error', message: 'Internal error' });
  }
});

/**
 * PATCH /api/notifications/:userId/viewed
 * Body: { timestamps: number[] }
 * Marks a batch of notifications as viewed.
 */
router.patch('/:userId/viewed', async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  if (Number.isNaN(userId)) {
     res.status(400).json({ status: 'error', message: 'Invalid userId' });
     return;
  }

  const timestamps: number[] = Array.isArray(req.body?.timestamps) ? req.body.timestamps : [];
  try {
    await notifSvc.markNotificationsViewed(userId, timestamps);
     res.json({ status: 'success' });
     return;
  } catch (err) {
    logger.error('Failed to mark viewed', err);
     res.status(500).json({ status: 'error', message: 'Internal error' });
  }
});

/**
 * DELETE /api/notifications/:userId/key/:key
 * Persists a dismissal for computed notifications using a stable key.
 */
router.delete('/:userId/key/:key', async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  if (Number.isNaN(userId)) {
     res.status(400).json({ status: 'error', message: 'Invalid userId' });
     return;
  }

  const key = String(req.params.key || '');
  if (!key) {
     res.status(400).json({ status: 'error', message: 'Missing key' });
     return;
  }

  try {
    await notifSvc.markDismissed(userId, key);
     res.json({ status: 'success' });
     return;
  } catch (err) {
    logger.error('Failed to dismiss by key', err);
     res.status(500).json({ status: 'error', message: 'Internal error' });
  }
});

/**
 * DELETE /api/notifications/:userId/:timestamp
 * Legacy removal by timestamp (inbox-only). This does NOT affect computed sources.
 * Keep for compatibility; the frontend should prefer the key-based endpoint when available.
 */
router.delete('/:userId/:timestamp', async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const timestamp = Number(req.params.timestamp);
  if (Number.isNaN(userId) || Number.isNaN(timestamp)) {
     res.status(400).json({ status: 'error', message: 'Invalid parameters' });
     return;
  }

  try {
    await notifSvc.removeNotification(userId, timestamp);
     res.json({ status: 'success' });
     return;
  } catch (err) {
    logger.error(`Failed to remove notification for ${userId}@${timestamp}:`, err);
     res.status(500).json({ status: 'error', message: 'Could not remove notification.' });
  }
});

/**
 * DELETE /api/notifications
 * Clears the inbox list for the authenticated user.
 * (Does not clear dismissed/viewed sets.)
 */
router.delete('/', async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
     res.status(401).json({ status: 'error', message: 'Unauthorized' });
     return;
  }

  try {
    await notifSvc.clearUserNotifications(userId);
     res.json({ status: 'success' });
     return;
  } catch (err) {
    logger.error('Failed to clear notifications', err);
     res.status(500).json({ status: 'error', message: 'Internal error' });
  }
});

export default router;

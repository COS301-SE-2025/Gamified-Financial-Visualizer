// routes/notifications.routes.ts
import { Router, Request, Response } from 'express';
import { logger } from '../../../config/logger';
import * as notifSvc from '../services/notifications.services';

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface User {
      id: number;
      // add other user properties if needed
    }
    interface Request {
      user: User;
    }
  }
}

const router = Router();

/**
 * GET /api/notifications
 * → returns list of up to 50 most recent notifications
 */
router.get('/:userId', async (req: Request, res: Response) => {
  // assume you’ve authenticated and have req.user.id
  const userId = Number(req.params.userId);

  try {
    // 1) Real-time pushes for immediate actions
    const inbox = await notifSvc.getUserNotifications(userId);
    const inboxNoFR = inbox.filter(n => n.type !== 'friend_request');

    // 2) Live pull for friend-requests (action-required)
    const pendingFR = await notifSvc.getPendingFriendRequests(userId);

    // 3) Goal milestones (celebratory/actionable)
    const goalAlerts = await notifSvc.getGoalMilestones(userId);

    // 4) Challenge updates (invites, leaderboard moves)
    const challengeAlerts = await notifSvc.getChallengeInvites(userId);

    // 5) Budget reminders (over-spend, upcoming bills)
    const budgetAlerts = await notifSvc.getBudgetAlerts(userId);

    // 6) Financial insights (batched, passive)
    const insights = await notifSvc.getFinancialInsightsDigest(userId);

    // merge & sort, but pin action-required to the top
    const all = [
      ...pendingFR.map(n => ({ ...n, priority: 1 })),
      ...inboxNoFR.map(n => ({ ...n, priority: n.type === 'friend_request' ? 1 : 2 })),
      ...goalAlerts.map(n => ({ ...n, priority: 2 })),
      ...challengeAlerts.map(n => ({ ...n, priority: 2 })),
      ...budgetAlerts.map(n => ({ ...n, priority: 1 })),
      ...insights.map(n => ({ ...n, priority: 3 })),
    ]
      .sort((a, b) => a.priority - b.priority || b.timestamp - a.timestamp)
      .slice(0, 50);

    res.json({ status: 'success', data: all });
  } catch (err) {
    logger.error('Failed to fetch notifications', err);
    res.status(500).json({ status: 'error', message: 'Internal error' });
  }
});


router.delete('/:userId/:timestamp', async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const timestamp = Number(req.params.timestamp);
  if (isNaN(userId) || isNaN(timestamp)) {
    res.status(400).json({ status: 'error', message: 'Invalid parameters' });
    return;
  }
  try {
    await notifSvc.removeNotification(userId, timestamp);
    res.json({ status: 'success' });
  } catch (err) {
    logger.error(`Failed to remove notification for ${userId}@${timestamp}:`, err);
    res.status(500).json({ status: 'error', message: 'Could not remove notification.' });
  }
});


/**
 * DELETE /api/notifications
 * → clear them all
 */
router.delete('/', async (req: Request, res: Response) => {
  const userId = req.user.id;
  try {
    await notifSvc.clearUserNotifications(userId);
    res.json({ status: 'success' });
  } catch (err) {
    logger.error('Failed to clear notifications', err);
    res.status(500).json({ status: 'error', message: 'Internal error' });
  }
});

export default router;
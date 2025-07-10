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
   // 1) list from Redis
    const inbox = await notifSvc.getUserNotifications(userId);
    // 2) “live” DB pull of friend-requests
    const pending = await notifSvc.getPendingFriendRequests(userId);

    const inboxNoFR = inbox.filter(n => n.type !== 'friend_request');
    // merge & sort by timestamp descending
    const all = [...pending, ...inboxNoFR]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 50);

    res.json({ status: 'success', data: all });
  } catch (err) {
    logger.error('Failed to fetch notifications', err);
    res.status(500).json({ status: 'error', message: 'Internal error' });
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

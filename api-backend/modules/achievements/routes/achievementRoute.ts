
import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { logger } from '../../../config/logger';
import * as achievementService from '../services/achievement.service';

const router = Router();

// Helpers
const normalize = (s: string) =>
  s.normalize('NFKC').trim().toLowerCase().replace(/\s+/g, ' ');

/**
 * GET /api/achievements/list/:userId
 * Umbrella achievements with completed/total counts for a user
 */
router.get('/list/:userId', async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  if (!Number.isFinite(userId)) {
    res.status(400).json({ status: 'error', error: 'Invalid user ID' });
    return;
  }
  try {
    const achievements = await achievementService.getAllAchievements(userId);
    res.json({ status: 'success', data: achievements });
  } catch (error) {
    logger.error('Failed to fetch achievements:', error);
    res.status(500).json({ status: 'error', error: 'Internal server error' });
  }
});

/**
 * GET /api/achievements/by-id/:achievementId/:userId
 * Single achievement by numeric ID (recommended)
 */
router.get('/by-id/:achievementId/:userId', async (req: Request, res: Response) => {
  const achievementId = Number(req.params.achievementId);
  const userId = Number(req.params.userId);
  if (!Number.isFinite(achievementId) || !Number.isFinite(userId)) {
    res.status(400).json({ status: 'error', error: 'Invalid params' });
    return;
  }
  try {
    const all = await achievementService.getAllAchievements(userId);
    const achievement = all.find(a => Number(a.achievement_id) === achievementId);
    if (!achievement) {
      res.status(404).json({ status: 'error', error: 'Achievement not found' });
      return;
    }
    res.json({ status: 'success', data: achievement });
  } catch (error) {
    logger.error(`Failed to fetch achievement ${achievementId}:`, error);
    res.status(500).json({ status: 'error', error: 'Internal server error' });
  }
});

/**
 * GET /api/achievements/by-title/:achievementTitle/:userId
 * Single achievement by title (kept for compatibility)
 */
router.get('/by-title/:achievementTitle/:userId', async (req: Request, res: Response) => {
  const raw = req.params.achievementTitle || '';
  const userId = Number(req.params.userId);
  if (!Number.isFinite(userId)) {
    res.status(400).json({ status: 'error', error: 'Invalid user ID' });
    return;
  }
  // Express decodes %20, but we also handle + and normalize
  const decoded = decodeURIComponent(raw.replace(/\+/g, ' '));
  const want = normalize(decoded);

  try {
    const all = await achievementService.getAllAchievements(userId);
    const achievement = all.find(a => normalize(a.achievement_title) === want);
    if (!achievement) {
      res.status(404).json({ status: 'error', error: 'Achievement not found' });
      return;
    }
    res.json({ status: 'success', data: achievement });
  } catch (error) {
    logger.error(`Failed to fetch achievement "${raw}":`, error);
    res.status(500).json({ status: 'error', error: 'Internal server error' });
  }
});

/**
 * GET /api/achievements/user/:userId
 * User achievements & progress
 */
router.get('/user/:userId', async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  if (!Number.isFinite(userId)) {
     res.status(400).json({ status: 'error', error: 'Invalid user ID' });
     return
  }
  try {
    await achievementService.ensureUserAchievements(userId);
    const data = await achievementService.getUserAchievements(userId);
    res.json({ status: 'success', data });
  } catch (error) {
    logger.error('Failed to fetch user achievements:', error);
    res.status(500).json({ status: 'error', error: 'Internal server error' });
  }
});

/**
 * POST /api/achievements/user/:userId/event
 */
router.post('/user/:userId/event', async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const { eventType, delta } = req.body ?? {};
  if (!Number.isFinite(userId) || typeof eventType !== 'string' || typeof delta !== 'number') {
     res.status(400).json({ status: 'error', error: 'Invalid parameters' });
     return;
  }
  try {
    await achievementService.updateAchievementsForEvent(userId, eventType, delta);
    const updated = await achievementService.getUserAchievements(userId);
    res.json({ status: 'success', data: updated });
  } catch (error) {
    logger.error(`Failed to update achievements for user ${userId}:`, error);
    res.status(500).json({ status: 'error', error: 'Internal server error' });
  }
});

/**
 * GET /api/achievements/task/:title/:userId
 * Sub-tasks for an umbrella
 */
router.get('/task/:title/:userId', async (req: Request, res: Response) => {
  const title = req.params.title;
  const userId = Number(req.params.userId);
  if (!title || !Number.isFinite(userId)) {
     res.status(400).json({ status: 'error', error: 'Invalid params' });
     return;
  }
  try {
    const tasks = await achievementService.fetchAchievementTasks(title, userId);
    res.json({ status: 'success', data: tasks });
  } catch (error) {
    logger.error('Failed to fetch achievement tasks:', error);
    res.status(500).json({ status: 'error', error: 'Internal server error' });
  }
});

/**
 * GET /api/achievements/performance/:userId
 */
router.get('/performance/:userId', async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  if (!Number.isFinite(userId)) {
     res.status(400).json({ status: 'error', error: 'Invalid user ID' });
     return;
  }
  try {
    const stats = await achievementService.getSidebarStats(userId);
    res.json({ status: 'success', data: stats });
  } catch (error) {
    logger.error(`Failed to fetch sidebar stats for user ${userId}:`, error);
    res.status(500).json({ status: 'error', error: 'Internal server error' });
  }
});

export default router;

import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { logger } from '../../../config/logger';
import * as achievementService from '../services/achievement.service';

const router = Router();

/**
 * GET /api/achievements/
 * Retrieve all achievement definitions (catalog)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const achievements = await achievementService.getAllAchievements();
    res.json({ status: 'success', data: achievements });
  } catch (error) {
    logger.error('Failed to fetch achievements:', error);
    res.status(500).json({ status: 'error', error: 'Internal server error' });
  }
});

/**
 * GET /api/achievements/:achievementId
 * Retrieve a single achievement definition by ID
 */
router.get('/:achievementTitle', async (req: Request, res: Response) => {
  const achievementId = req.params.achievementTitle;
  try {
    const all = await achievementService.getAllAchievements();
    const achievement = all.find(a => a.achievement_title === achievementId);
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
 * GET /api/achievements/user/:userId
 * Retrieve a user's achievements and progress
 */
router.get('/user/:userId', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) {
    res.status(400).json({ status: 'error', error: 'Invalid user ID' });
    return;
  }

  try {
    await achievementService.ensureUserAchievements(userId);
    const userAchievements = await achievementService.getUserAchievements(userId);
    res.json({ status: 'success', data: userAchievements });
  } catch (error) {
    logger.error('Failed to fetch user achievements:', error);
    res.status(500).json({ status: 'error', error: 'Internal server error' });
  }
});

/**
 * POST /api/achievements/user/:userId/event
 * Trigger achievement updates for an event (e.g. transaction, challenge, quiz)
 * Body: { eventType: string, delta: number }
 */
router.post('/user/:userId/event', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId, 10);
  const { eventType, delta } = req.body;
  if (isNaN(userId) || !eventType || typeof delta !== 'number') {
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
 * GET /api/achievements/task
 * Query parameters:
 *   title: umbrella achievement title
 *   userId: user ID to fetch tasks for
 */
router.get('/task/:title/:userId', async (req: Request, res: Response) => {
  const title = req.params.title as string;
  const userId = Number(req.params.userId);
  if (!title ) {
    res.status(400).json({ status: 'error', error: 'Missing or invalid title' });
    return;
  }
  if (isNaN(userId)) {
    res.status(400).json({ status: 'error', error: 'Invalid user ID' });
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
 * Returns overall user stats for sidebar (performance, quizzes, accuracy, leaderboard, goals, badges, challenges, credit score)
 */
router.get('/performance/:userId', async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  if (isNaN(userId)) {
    res.status(400).json({ status: 'error', error: 'Invalid user ID' });
  }
  try {
    const stats = await achievementService.getSidebarStats(userId);
    res.json({ status: 'success', data: stats });
  } catch (error) {
    logger.error(`Failed to fetch sidebar stats for user ${req.params.userId}:`, error);
    res.status(500).json({ status: 'error', error: 'Internal server error' });
  }
});
export default router;
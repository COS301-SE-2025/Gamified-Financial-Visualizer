import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { logger } from '../../../config/logger';
import * as cityService from '../services/city.service';

const router = Router();


/**
 * GET /api/city/buildings?userId=123
 * Returns all building tooltips for the user
 */
router.get('/buildings/:userId', async (req, res) => {
  const userId = Number(req.params.userId);
  if (!userId) {
    res.status(400).json({ error: 'userId required' });
    return;
  }
  try {
    const list = await cityService.getAllBuildingTooltips(userId);
    res.json(list);
  } catch (e) {
    // TODO: add logger if you have one
    res.status(500).json({ error: 'Failed to load buildings' });
  }
});

/**
 * GET /api/city/buildings/:buildingId?userId=123
 * Returns a single building tooltip for the user
 */
router.get('/buildings/:buildingId', async (req, res) => {
  const userId = Number(req.query.userId || (req as any).user?.id);
  const { buildingId } = req.params;
  if (!userId) {
      res.status(400).json({ error: 'userId required' });
      return;
  }
  try {
    const result = await cityService.getBuildingTooltip(userId, buildingId);
    if (!result) {
       res.status(404).json({ error: 'Unknown building id' });
       return;
    }
    res.json(result);
  } catch {
    res.status(500).json({ error: 'Failed to load building' });
  }
});

export default router;

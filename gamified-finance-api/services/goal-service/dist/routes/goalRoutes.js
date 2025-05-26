import { Router } from 'express';
import {
  createPersonalGoal,
  createCommunityGoal,
  getUserGoals,
  getCommunityGoals,
  addGoalProgress,
  updateGoal,
  updateGoalStatus,
  completeGoal,
  deleteGoal
} from '@shared-services/goal.service';

const router = Router();

router.post('/personal', async (req, res) => {
  try {
    const goal = await createPersonalGoal(req.body);
    res.status(201).json({ status: 'success', data: goal });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.post('/community', async (req, res) => {
  try {
    const goal = await createCommunityGoal(req.body);
    res.status(201).json({ status: 'success', data: goal });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const goals = await getUserGoals(Number(req.params.userId));
    res.status(200).json({ status: 'success', data: goals });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.get('/community/:communityId', async (req, res) => {
  try {
    const goals = await getCommunityGoals(Number(req.params.communityId));
    res.status(200).json({ status: 'success', data: goals });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.post('/:goalId/progress', async (req, res) => {
  try {
    const result = await addGoalProgress(Number(req.params.goalId), req.body.user_id, req.body.amount);
    res.status(201).json({ status: 'success', data: result });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.patch('/:goalId', async (req, res) => {
  try {
    const updated = await updateGoal(Number(req.params.goalId), req.body);
    res.status(200).json({ status: 'success', data: updated });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.patch('/:goalId/status', async (req, res) => {
  try {
    const updated = await updateGoalStatus(Number(req.params.goalId), req.body.goal_status);
    res.status(200).json({ status: 'success', data: updated });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.post('/:goalId/complete', async (req, res) => {
  try {
    await completeGoal(Number(req.params.goalId));
    res.status(200).json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.delete('/:goalId', async (req, res) => {
  try {
    await deleteGoal(Number(req.params.goalId));
    res.status(200).json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;

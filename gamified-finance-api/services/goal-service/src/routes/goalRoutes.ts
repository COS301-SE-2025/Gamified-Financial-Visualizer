// import { Router, Request, Response } from 'express';
// import { 
//   // createCommunityGoal,
//   // getPersonalGoalsByUserId,
//   // getCommunityGoalsForUser, // Not implemented
//   // updateGoalNameByUser,
//   // deleteGoalByUser,
//   // updateCommunityGoalNameByUser,
//   // deleteCommunityGoalByUser,
//   // getAchievedPersonalGoals, // Not implemented
//   // getInProgressPersonalGoals, // Not implemented
//   // getAchievedCommunityGoals, // Not implemented
//   // getInProgressCommunityGoals, // Not implemented
//   // getPersonalGoalById,
//   // getCommunityGoalById
//   createGoal,
//   getGoal,
//   getUserGoals,
//   updateGoal,
//   deleteGoal,
//   addGoalProgress,
//   completeGoal,
//   reduceGoalProgress,
//   getAllGoals
// } from '../services/goals.service.js';
// import { logger } from '../config/logger';

// const router = Router();

// /**
//  * @route POST /api/goal
//  * @description Creates a personal financial goal for a user.
//  * @body user_id, goal_name, goal_type, target_amount, target_date, goal_status
//  */
// router.post('/', async (req: Request, res: Response): Promise<void> => {
//   const { user_id, goal_name, goal_type, target_amount, target_date, goal_status } = req.body;

//   if (!user_id || !goal_name || !goal_type || !target_amount || !target_date || !goal_status) {
//     res.status(400).json({
//       status: 'error',
//       message: 'All fields are required.'
//     });
//     return;
//   }

//   try {
//     const goal = await createPersonalGoal({
//       user_id,
//       goal_name,
//       goal_type,
//       target_amount,
//       target_date,
//       goal_status
//     });

//     res.status(201).json({
//       status: 'success',
//       message: 'Goal created successfully.',
//       data: goal
//     });
//   } catch (error) {
//     logger.error('[Routes] Failed to create goal', error);
//     res.status(500).json({ status: 'error', message: 'Internal server error' });
//   }
// });

// /**
//  * @route POST /api/goal/community
//  * @description Creates a community goal tied to a community.
//  * @body user_id, community_id, goal_name, goal_type, target_amount, target_date, goal_status
//  */
// router.post('/community', async (req: Request, res: Response): Promise<void> => {
//   const {
//     user_id,
//     community_id,
//     goal_name,
//     goal_type,
//     target_amount,
//     target_date,
//     goal_status
//   } = req.body;

//   if (
//     !user_id || !community_id || !goal_name || !goal_type ||
//     !target_amount || !target_date || !goal_status
//   ) {
//     res.status(400).json({
//       status: 'error',
//       message: 'All fields are required for a community goal.'
//     });
//     return;
//   }

//   try {
//     const goal = await createCommunityGoal({
//       user_id,
//       community_id,
//       goal_name,
//       goal_type,
//       target_amount,
//       target_date,
//       goal_status
//     });

//     res.status(201).json({
//       status: 'success',
//       message: 'Community goal created successfully.',
//       data: goal
//     });
//   } catch (error) {
//     logger.error('[Routes] Failed to create community goal', error);
//     res.status(500).json({ status: 'error', message: 'Internal server error' });
//   }
// });

// /**
//  * @route GET /api/goal/user/:userId
//  * @description Retrieves all personal (non-community) goals for a specific user.
//  * @param userId Path param — ID of the user
//  * @returns {Object[]} List of personal goals
//  */
// router.get('/user/:userId', async (req: Request, res: Response): Promise<void> => {
//   const { userId } = req.params;

//   try {
//     const goals = await getPersonalGoalsByUserId(userId);
//     res.status(200).json({
//       status: 'success',
//       data: goals
//     });
//   } catch (error) {
//     logger.error('[Routes] Failed to fetch personal goals', error);
//     res.status(500).json({ status: 'error', message: 'Internal server error' });
//   }
// });

// /**
//  * @route GET /api/goal/user/:userId/community
//  * @description Retrieves all community goals where the user is a member of the community.
//  * @param userId - the user's ID
//  * @returns List of community goals (excluding progress_percent)
//  */
// router.get('/user/:userId/community', async (req: Request, res: Response): Promise<void> => {
//   const { userId } = req.params;

//   try {
//     const goals = await getCommunityGoalsForUser(userId);
//     res.status(200).json({
//       status: 'success',
//       data: goals
//     });
//   } catch (error) {
//     logger.error('[Routes] Failed to fetch community goals for user', error);
//     res.status(500).json({ status: 'error', message: 'Internal server error' });
//   }
// });

// /**
//  * @route PUT /api/goal/:goalId
//  * @description Allows a user to update the name of a goal they created.
//  * @body user_id
//  * @body {string} goal_name
//  */
// router.put('/:goalId', async (req: Request, res: Response): Promise<void> => {
//   const { goalId } = req.params;
//   const { user_id, goal_name } = req.body;

//   if (!user_id || !goal_name || goal_name.trim() === '') {
//     res.status(400).json({
//       status: 'error',
//       message: 'Both user_id and a valid new goal_name are required.'
//     });
//     return;
//   }

//   try {
//     const updated = await updateGoalNameByUser(goalId, user_id, goal_name.trim());

//     if (!updated) {
//       res.status(404).json({
//         status: 'error',
//         message: 'Goal not found or user not authorized.'
//       });
//       return;
//     }

//     res.status(200).json({
//       status: 'success',
//       message: 'Goal name updated successfully.',
//       data: updated
//     });
//   } catch (error) {
//     logger.error('[Routes] Failed to update goal name', error);
//     res.status(500).json({ status: 'error', message: 'Internal server error' });
//   }
// });

// /**
//  * @route DELETE /api/goal/:goalId
//  * @description Allows a user to delete a goal they created.
//  * @body {string} user_id - The ID of the user requesting deletion
//  */
// router.delete('/:goalId', async (req: Request, res: Response): Promise<void> => {
//   const { goalId } = req.params;
//   const { user_id } = req.body;

//   if (!user_id) {
//     res.status(400).json({
//       status: 'error',
//       message: 'user_id is required to delete a goal.'
//     });
//     return;
//   }

//   try {
//     const deleted = await deleteGoalByUser(goalId, user_id);

//     if (!deleted) {
//       res.status(404).json({
//         status: 'error',
//         message: 'Goal not found or user not authorized to delete.'
//       });
//       return;
//     }

//     res.status(200).json({
//       status: 'success',
//       message: `Goal ${goalId} deleted successfully.`
//     });
//   } catch (error) {
//     logger.error('[Routes] Failed to delete goal', error);
//     res.status(500).json({ status: 'error', message: 'Internal server error' });
//   }
// });

// /**
//  * @route PUT /api/goal/community/:goalId
//  * @description Allows a user to update the name of a community goal they created.
//  * @body {string} user_id - the creator of the goal
//  * @body {string} goal_name - new name
//  */
// router.put('/community/:goalId', async (req: Request, res: Response): Promise<void> => {
//   const { goalId } = req.params;
//   const { user_id, goal_name } = req.body;

//   if (!user_id || !goal_name || goal_name.trim() === '') {
//     res.status(400).json({
//       status: 'error',
//       message: 'Both user_id and a valid new goal_name are required.'
//     });
//     return;
//   }

//   try {
//     const updated = await updateCommunityGoalNameByUser(goalId, user_id, goal_name.trim());

//     if (!updated) {
//       res.status(404).json({
//         status: 'error',
//         message: 'Community goal not found or user not authorized.'
//       });
//       return;
//     }

//     res.status(200).json({
//       status: 'success',
//       message: 'Community goal name updated successfully.',
//       data: updated
//     });
//   } catch (error) {
//     logger.error('[Routes] Failed to update community goal name', error);
//     res.status(500).json({ status: 'error', message: 'Internal server error' });
//   }
// });

// /**
//  * @route DELETE /api/goal/community/:goalId
//  * @description Allows a user to delete a community goal they created.
//  * @body {string} user_id - The ID of the user requesting deletion
//  */
// router.delete('/community/:goalId', async (req: Request, res: Response): Promise<void> => {
//   const { goalId } = req.params;
//   const { user_id } = req.body;

//   if (!user_id) {
//     res.status(400).json({
//       status: 'error',
//       message: 'user_id is required to delete a community goal.'
//     });
//     return;
//   }

//   try {
//     const deleted = await deleteCommunityGoalByUser(goalId, user_id);

//     if (!deleted) {
//       res.status(404).json({
//         status: 'error',
//         message: 'Community goal not found or user not authorized.'
//       });
//       return;
//     }

//     res.status(200).json({
//       status: 'success',
//       message: `Community goal ${goalId} deleted successfully.`
//     });
//   } catch (error) {
//     logger.error('[Routes] Failed to delete community goal', error);
//     res.status(500).json({ status: 'error', message: 'Internal server error' });
//   }
// });

// /**
//  * @route GET /api/goal/user/:userId/in-progress
//  * @description Get all personal goals still in progress for a user
//  */
// router.get('/user/:userId/in-progress', async (req: Request, res: Response): Promise<void> => {
//   const { userId } = req.params;

//   try {
//     const goals = await getInProgressPersonalGoals(userId);
//     res.status(200).json({ status: 'success', data: goals });
//   } catch (error) {
//     logger.error('[Routes] Failed to fetch in-progress goals', error);
//     res.status(500).json({ status: 'error', message: 'Internal server error' });
//   }
// });

// /**
//  * @route GET /api/goal/user/:userId/achieved
//  * @description Get all personal goals that have been achieved by a user
//  */
// router.get('/user/:userId/achieved', async (req: Request, res: Response): Promise<void> => {
//   const { userId } = req.params;

//   try {
//     const goals = await getAchievedPersonalGoals(userId);
//     res.status(200).json({ status: 'success', data: goals });
//   } catch (error) {
//     logger.error('[Routes] Failed to fetch achieved goals', error);
//     res.status(500).json({ status: 'error', message: 'Internal server error' });
//   }
// });

// /**
//  * @route GET /api/goal/user/:userId/community/achieved
//  * @description Get all community goals marked as achieved for communities the user belongs to
//  */
// router.get('/user/:userId/community/achieved', async (req: Request, res: Response): Promise<void> => {
//   const { userId } = req.params;

//   try {
//     const goals = await getAchievedCommunityGoals(userId);
//     res.status(200).json({ status: 'success', data: goals });
//   } catch (error) {
//     logger.error('[Routes] Failed to fetch achieved community goals', error);
//     res.status(500).json({ status: 'error', message: 'Internal server error' });
//   }
// });

// /**
//  * @route GET /api/goal/user/:userId/community/in-progress
//  * @description Get all in-progress community goals for communities the user belongs to
//  */
// router.get('/user/:userId/community/in-progress', async (req: Request, res: Response): Promise<void> => {
//   const { userId } = req.params;

//   try {
//     const goals = await getInProgressCommunityGoals(userId);
//     res.status(200).json({ status: 'success', data: goals });
//   } catch (error) {
//     logger.error('[Routes] Failed to fetch in-progress community goals', error);
//     res.status(500).json({ status: 'error', message: 'Internal server error' });
//   }
// });

// /**
//  * @route GET /api/goal/community/:goalId
//  * @description Returns a specific community goal
//  */
// router.get('/community/:goalId', async (req: Request, res: Response): Promise<void> => {
//   const { goalId } = req.params;

//   try {
//     const goal = await getCommunityGoalById(goalId);

//     if (!goal) {
//       res.status(404).json({
//         status: 'error',
//         message: 'Community goal not found.'
//       });
//     }

//     res.status(200).json({ status: 'success', data: goal });
//   } catch (error) {
//     logger.error('[Routes] Failed to fetch community goal', error);
//     res.status(500).json({ status: 'error', message: 'Internal server error' });
//   }
// });

// /**
//  * @route GET /api/goal/personal/:goalId
//  * @description Returns a specific personal goal (not linked to a community)
//  */
// router.get('/personal/:goalId', async (req: Request, res: Response): Promise<void> => {
//   const { goalId } = req.params;

//   try {
//     const goal = await getPersonalGoalById(goalId);

//     if (!goal) {
//       res.status(404).json({
//         status: 'error',
//         message: 'Personal goal not found.'
//       });
//     }

//     res.status(200).json({ status: 'success', data: goal });
//   } catch (error) {
//     logger.error('[Routes] Failed to fetch personal goal', error);
//     res.status(500).json({ status: 'error', message: 'Internal server error' });
//   }
// });



// export default router;


import { Router, Request, Response } from 'express';
import {
  createGoal,
  getGoal,
  getUserGoals,
  updateGoal,
  deleteGoal,
  addGoalProgress,
  completeGoal,
  reduceGoalProgress,
  getAllGoals,
  getUserGoalStats
} from '../services/goals.service';
import { logger } from '../config/logger';

const router = Router();

/**
 * @route POST /api/goal
 * @description Creates a financial goal (personal or community, depending on fields).
 */
router.post('/', async (req: Request, res: Response) => {
  const {
    user_id,
    community_id,
    goal_name,
    goal_type,
    target_amount,
    target_date,
    goal_status
  } = req.body;

  if (
    !goal_name || !goal_type || !target_amount ||
    !target_date || !goal_status || (!user_id && !community_id)
  ) {
    res.status(400).json({
      status: 'error',
      message: 'Missing required fields: user_id or community_id, goal_name, goal_type, target_amount, target_date, goal_status'
    });
    return;
  }

  try {
    const goalId = await createGoal({
      user_id,
      community_id,
      goal_name,
      goal_type,
      target_amount,
      target_date,
      goal_status
    });

    res.status(201).json({
      status: 'success',
      message: 'Goal created successfully.',
      data: { goal_id: goalId }
    });
  } catch (error) {
    logger.error('[GoalRoutes] Failed to create goal', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

/**
 * @route GET /api/goal/:goalId
 * @description Fetch a single goal by ID.
 */
router.get('/:goalId', async (req: Request, res: Response) => {
  const { goalId } = req.params;

  try {
    const goal = await getGoal(Number(goalId));

    if (!goal) {
      res.status(404).json({ status: 'error', message: 'Goal not found' });
      return;
    }

    res.status(200).json({ status: 'success', data: goal });
  } catch (error) {
    logger.error('[GoalRoutes] Error fetching goal', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

/**
 * @route GET /api/goal/user/:userId
 * @description Fetch all personal goals for a user.
 */
router.get('/user/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const goals = await getUserGoals(Number(userId));
    res.status(200).json({ status: 'success', data: goals });
  } catch (error) {
    logger.error('[GoalRoutes] Error fetching user goals', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

/**
 * @route PUT /api/goal/:goalId
 * @description Update a goal's details.
 */
router.put('/:goalId', async (req: Request, res: Response) => {
  const { goalId } = req.params;
  const updates = req.body;

  try {
    await updateGoal(Number(goalId), updates);
    res.status(200).json({ status: 'success', message: 'Goal updated successfully' });
  } catch (error) {
    logger.error('[GoalRoutes] Error updating goal', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

/**
 * @route DELETE /api/goal/:goalId
 * @description Delete a goal by ID.
 */
router.delete('/:goalId', async (req: Request, res: Response) => {
  const { goalId } = req.params;

  try {
    await deleteGoal(Number(goalId));
    res.status(200).json({ status: 'success', message: 'Goal deleted successfully' });
  } catch (error) {
    logger.error('[GoalRoutes] Error deleting goal', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

/**
 * @route POST /api/goal/:goalId/progress
 * @description Add progress to a goal.
 */
router.post('/:goalId/progress', async (req: Request, res: Response) => {
  const { goalId } = req.params;
  const { contributor_id, amount_added } = req.body;

  if (!contributor_id || !amount_added) {
    res.status(400).json({ status: 'error', message: 'contributor_id and amount_added are required' });
    return;
  }

  try {
    const progressId = await addGoalProgress(Number(goalId), contributor_id, amount_added);
    res.status(201).json({ status: 'success', data: { progress_id: progressId } });
  } catch (error) {
    logger.error('[GoalRoutes] Error adding progress', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

/**
 * @route POST /api/goal/:goalId/complete
 * @description Mark a goal as completed.
 */
router.post('/:goalId/complete', async (req: Request, res: Response) => {
  const { goalId } = req.params;

  try {
    await completeGoal(Number(goalId));
    res.status(200).json({ status: 'success', message: 'Goal marked as completed' });
  } catch (error) {
    logger.error('[GoalRoutes] Error completing goal', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

/**
 * @route POST /api/goal/:goalId/reduce
 * @description Reduce goal progress and deduct points.
 */
router.post('/:goalId/reduce', async (req: Request, res: Response) => {
  const { goalId } = req.params;
  const { amount } = req.body;

  if (!amount) {
    res.status(400).json({ status: 'error', message: 'amount is required' });
    return;
  }

  try {
    await reduceGoalProgress(Number(goalId), amount);
    res.status(200).json({ status: 'success', message: 'Progress reduced' });
  } catch (error) {
    logger.error('[GoalRoutes] Error reducing progress', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

/**
 * @route GET /api/goal
 * @description Fetch all goals.
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const goals = await getAllGoals();
    res.status(200).json({ status: 'success', data: goals });
  } catch (error) {
    logger.error('[GoalRoutes] Error fetching all goals', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

router.get('/user/:user_id/stats', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.user_id, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ status: 'error', message: 'Invalid user_id' });
  }

  try {
    const stats = await getUserGoalStats(userId);
    res.json({ status: 'success', data: stats });
  } catch (error: any) {
    logger.error('[Goals] Stats fetch failed', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});


export default router;
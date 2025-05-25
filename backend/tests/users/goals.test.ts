import { describe, it, after } from 'node:test';
import assert from 'node:assert/strict';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import pool from '../../db/index';

import {
   createGoal,
   getGoal,
   getUserGoals,
   updateGoal,
   deleteGoal,
   addGoalProgress,
   completeGoal,
   reduceGoalProgress,
   getAllGoals
} from '../../services/goal.service';
// tests/goalService.test.ts



describe('Goal Service (Jest)', () => {
  let goalId: number;
  const testUserId = 6;

  // Only include fields your service expects; community_id will default to NULL
  const goalData = {
    user_id: testUserId,
    goal_name: 'Test Goal 2',
    goal_type: 'savings' as const,
    target_amount: 1000,
    current_amount: 200,
    target_date: new Date(Date.now() + 24 * 3600 * 1000)
                   .toISOString().split('T')[0],
    goal_status: 'in-progress' as const
  };

  it('creates a goal', async () => {
    goalId = await createGoal(goalData);
    expect(typeof goalId).toBe('number');
    const g = await getGoal(goalId);
    expect(g).not.toBeNull();
    expect(g!.goal_name).toBe(goalData.goal_name);
  });

  it('updates the goal', async () => {
    await updateGoal(goalId, { current_amount: 500 });
    const updated = await getGoal(goalId);
    expect(updated).not.toBeNull();
    expect(updated!.current_amount).toBe(500);
  });

  it('lists user goals', async () => {
    const goals = await getUserGoals(testUserId);
    expect(Array.isArray(goals)).toBe(true);
    expect(goals.some(g => g.goal_id === goalId)).toBe(true);
  });

  it('adds progress to the goal', async () => {
    const progressId = await addGoalProgress(goalId, testUserId, 150);
    expect(typeof progressId).toBe('number');
  });

  it('completes the goal and awards points', async () => {
    // top up to target
    await updateGoal(goalId, { current_amount: goalData.target_amount });
    await completeGoal(goalId);
    const completed = await getGoal(goalId);
    expect(completed).not.toBeNull();
    expect(completed!.goal_status).toBe('completed');
  });

  it('reduces progress and deducts points', async () => {
    await reduceGoalProgress(goalId, 100);
    const after = await getGoal(goalId);
    expect(after).not.toBeNull();
    expect(after!.current_amount).toBeLessThan(goalData.target_amount);
  });

  it('deletes the goal', async () => {
    await deleteGoal(goalId);
    const deleted = await getGoal(goalId);
    expect(deleted).toBeNull();
  });

  it('gets all goals', async () => {
    const all = await getAllGoals();
    expect(Array.isArray(all)).toBe(true);
  });
});

// Clean up the Postgres pool so Jest can exit cleanly
afterAll(async () => {
  await pool.end();
});

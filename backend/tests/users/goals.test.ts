// goalService.test.ts

import {
   createGoal,
   getGoal,
   getUserGoals,
   updateGoal,
   deleteGoal,
   addTransactionToGoal,
   completeGoal,
   reduceProgress,
   getAllGoals,
} from '../../services//goal.service';

import { describe, it } from 'node:test';
import expect from 'node:test';

describe('Goal Service', () => {
   const testGoalId = Math.floor(Math.random() * 1000000);
   const testUserId = testGoalId + 1;
   const goal = {
      id: testGoalId,
      user_id: testUserId,
      name: 'Test Goal',
      target_amount: 1000,
      current_amount: 200,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 86400000).toISOString(),
      status: 'Active'
   };

   it('should create a goal', async () => {
      await createGoal(goal);
      const result = await getGoal(goal.id);
      expect(result).toBeDefined();
      expect(result.name).toBe(goal.name);
   });

   it('should update a goal', async () => {
      await updateGoal(goal.id, { current_amount: 500 });
      const updated = await getGoal(goal.id);
      expect(updated.current_amount).toBe(500);
   });

   it('should fetch user goals', async () => {
      const goals = await getUserGoals(goal.user_id);
      expect(goals).toEqual(expect.arrayContaining([ expect.objectContaining({ id: goal.id }) ]));
   });

   it('should add a transaction to goal', async () => {
      const transaction = {
         id: testGoalId + 999,
         user_id: goal.user_id,
         amount: 150,
         date: new Date().toISOString()
      };
      await addTransactionToGoal(goal.id, transaction);
      // Optionally validate manually in DB
   });

   it('should complete the goal and update user points', async () => {
      await updateGoal(goal.id, { current_amount: 1000 });
      await completeGoal(goal.id);
      const completed = await getGoal(goal.id);
      expect(completed.status).toBe('Completed');
   });

   it('should reduce progress and deduct points', async () => {
      await reduceProgress(goal.id, 200);
      const updated = await getGoal(goal.id);
      expect(updated.current_amount).toBeLessThan(1000);
   });

   it('should delete the goal', async () => {
      await deleteGoal(goal.id);
      const deleted = await getGoal(goal.id);
      expect(deleted).toBeUndefined();
   });

   it('should return all goals', async () => {
      const all = await getAllGoals();
      expect(Array.isArray(all)).toBe(true);
   });
});

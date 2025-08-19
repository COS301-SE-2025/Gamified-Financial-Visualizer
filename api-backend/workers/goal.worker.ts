import { logger } from "../config/logger";
import { getAllGoals, updateGoal, completeGoal } from "../services/goal-service/src/services/goals.service";
// import { notifyFriends, getCommunityGoals } from "../../services/community.service"

// Monitors and updates goal progress in the background
export async function initializeGoalWorker() {
   logger.info("[GoalWorker] Initializing goal check...");

   try {
      // For now, assume you're checking all goals for all users
      const goals = await getAllGoals(); // Modify this to return all active goals

      for (const goal of goals) {
         const progress = ((goal.current_amount ?? 0) / (goal.target_amount ?? 1)) * 100;

         if (progress >= 100 && goal.goal_status !== "completed") {
            if (typeof goal.goal_id === "number") {
               await completeGoal(goal.goal_id);
               await notifyFriends(goal.user_id, goal.goal_id);

               logger.info(`[GoalWorker] Goal ${goal.goal_id} marked as complete for user ${goal.user_id}`);
               // TODO: Queue a notification or reward job
            } else {
               logger.warn(`[GoalWorker] Skipping goal with missing goal_id for user ${goal.user_id}`);
            }
         } else if (progress < 100 && (goal.current_amount ?? 0) > 0) {
            if (typeof goal.goal_id === "number") {
               await updateGoal(goal.goal_id, { goal_status: "In Progress" }); // set status to enum In Progress
               logger.info(`[GoalWorker] Goal ${goal.goal_id} is in progress for user ${goal.user_id}`);
            } else {
               logger.warn(`[GoalWorker] Skipping goal with missing goal_id for user ${goal.user_id}`);
            }
         }
      }


      // check community goals
      const communityGoals = await getCommunityGoals();
      for (const goal of communityGoals) {
         const progress = (goal.current_amount / goal.target_amount) * 100;

         if (progress >= 100 && !goal.completed) {
            await completeGoal(goal.id);
            await updateGoal(goal.id, { status: "Completed" }); // set status to enum Completed
            await notifyFriends(goal.user_id, goal.id);

            logger.info(`[GoalWorker] Community goal ${goal.id} marked as complete for user ${goal.user_id}`);

            // add to queue
            
         } else if (progress < 100 && goal.current_amount > 0) {
            await updateGoal(goal.id, { status: "In Progress" }); // set status to enum In Progress
            logger.info(`[GoalWorker] Goal ${goal.id} is in progress for user ${goal.user_id}`);
         }
      }


      logger.info(`[GoalWorker] Goal check completed.`);
   } catch (error) {
      logger.error("[GoalWorker] Error while checking goals:", error);
   }
}

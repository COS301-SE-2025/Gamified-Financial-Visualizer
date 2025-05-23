
import { Pool } from 'pg';
import { logger } from '../config/logger';

const pool = new Pool();

export async function inviteFriend(user_id: number, friend_id: number) {
   const query = `
     INSERT INTO friends (user_id, friend_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, friend_id) DO NOTHING;
   `;

   try {
      await pool.query(query, [ user_id, friend_id ]);
      logger.info(`[CommunityService] Invited friend: ${friend_id} to user: ${user_id}`);
   } catch (error) {
      logger.error(`[CommunityService] Error inviting friend ${friend_id} to user ${user_id}:`, error);
      throw error;
   }
}

export async function getFriends(user_id: number) {
   const query = `
     SELECT * FROM friends WHERE user_id = $1;
   `;

   try {
      const result = await pool.query(query, [ user_id ]);
      return result.rows;
   } catch (error) {
      logger.error(`[CommunityService] Error fetching friends for user ${user_id}:`, error);
      throw error;
   }
}

export async function removeFriend(user_id: number, friend_id: number) {
   const query = `
     DELETE FROM friends WHERE user_id = $1 AND friend_id = $2;
   `;

   try {
      await pool.query(query, [ user_id, friend_id ]);
      logger.info(`[CommunityService] Removed friend: ${friend_id} from user: ${user_id}`);
   } catch (error) {
      logger.error(`[CommunityService] Error removing friend ${friend_id} from user ${user_id}:`, error);
      throw error;
   }
}

export async function getFriendRequests(user_id: number) {
   const query = `
     SELECT * FROM friend_requests WHERE user_id = $1;
   `;

   try {
      const result = await pool.query(query, [ user_id ]);
      return result.rows;
   } catch (error) {
      logger.error(`[CommunityService] Error fetching friend requests for user ${user_id}:`, error);
      throw error;
   }
}

export async function acceptFriendRequest(user_id: number, friend_id: number) {
   const query = `
     INSERT INTO friends (user_id, friend_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, friend_id) DO NOTHING;
   `;

   // remove the friend request after accepting
   const deleteQuery = `
     DELETE FROM friend_requests WHERE user_id = $1 AND friend_id = $2;
   `;

   try {
      await pool.query(query, [ user_id, friend_id ]);
      await pool.query(deleteQuery, [ user_id, friend_id ]);

      logger.info(`[CommunityService] Accepted friend request from ${friend_id} to user: ${user_id}`);
   } catch (error) {
      logger.error(`[CommunityService] Error accepting friend request from ${friend_id} to user ${user_id}:`, error);
      throw error;
   }
}

export async function rejectFriendRequest(user_id: number, friend_id: number) {
   const query = `
     DELETE FROM friend_requests WHERE user_id = $1 AND friend_id = $2;
   `;

   try {
      await pool.query(query, [ user_id, friend_id ]);
      logger.info(`[CommunityService] Rejected friend request from ${friend_id} to user: ${user_id}`);
   } catch (error) {
      logger.error(`[CommunityService] Error rejecting friend request from ${friend_id} to user ${user_id}:`, error);
      throw error;
   }
}

export async function sendFriendRequest(user_id: number, friend_id: number) {
   const query = `
     INSERT INTO friend_requests (user_id, friend_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, friend_id) DO NOTHING;
   `;

   try {
      await pool.query(query, [ user_id, friend_id ]);
      inviteFriend(user_id, friend_id); // Automatically invite the friend
      logger.info(`[CommunityService] Sent friend request from ${user_id} to ${friend_id}`);
   } catch (error) {
      logger.error(`[CommunityService] Error sending friend request from ${user_id} to ${friend_id}:`, error);
      throw error;
   }
}

export async function inviteToGoal(user_id: number, goal_id: number, friend_id: number) {
   const query = `
     INSERT INTO goal_invitations (user_id, goal_id, friend_id)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, goal_id, friend_id) DO NOTHING;
   `;

   try {
      await pool.query(query, [ user_id, goal_id, friend_id ]);
      logger.info(`[CommunityService] Invited ${friend_id} to goal ${goal_id} for user ${user_id}`);
   } catch (error) {
      logger.error(`[CommunityService] Error inviting ${friend_id} to goal ${goal_id} for user ${user_id}:`, error);
      throw error;
   }
}

export async function leaveGoal(user_id: number, goal_id: number) {
   const query = `
     DELETE FROM goal_invitations WHERE user_id = $1 AND goal_id = $2;
   `;

   try {
      await pool.query(query, [ user_id, goal_id ]);
      logger.info(`[CommunityService] User ${user_id} left goal ${goal_id}`);
   } catch (error) {
      logger.error(`[CommunityService] Error user ${user_id} leaving goal ${goal_id}:`, error);
      throw error;
   }
}

export async function getCommunityGoalsForUser(user_id: number) {
   const query = `
     SELECT * FROM community_goals WHERE user_id = $1;
   `;

   try {
      const result = await pool.query(query, [ user_id ]);
      return result.rows;
   } catch (error) {
      logger.error(`[CommunityService] Error fetching goals for user ${user_id}:`, error);
      throw error;
   }
}

export async function getLeaderboard() {
   const query = `
     SELECT * FROM users ORDER BY points DESC LIMIT 10;
   `;

   try {
      const result = await pool.query(query);
      return result.rows;
   } catch (error) {
      logger.error(`[CommunityService] Error fetching leaderboard:`, error);
      throw error;
   }
}

export async function getUserPoints(user_id: number) {
   const query = `
     SELECT points FROM users WHERE id = $1;
   `;

   try {
      const result = await pool.query(query, [ user_id ]);
      return result.rows[ 0 ];
   }
   catch (error) {
      logger.error(`[CommunityService] Error fetching points for user ${user_id}:`, error);
      throw error;
   }
}

export async function updateUserPoints(user_id: number, points: number) {
   const query = `
     UPDATE users SET points = points + $1 WHERE id = $2;
   `;

   try {
      await pool.query(query, [ points, user_id ]);
      logger.info(`[CommunityService] Updated points for user ${user_id}`);
   } catch (error) {
      logger.error(`[CommunityService] Error updating points for user ${user_id}:`, error);
      throw error;
   }
}

export async function getUserAchievements(user_id: number) {
   const query = `
     SELECT * FROM achievements WHERE user_id = $1;
   `;

   try {
      const result = await pool.query(query, [ user_id ]);
      return result.rows;
   } catch (error) {
      logger.error(`[CommunityService] Error fetching achievements for user ${user_id}:`, error);
      throw error;
   }
}

export async function addAchievement(user_id: number, achievement: number) { // @TODO: Change to ACHIEVEMENT DATA TYPE
   const query = `
     INSERT INTO achievements (user_id, achievement)
     VALUES ($1, $2);
   `;

   try {
      await pool.query(query, [ user_id, achievement ]);
      logger.info(`[CommunityService] Added achievement for user ${user_id}: ${achievement}`);
   } catch (error) {
      logger.error(`[CommunityService] Error adding achievement for user ${user_id}:`, error);
      throw error;
   }
}

export async function removeAchievement(user_id: number, achievement: number) { // @TODO: Change to ACHIEVEMENT DATA TYPE
   const query = `
     DELETE FROM achievements WHERE user_id = $1 AND achievement = $2;
   `;

   try {
      await pool.query(query, [ user_id, achievement ]);
      logger.info(`[CommunityService] Removed achievement for user ${user_id}: ${achievement}`);
   } catch (error) {
      logger.error(`[CommunityService] Error removing achievement for user ${user_id}:`, error);
      throw error;
   }
}

interface Goal {
   name: string;
   target_amount: number;
   current_amount: number;
   start_date: Date;
   end_date: Date;
   status : string;
}

export async function createFriendGoal(user_id: number, goal: Goal ) {
   const { name, target_amount, current_amount, start_date, end_date, status } = goal;
   
   const query = `
     INSERT INTO goal_friends (user_id, name, target_amount, current_amount, start_date, end_date, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id;
   `;

   try {
      const result = await pool.query(query, [ user_id, name, target_amount, current_amount, start_date, end_date, status ]);
      logger.info(`[CommunityService] Created friend goal for user ${user_id}: ${goal.name}`);
      return result.rows[ 0 ].id;
   } catch (error) {
      logger.error(`[CommunityService] Error creating friend goal for user ${user_id}:`, error);
      throw error;
   }
}

// invite to community goal
export async function addFriendsToGoal(user_id: number, goal_id: number) {

   // @Todo: call getUserFriends(user_id) to get the list of friends
   const friend_ids = [ 1, 2, 3 ]; // Replace with actual friend IDs


   const query = `
     INSERT INTO goal_friends (user_id, goal_id, friend_id)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, goal_id, friend_id) DO NOTHING;
   `;

   try {
      for (const friend_id of friend_ids) {
         await pool.query(query, [ user_id, goal_id, friend_id ]);
      }
      logger.info(`[CommunityService] Added friends to goal ${goal_id} for user ${user_id}`);
   } catch (error) {
      logger.error(`[CommunityService] Error adding friends to goal ${goal_id} for user ${user_id}:`, error);
      throw error;
   }
}

export async function removeFriendsFromGoal(user_id: number, goal_id: number) {
   // @Todo: call getUserFriends(user_id) to get the list of friends
   const friend_ids = [ 1, 2, 3 ]; // Replace with actual friend IDs

   const query = `
     DELETE FROM goal_friends WHERE user_id = $1 AND goal_id = $2 AND friend_id = $3;
   `;

   try {
      for (const friend_id of friend_ids) {
         await pool.query(query, [ user_id, goal_id, friend_id ]);
      }
      logger.info(`[CommunityService] Removed friends from goal ${goal_id} for user ${user_id}`);
   } catch (error) {
      logger.error(`[CommunityService] Error removing friends from goal ${goal_id} for user ${user_id}:`, error);
      throw error;
   }
}

// export async function notifyFriends(user_id: number, goal_id: number) {
//    const query = `
//      SELECT friend_id FROM goal_friends WHERE user_id = $1 AND goal_id = $2;
//    `;

//    try {
//       const result = await pool.query(query, [ user_id, goal_id ]);
//       const friend_ids = result.rows.map(row => row.friend_id);

//       for (const friend_id of friend_ids) {
//          // Send notification to friend
//          logger.info(`[CommunityService] Notified friend ${friend_id} about goal ${goal_id} for user ${user_id}`);
//       }
//    } catch (error) {
//       logger.error(`[CommunityService] Error notifying friends about goal ${goal_id} for user ${user_id}:`, error);
//       throw error;
//    }
// }

// export async function getCommunityGoals() {
//    const query = `
//      SELECT * FROM community_goals;
//    `;

//    try {
//       const result = await pool.query(query);
//       return result.rows;
//    } catch (error) {
//       logger.error(`[CommunityService] Error fetching community goals `, error);
//       throw error;
//    }
// }


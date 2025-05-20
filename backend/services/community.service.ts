
import { Pool } from 'pg';
import { logger } from '../config/logger';

const pool = new Pool();

export async function inviteFriend(user_id, friend_id) {
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

export async function getFriends(user_id) {
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

export async function removeFriend(user_id, friend_id) {
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

export async function getFriendRequests(user_id) {
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

export async function acceptFriendRequest(user_id, friend_id) {
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

export async function rejectFriendRequest(user_id, friend_id) {
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

export async function sendFriendRequest(user_id, friend_id) {
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

export async function inviteToGoal(user_id, goal_id, friend_id) {
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

export async function leaveGoal(user_id, goal_id) {
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

export async function getCommunityGoals(user_id) {
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
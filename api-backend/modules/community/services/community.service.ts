// community.service.ts
// Handles database operations for communities, members, and challenges.
import pool from "../../../config/db";
import { logger } from "../../../config/logger";

export interface CommunityRecord {
  owner_id: number;
  community_name: string;
  description?: string;
  banner_filename?: string;
}

export async function createCommunity(data: CommunityRecord) {
  const query = `
    INSERT INTO communities (owner_id, community_name, description, banner_filename)
    VALUES ($1, $2, $3, COALESCE($4, 'default_banner_01.png'))
    RETURNING *;
  `;
  try {
    const result = await pool.query(query, [
      data.owner_id,
      data.community_name,
      data.description || null,
      data.banner_filename
    ]);
    logger.info(`[CommunityService] Created community: ${data.community_name}`);
    return result.rows[0];
  } catch (err) {
    logger.error('[CommunityService] Failed to create community:', err);
    throw err;
  }
}

export async function getCommunityById(community_id: number) {
  const query = 'SELECT * FROM communities WHERE community_id = $1';
  try {
    const result = await pool.query(query, [community_id]);
    return result.rows[0];
  } catch (err) {
    logger.error(`[CommunityService] Failed to fetch community ID ${community_id}:`, err);
    throw err;
  }
}

export async function listCommunitiesByUser(user_id: number) {
  const query = `
    SELECT c.*
    FROM communities c
    JOIN community_members m ON c.community_id = m.community_id
    WHERE m.user_id = $1 AND m.membership_status = 'accepted'
  `;
  try {
    const result = await pool.query(query, [user_id]);
    return result.rows;
  } catch (err) {
    logger.error(`[CommunityService] Failed to list communities for user ID ${user_id}:`, err);
    throw err;
  }
}

export async function addCommunityMember(community_id: number, user_id: number, status: 'invited' | 'requested' | 'accepted' | 'declined') {
  const query = `
    INSERT INTO community_members (community_id, user_id, membership_status)
    VALUES ($1, $2, $3)
    ON CONFLICT (community_id, user_id) DO UPDATE
    SET membership_status = EXCLUDED.membership_status,
        joined_at = CURRENT_TIMESTAMP
    RETURNING *;
  `;
  try {
    const result = await pool.query(query, [community_id, user_id, status]);
    logger.info(`[CommunityService] Membership updated: user ${user_id} in community ${community_id} as ${status}`);
    return result.rows[0];
  } catch (err) {
    logger.error(`[CommunityService] Failed to add/update member ${user_id} to community ${community_id}:`, err);
    throw err;
  }
}

export async function getCommunityMembers(community_id: number) {
  const query = `
    SELECT u.user_id, u.username, m.membership_status, m.joined_at
    FROM users u
    JOIN community_members m ON u.user_id = m.user_id
    WHERE m.community_id = $1
  `;
  try {
    const result = await pool.query(query, [community_id]);
    return result.rows;
  } catch (err) {
    logger.error(`[CommunityService] Failed to fetch members of community ${community_id}:`, err);
    throw err;
  }
}

export async function removeCommunityMember(community_id: number, user_id: number) {
  const query = 'DELETE FROM community_members WHERE community_id = $1 AND user_id = $2';
  try {
    await pool.query(query, [community_id, user_id]);
    logger.info(`[CommunityService] Removed user ${user_id} from community ${community_id}`);
  } catch (err) {
    logger.error(`[CommunityService] Failed to remove user ${user_id} from community ${community_id}:`, err);
    throw err;
  }
}

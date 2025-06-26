// community.service.ts
// Handles database operations for communities, members, and challenges.
import pool from "../../../config/db";
import { logger } from "../../../config/logger";

export interface CommunityRecord {
  owner_id: number;
  community_name: string;
  description?: string;
  banner_id?: number;
}

export async function createCommunity(data: CommunityRecord) {
  const query = `
    INSERT INTO communities (owner_id, community_name, description, banner_id)
    VALUES ($1, $2, $3, COALESCE($4, 1))
    RETURNING *;
  `;
  try {
    const result = await pool.query(query, [data.owner_id, data.community_name, data.description || null, data.banner_id || 1]
    );
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

// Get all pending invites or requests where the user has not yet been accepted
export async function getPendingInvites(user_id: number) {
  const query = `
    SELECT c.community_id, c.community_name, m.membership_status, m.joined_at
    FROM community_members m
    JOIN communities c ON m.community_id = c.community_id
    WHERE m.user_id = $1 AND m.membership_status IN ('invited', 'requested')
  `;
  try {
    const result = await pool.query(query, [user_id]);
    logger.info(`[CommunityService] Fetched pending invites/requests for user ID ${user_id}`);
    return result.rows;
  } catch (err) {
    logger.error(`[CommunityService] Failed to fetch pending invites for user ID ${user_id}:`, err);
    throw err;
  }
}

// Get all challenges that a given community is participating in
export async function getCommunityChallenges(community_id: number) {
  const query = `
    SELECT ch.challenge_id, ch.challenge_title, ch.description, ch.challenge_type, ch.measurement_type,
           cp.actual_start, cp.actual_end, cp.score, cp.challenge_status
    FROM challenge_progress cp
    JOIN challenges ch ON cp.challenge_id = ch.challenge_id
    WHERE cp.community_id = $1
  `;
  try {
    const result = await pool.query(query, [community_id]);
    logger.info(`[CommunityService] Retrieved challenges for community ID ${community_id}`);
    return result.rows;
  } catch (err) {
    logger.error(`[CommunityService] Failed to fetch challenges for community ID ${community_id}:`, err);
    throw err;
  }
}

// Get global leaderboard for communities
export async function getGlobalLeaderboard() {
  const query = `
    SELECT 
      u.username,
      up.total_points,
      up.tier_status,
      ai.avatar_image_path,
      RANK() OVER (ORDER BY up.total_points DESC) AS rank
    FROM user_points up
    JOIN users u ON u.user_id = up.user_id
    JOIN user_preferences pref ON pref.user_id = u.user_id
    JOIN avatar_images ai ON pref.avatar_id = ai.avatar_id
    ORDER BY up.total_points DESC
    LIMIT 10;
  `;

  try {
    const result = await pool.query(query);
    logger.info('[CommunityService] Global leaderboard fetched');
    return result.rows;
  } catch (err) {
    logger.error('[CommunityService] Failed to fetch global leaderboard:', err);
    throw err;
  }
}

// Get community stats for a user
export async function getCommunityStats(user_id: number) {
  try {
    const client = await pool.connect();

    const [
      communities,
      challenges,
      leaderboardRank,
      gamesPlayed,
      friends
    ] = await Promise.all([
      // 1. Communities joined
      client.query(`
        SELECT COUNT(*) FROM community_members
        WHERE user_id = $1 AND membership_status = 'accepted'
      `, [user_id]),

      // 2. Challenges across user's communities
      client.query(`
        SELECT COUNT(*) FROM challenges c
        WHERE c.community_id IN (
          SELECT community_id FROM community_members
          WHERE user_id = $1 AND membership_status = 'accepted'
        )
      `, [user_id]),

      // 3. Leaderboard rank (assumes 1 row per user)
      client.query(`
        SELECT ranking FROM leaderboard_entries
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 1
      `, [user_id]),

      // 4. Games played — from quiz attempts
      client.query(`
        SELECT COUNT(*) FROM quiz_attempts
        WHERE user_id = $1
      `, [user_id]),

      // 5. Friends — accepted only
      client.query(`
        SELECT COUNT(*) FROM friendships
        WHERE (user_id = $1 OR friend_id = $1)
        AND relationship_status = 'accepted'
      `, [user_id])
    ]);

    client.release();

    return {
      communities: parseInt(communities.rows[0].count),
      challenges: parseInt(challenges.rows[0].count),
      leaderboard: leaderboardRank.rows[0]?.ranking || null,
      gamesPlayed: parseInt(gamesPlayed.rows[0].count),
      friends: parseInt(friends.rows[0].count),
      socialPosts: 7 // Mocked static value for now
    };
  } catch (err) {
    logger.error(`[CommunityService] Failed to fetch stats for user ${user_id}:`, err);
    throw err;
  }
}

// Get community performance summary for a user
export async function getCommunityPerformanceSummary(user_id: number) {
  try {
    await pool.query(`
      INSERT INTO user_points (user_id, total_points)
      VALUES ($1, 0)
      ON CONFLICT (user_id) DO NOTHING
    `, [user_id]);

    const query = `
      SELECT
        ai.avatar_image_path,
        up.total_points,
        up.tier_status,

        -- Challenges joined
        COALESCE((
          SELECT COUNT(*) FROM challenge_progress
          WHERE user_id = $1 AND participation_status = 'joined'
        ), 0) AS challenges,

        -- Leaderboard position (percentile based)
        COALESCE((
          SELECT 100 - ROUND(ranking * 100.0 / NULLIF(total_rows, 1))
          FROM (
            SELECT ranking, COUNT(*) OVER() AS total_rows
            FROM leaderboard_entries
            WHERE user_id = $1
            ORDER BY created_at DESC LIMIT 1
          ) t
        ), 0) AS leaderboard,

        -- Games played (quiz attempts)
        COALESCE((SELECT COUNT(*) FROM quiz_attempts WHERE user_id = $1), 0) AS games_played,

        -- Communities joined
        COALESCE((
          SELECT COUNT(*) FROM community_members
          WHERE user_id = $1 AND membership_status = 'accepted'
        ), 0) AS communities,

        -- Friends
        COALESCE((
          SELECT COUNT(*) FROM friendships
          WHERE (user_id = $1 OR friend_id = $1) AND relationship_status = 'accepted'
        ), 0) AS friends

      FROM user_points up
      JOIN user_preferences pref ON pref.user_id = up.user_id
      JOIN avatar_images ai ON pref.avatar_id = ai.avatar_id
      WHERE up.user_id = $1;
    `;

    const { rows } = await pool.query(query, [user_id]);
    const d = rows[0];
    if (!d) throw new Error("No data found for user.");

    const xp = d.total_points;

    // Scoring weights
    const score =
    (Math.min(d.challenges, 30) * 3) +       // Max 90
    (d.leaderboard * 1.0) +                  // Max 100
    (Math.min(d.games_played, 50) * 2) +     // Max 100
    (Math.min(d.communities, 20) * 2) +      // Max 40
    (Math.min(d.friends, 30) * 1.5) +        // Max 45
    (Math.min(7, 20) * 2) +        // Max 40
    50;                                      // Bonus for participating in all areas

    const performance_score = Math.min(Math.round(score), 1000);

    let performance_label = 'Poor';
    if (performance_score >= 800) performance_label = 'Excellent';
    else if (performance_score >= 600) performance_label = 'Good';
    else if (performance_score >= 400) performance_label = 'Average';
    else if (performance_score >= 200) performance_label = 'Fair';

    const tier_level = d.tier_status;
    const level_number = Math.floor(xp / 2000) + 1;

    return {
      avatar_image_path: d.avatar_image_path,
      tier_level,
      level_number,
      performance_score,
      performance_label
    };
  } catch (err: any) {
    logger.error(`[CommunityService] Failed to fetch performance summary for user ID ${user_id}:`, err.message || err);
    throw new Error("Could not fetch community performance summary.");
  }
}

// Delete a community
export async function deleteCommunityById(community_id: number) {
  try {
    const result = await pool.query(
      'DELETE FROM communities WHERE community_id = $1 RETURNING *;',
      [community_id]
    );

    if (result.rowCount === 0) {
      throw new Error(`Community ID ${community_id} not found.`);
    }

    logger.info(`[CommunityService] Deleted community ID ${community_id}`);
    return result.rows[0];
  } catch (err) {
    logger.error(`[CommunityService] Failed to delete community ID ${community_id}:`, err);
    throw err;
  }
}

// Get all available banners
export async function getAllBanners() {
  try {
    const result = await pool.query(`
      SELECT banner_id, banner_image_path FROM banner_images
    `);
    logger.info('[CommunityService] Fetched all banners');
    return result.rows;
  } catch (err) {
    logger.error('[CommunityService] Failed to fetch banners:', err);
    throw err;
  }
}

// Get friends with avatars for a specific user
export async function getUserFriendsWithAvatars(user_id: number) {
  try {
    const result = await pool.query(`
      SELECT u.user_id, u.username, ai.avatar_image_path
      FROM friendships f
      JOIN users u ON u.user_id = CASE
        WHEN f.user_id = $1 THEN f.friend_id
        ELSE f.user_id
      END
      JOIN user_preferences pref ON pref.user_id = u.user_id
      JOIN avatar_images ai ON pref.avatar_id = ai.avatar_id
      WHERE (f.user_id = $1 OR f.friend_id = $1)
        AND f.relationship_status = 'accepted'
    `, [user_id]);

    logger.info(`[CommunityService] Fetched friends with avatars for user ID ${user_id}`);
    return result.rows;
  } catch (err) {
    logger.error(`[CommunityService] Failed to fetch friends for user ${user_id}:`, err);
    throw err;
  }
}

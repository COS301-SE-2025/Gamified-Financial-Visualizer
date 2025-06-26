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

interface ChallengeItem {
  id: number;
  title: string;
  category: number | null;
  type: string;
  goal: string;
  reward: number;
  progress: number;
  progressText: string;
  difficulty: string;
  start: Date;
  end: Date;
  formattedEnd: string;
  remaining: number;
  community: string;
  participants: number;
  banner: string | null;
  status: string;
  startsIn?: number;
  completedOn?: string;
}

export async function getChallengesByUserCategorized(user_id: number): Promise<{
  active: ChallengeItem[];
  upcoming: ChallengeItem[];
  completed: ChallengeItem[];
}> {
  const query = `
    SELECT
      ch.challenge_status,
      ch.challenge_id,
      ch.challenge_title,
      ch.challenge_type,
      ch.category_id,
      ch.target_amount,
      COALESCE(cp.progress_amount, 0) AS current_value,
      cp.join_date AS actual_start,
      cp.last_updated AS actual_end,
      ch.difficulty,
      ch.target_date AS end_date,
      c.community_name,
      b.banner_image_path,
      (
        SELECT COUNT(*) FROM community_members cm
        WHERE cm.community_id = ch.community_id
          AND cm.membership_status = 'accepted'
      ) AS participants
    FROM challenges ch
    JOIN communities c ON c.community_id = ch.community_id
    LEFT JOIN banner_images b ON b.banner_id = c.banner_id
    LEFT JOIN challenge_progress cp ON cp.challenge_id = ch.challenge_id AND cp.user_id = $1
    WHERE ch.community_id IN (
      SELECT community_id FROM community_members
      WHERE user_id = $1 AND membership_status = 'accepted'
    )
    ORDER BY ch.challenge_status, COALESCE(cp.join_date, ch.start_date) DESC;
  `;

  const { rows } = await pool.query(query, [user_id]);

  const categorized = {
    active: [] as ChallengeItem[],
    upcoming: [] as ChallengeItem[],
    completed: [] as ChallengeItem[],
  };

  const now = new Date();

  for (const row of rows) {
    const current = Number(row.current_value || 0);
    const target = Number(row.target_amount || 1);
    const progress = Math.min(Math.round((current / target) * 100), 100);
    const reward = Math.floor(target / 100);
    const start = new Date(row.actual_start);
    const end = new Date(row.end_date);
    const hasStarted = start.getTime() <= now.getTime();
    const hasProgress = current > 0;

    const base = {
      id: row.challenge_id,
      title: row.challenge_title,
      category: row.category_id,
      type: row.challenge_type,
      goal: `${current}/${target} ZAR`,
      reward,
      progress,
      progressText: `${progress}% complete`,
      difficulty: row.difficulty || 'easy',
      start,
      end,
      formattedEnd: end.toLocaleDateString('en-GB'),
      remaining: target - current,
      community: row.community_name,
      participants: Number(row.participants),
      banner: row.banner_image_path,
      status: row.challenge_status,
    };

    if (row.challenge_status === 'completed') {
      categorized.completed.push({
        ...base,
        completedOn: end.toISOString().split('T')[0],
      });
    } else if (hasStarted || hasProgress) {
      categorized.active.push(base);
    } else {
      categorized.upcoming.push({
        ...base,
        startsIn: Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      });
    }
  }

  return categorized;
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
  const query = `
    SELECT 
      u.user_id,
      u.username,
      ai.avatar_image_path,
      up.tier_status
    FROM friendships f
    JOIN users u ON u.user_id = CASE
      WHEN f.user_id = $1 THEN f.friend_id
      ELSE f.user_id
    END
    JOIN user_preferences pref ON pref.user_id = u.user_id
    JOIN avatar_images ai ON pref.avatar_id = ai.avatar_id
    LEFT JOIN user_points up ON u.user_id = up.user_id
    WHERE (f.user_id = $1 OR f.friend_id = $1)
      AND f.relationship_status = 'accepted'
  `;

  try {
    const result = await pool.query(query, [user_id]);
    logger.info(`[CommunityService] Fetched friends with avatars and tier for user ID ${user_id}`);
    return result.rows;
  } catch (err) {
    logger.error(`[CommunityService] Failed to fetch friends for user ${user_id}:`, err);
    throw err;
  }
}

// Get friend recommendations based on mutual friends and tier status
export async function getFriendRecommendations(user_id: number, limit: number = 5) {
  try {
    const query = `
      WITH current_friends AS (
        SELECT CASE
                 WHEN f.user_id = $1 THEN f.friend_id
                 ELSE f.user_id
               END AS friend_id
        FROM friendships f
        WHERE (f.user_id = $1 OR f.friend_id = $1)
          AND f.relationship_status = 'accepted'
      ),
      mutual_candidates AS (
        SELECT
          u.user_id,
          u.username,
          ai.avatar_image_path,
          up.tier_status,
          COUNT(DISTINCT mf.friend_id) AS mutual_friend_count,
          CASE WHEN up.tier_status = (SELECT tier_status FROM user_points WHERE user_id = $1) THEN 1 ELSE 0 END AS same_tier
        FROM users u
        JOIN user_preferences pref ON pref.user_id = u.user_id
        JOIN avatar_images ai ON pref.avatar_id = ai.avatar_id
        JOIN user_points up ON up.user_id = u.user_id
        LEFT JOIN friendships f2 ON (f2.user_id = u.user_id OR f2.friend_id = u.user_id) AND f2.relationship_status = 'accepted'
        LEFT JOIN current_friends mf ON mf.friend_id = CASE
                                                        WHEN f2.user_id = u.user_id THEN f2.friend_id
                                                        ELSE f2.user_id
                                                      END
        WHERE u.user_id != $1
          AND u.user_id NOT IN (SELECT friend_id FROM current_friends)
        GROUP BY u.user_id, ai.avatar_image_path, up.tier_status
      )
      SELECT *
      FROM mutual_candidates
      ORDER BY mutual_friend_count DESC, same_tier DESC, RANDOM()
      LIMIT $2;
    `;

    const { rows } = await pool.query(query, [user_id, limit]);
    logger.info(`[CommunityService] Fetched ${rows.length} friend recommendations for user ${user_id}`);
    return rows;
  } catch (err) {
    logger.error(`[CommunityService] Failed to get recommendations for user ${user_id}:`, err);
    throw err;
  }
}

export async function sendFriendRequest(sender_id: number, receiver_id: number) {
  const [user1, user2] = sender_id < receiver_id
    ? [sender_id, receiver_id]
    : [receiver_id, sender_id];

  const query = `
    INSERT INTO friendships (user_id, friend_id, relationship_status)
    VALUES ($1, $2, 'pending')
    ON CONFLICT (user_id, friend_id) DO UPDATE
    SET relationship_status = 'pending',
        created_at = CURRENT_TIMESTAMP
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, [user1, user2]);
    logger.info(`[CommunityService] Friend request recorded between ${user1} and ${user2}`);
    return result.rows[0];
  } catch (err) {
    logger.error(`[CommunityService] Failed to send friend request:`, err);
    throw err;
  }
}


export async function deleteFriend(user_id: number, friend_id: number) {
  const [u1, u2] = user_id < friend_id ? [user_id, friend_id] : [friend_id, user_id];

  const query = `
    DELETE FROM friendships
    WHERE user_id = $1 AND friend_id = $2
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, [u1, u2]);
    if (result.rowCount === 0) {
      throw new Error(`No friendship found between ${u1} and ${u2}`);
    }
    logger.info(`[CommunityService] Friendship deleted between ${u1} and ${u2}`);
    return result.rows[0];
  } catch (err) {
    logger.error(`[CommunityService] Failed to delete friend between ${u1} and ${u2}:`, err);
    throw err;
  }
}

export interface ChallengeRecord {
  creator_id: number;
  community_id: number;
  challenge_title: string;
  challenge_type: string;
  measurement_type: string;
  target_amount: number;
  target_date: string;
  start_date: string;
  category_id?: number;
  custom_category_id?: number;
  banner_id?: number;
  difficulty?: string;
  xp_reward?: number; // still optional in case you want to override it
}

export async function createChallenge(data: ChallengeRecord) {
  const {
    creator_id,
    community_id,
    challenge_title,
    challenge_type,
    measurement_type,
    target_amount,
    start_date,
    target_date,
    category_id,
    custom_category_id,
    banner_id,
    difficulty,
  } = data;

  // Ensure one category is selected
  if ((category_id && custom_category_id) || (!category_id && !custom_category_id)) {
    throw new Error("Exactly one of 'category_id' or 'custom_category_id' must be provided.");
  }

  // Calculate XP reward based on target amount
  const xp_reward = Math.max(10, Math.floor(Number(target_amount) / 100));

  const query = `
    INSERT INTO challenges (
      creator_id,
      community_id,
      challenge_title,
      challenge_type,
      measurement_type,
      target_amount,
      start_date,
      target_date,
      category_id,
      custom_category_id,
      banner_id,
      difficulty
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, COALESCE($11, 1), COALESCE($12, 'easy'))
    RETURNING *, $13::INT AS xp_reward;
  `;

  const values = [
    creator_id,
    community_id,
    challenge_title,
    challenge_type,
    measurement_type,
    target_amount,
    start_date,
    target_date,
    category_id || null,
    custom_category_id || null,
    banner_id || 1,
    difficulty || 'easy',
    xp_reward,
  ];

  try {
    const result = await pool.query(query, values);
    logger.info(`[CommunityService] Created challenge '${challenge_title}'`);
    return result.rows[0]; // includes xp_reward as virtual field
  } catch (err) {
    logger.error('[CommunityService] Failed to create challenge:', err);
    throw err;
  }
}

export async function getCategoriesWithCustom(userId: number) {
  const query = `
    SELECT category_id AS id, category_name AS name, 'global' AS source FROM categories
    UNION
    SELECT custom_category_id AS id, custom_category_name AS name, 'custom' AS source
    FROM custom_categories
    WHERE user_id = $1
    ORDER BY source, name;
  `;

  try {
    const result = await pool.query(query, [userId]);
    return result.rows;
  } catch (err) {
    logger.error('[CommunityService] Failed to fetch categories:', err);
    throw err;
  }
}


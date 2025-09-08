// community.service.ts
// Handles database operations for communities, members, and challenges.
import pool from "../../../config/db";
import { logger } from "../../../config/logger";
import { redisClient } from '../../../config/redis';


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
    const result = await pool.query(query, [ data.owner_id, data.community_name, data.description || null, data.banner_id || 1 ]
    );
    logger.info(`[CommunityService] Created community: ${data.community_name}`);
    return result.rows[ 0 ];
  } catch (err) {
    logger.error('[CommunityService] Failed to create community:', err);
    throw err;
  }
}

export async function getCommunityById(community_id: number) {
  const query = 'SELECT * FROM communities WHERE community_id = $1';
  try {
    const result = await pool.query(query, [ community_id ]);
    return result.rows[ 0 ];
  } catch (err) {
    logger.error(`[CommunityService] Failed to fetch community ID ${community_id}:`, err);
    throw err;
  }
}


export async function getCommunityByTitle(name: string) {
  const query = `
    SELECT
      c.community_id,
      c.community_name,
      c.description,
      c.banner_id      AS "bannerId",
      CONCAT('../../assets/Images', '/', b.banner_image_path) AS banner_url,

      /* 1) MEMBERS */
      (
        SELECT COALESCE(json_agg(json_build_object(
          'user_id',   u.user_id,
          'username',  u.username,
          'level',     p.tier_status,
          'avatar',    CONCAT('../../assets/Images', '/', ai.avatar_image_path),
          'joined_at', m.joined_at
        )), '[]'::json)
        FROM community_members m
        JOIN users u         ON u.user_id = m.user_id
        JOIN user_points p   ON p.user_id = u.user_id
        JOIN user_preferences up ON up.user_id = u.user_id
        JOIN avatar_images ai    ON ai.avatar_id  = up.avatar_id
        WHERE m.community_id = c.community_id
          AND m.membership_status = 'accepted'
      ) AS members,

      /* 2) CHALLENGES */
      (
        SELECT COALESCE(json_agg(json_build_object(
          'id',               ch.challenge_id,
          'title',            ch.challenge_title,
          'challenge_type',   ch.challenge_type,
          'measurement_type', ch.measurement_type,
          'challenge_status',  ch.challenge_status,
          'xp',               GREATEST(10, FLOOR(ch.target_amount/100)),
          'deadline',         to_char(ch.target_date,'YYYY-MM-DD'),

          /* get current_amount via a sub-select */
          'current_amount', ch.current_amount,

          /* target is on the challenge row itself */
          'target_amount', ch.target_amount,

          /* count COMPLETED entries correctly */
          'status',
            CONCAT(
              (
                SELECT COUNT(*) 
                FROM challenge_progress cpB
                JOIN challenges chp ON chp.challenge_id = cpB.challenge_id
                WHERE cpB.challenge_id    = ch.challenge_id
                  AND chp.challenge_status = 'completed'
              ),
              ' completed'
            ),

          /* avatarGroup as before */
          'avatarGroup',
            (
              SELECT COALESCE(json_agg(
                CONCAT('../../assets/Images', '/', ai2.avatar_image_path)
              ), '[]'::json)
              FROM challenge_progress cp2
              JOIN user_preferences up2 ON up2.user_id = cp2.user_id
              JOIN avatar_images ai2    ON ai2.avatar_id = up2.avatar_id
              WHERE cp2.challenge_id = ch.challenge_id
              LIMIT 5
            )

        )), '[]'::json)
        FROM challenges ch
        WHERE ch.community_id = c.community_id
      ) AS challenges,  

      /* 3) XP COLLECTED */
      (
        SELECT COALESCE(SUM(
          GREATEST(10, FLOOR(ch2.target_amount/100))
        ),0)
        FROM challenge_progress cp3
        JOIN challenges ch2 ON ch2.challenge_id = cp3.challenge_id
        WHERE ch2.challenge_status = 'completed'
          AND ch2.community_id = c.community_id
      ) AS "xpCollected",

      /* 4) XP GOAL */
      (
        SELECT COALESCE(SUM(
          GREATEST(10, FLOOR(ch3.target_amount/100))
        ),0)
        FROM challenges ch3
        WHERE ch3.community_id = c.community_id
      ) AS "xpGoal",

      /* 5) GOALS COMPLETED */
      (
        SELECT COUNT(*)
        FROM challenge_progress cp4
        JOIN challenges ch4 ON ch4.challenge_id = cp4.challenge_id
        WHERE ch4.challenge_status = 'completed'
          AND ch4.community_id = c.community_id
      ) AS "goalsCompleted",

      /* 6) TOTAL CHALLENGES */
      (
        SELECT COUNT(*) 
        FROM challenges ch5
        WHERE ch5.community_id = c.community_id
      ) AS "goalsTotal"

    FROM communities c
    LEFT JOIN banner_images b ON b.banner_id = c.banner_id
    WHERE c.community_name ILIKE $1
    LIMIT 1;
  `;

  const { rows } = await pool.query(query, [
    `%${name}%`
  ]);
   
  // add member contributions
  if (rows.length) {
    const contributions = await getContributionScoresByCommunity(rows[0].community_id);
    rows[0].contributions = contributions;
  }
  if (!rows.length) throw new Error(`No community "${name}"`);
  return rows[0];
}


// 1) Update the community’s core fields
export async function updateCommunity(
  communityId: number,
  data: {
    community_name: string;
    description: string;
  }
) {
  const { community_name, description } = data;
  const query = `
    UPDATE communities
    SET community_name = $2,
        description    = $3
    WHERE community_id = $1
    RETURNING community_id,
              community_name,
              description,
              banner_id AS "bannerId";
  `;

  const { rows } = await pool.query(query, [
    communityId,
    community_name,
    description
  ]);

  if (rows.length === 0) {
    throw new Error(`Community ${communityId} not found`);
  }
  return rows[ 0 ];
}

export async function removeMember(communityId: number, userId: number): Promise<void> {
  const query = `
    DELETE FROM community_members
    WHERE community_id = $1
      AND user_id      = $2
  `;
  await pool.query(query, [ communityId, userId ]);
}

export async function listCommunitiesByUser(user_id: number) {
  const query = `
    SELECT c.*
    FROM communities c
    JOIN community_members m ON c.community_id = m.community_id
    WHERE m.user_id = $1 AND m.membership_status = 'accepted'
  `;
  try {
    const result = await pool.query(query, [ user_id ]);
    return result.rows;
  } catch (err) {
    logger.error(`[CommunityService] Failed to list communities for user ID ${user_id}:`, err);
    throw err;
  }
}

export async function getRecommendedCommunities(user_id: number) {

  const query = `
    SELECT
      c.community_id,
      c.community_name,
      c.description,
      b.banner_image_path AS banner,

      -- Total XP from challenge_progress for that community
      COALESCE((
        SELECT SUM(GREATEST(10, FLOOR(ch.target_amount / 100))) -- adjust accordingly for points
        FROM challenges ch
        WHERE ch.community_id = c.community_id
      ), 0) AS xp_total,

      -- Total accepted members
      (
        SELECT COUNT(*) FROM community_members cm
        WHERE cm.community_id = c.community_id
          AND cm.membership_status = 'accepted'
      ) AS member_count,

      -- Total challenges in the community
      (
        SELECT COUNT(*) FROM challenges ch
        WHERE ch.community_id = c.community_id
      ) AS challenge_count,

      -- Preview avatars of up to 5 accepted members
      (
        SELECT json_agg(ai.avatar_image_path)
        FROM (
          SELECT a.avatar_image_path
          FROM community_members cm
          JOIN user_preferences up ON cm.user_id = up.user_id
          JOIN avatar_images a ON up.avatar_id = a.avatar_id
          WHERE cm.community_id = c.community_id
            AND cm.membership_status = 'accepted'
          LIMIT 5
        ) AS ai
      ) AS preview_avatars

    FROM communities c
    INNER JOIN community_members m ON c.community_id = m.community_id
    JOIN banner_images b ON c.banner_id = b.banner_id
    WHERE c.community_id NOT IN (
      SELECT community_id FROM community_members WHERE user_id = $1
    )
    GROUP BY c.community_id, b.banner_image_path;
  `;


  try {
    const result = await pool.query(query, [ user_id ]);
    return result.rows;
  } catch (err) {
    logger.error(`[CommunityService] Failed to fetch recommended communities for user ID ${user_id}:`, err);
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
    const result = await pool.query(query, [ community_id, user_id, status ]);
    logger.info(`[CommunityService] Membership updated: user ${user_id} in community ${community_id} as ${status}`);
    return result.rows[ 0 ];
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
    const result = await pool.query(query, [ community_id ]);
    return result.rows;
  } catch (err) {
    logger.error(`[CommunityService] Failed to fetch members of community ${community_id}:`, err);
    throw err;
  }
}

export async function removeCommunityMember(community_id: number, user_id: number) {
  const query = 'DELETE FROM community_members WHERE community_id = $1 AND user_id = $2';
  try {
    await pool.query(query, [ community_id, user_id ]);
    logger.info(`[CommunityService] Removed user ${user_id} from community ${community_id}`);
    return;
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
    const result = await pool.query(query, [ user_id ]);
    logger.info(`[CommunityService] Fetched pending invites/requests for user ID ${user_id}`);
    return result.rows;
  } catch (err) {
    logger.error(`[CommunityService] Failed to fetch pending invites for user ID ${user_id}:`, err);
    throw err;
  }
}

export async function getCommunityInvites(community_id: number) {
  const query = `
    SELECT u.user_id, u.username, m.membership_status, ai.avatar_image_path, up2.total_points
    FROM community_members m
    INNER JOIN users u ON m.user_id = u.user_id
    JOIN user_preferences up ON u.user_id = up.user_id
    JOIN avatar_images ai ON up.avatar_id = ai.avatar_id
    JOIN user_points up2 ON u.user_id = up2.user_id
    WHERE m.community_id = $1 AND m.membership_status IN ('invited', 'requested')
  `;
  try {
    const result = await pool.query(query, [ community_id ]);
    logger.info(`[CommunityService] Fetched invites for community ID ${community_id}`);
    return result.rows;
  } catch (err) {
    logger.error(`[CommunityService] Failed to fetch invites for community ID ${community_id}:`, err);
    throw err;
  }
}

export async function respondToInvite(community_id: number, user_id: number, response: 'accepted' | 'declined') {
  const query = `
    UPDATE community_members
    SET membership_status = $1
    WHERE community_id = $2 AND user_id = $3
  `;
  try {
    await pool.query(query, [ response, community_id, user_id ]);
    logger.info(`[CommunityService] Updated invite response for user ID ${user_id} in community ID ${community_id} to ${response}`);
  } catch (err) {
    logger.error(`[CommunityService] Failed to update invite response for user ID ${user_id} in community ID ${community_id}:`, err);
    throw err;
  }
}

export async function requestCommunityMembership(community_id: number, user_id: number) {
  const query = `
    INSERT INTO community_members (community_id, user_id, membership_status)
    VALUES ($1, $2, 'requested')
  `;
  try {
    await pool.query(query, [ community_id, user_id ]);
    logger.info(`[CommunityService] User ID ${user_id} requested membership for community ID ${community_id}`);
  } catch (err) {
    logger.error(`[CommunityService] Failed to request membership for user ID ${user_id} in community ID ${community_id}:`, err);
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
      const result = await pool.query(query, [ community_id ]);
    logger.info(`[CommunityService] Retrieved challenges for community ID ${community_id}`);
    return result.rows;
  } catch (err) {
    logger.error(`[CommunityService] Failed to fetch challenges for community ID ${community_id}:`, err);
    throw err;
  }
}

export async function updateChallengeState() {
  const query = `
    UPDATE challenges
    SET challenge_status = CASE
      WHEN end_date < NOW() AND current_amount < target_amount THEN 'expired'
      WHEN end_date < NOW() AND current_amount >= target_amount THEN 'completed'
      WHEN start_date > NOW() THEN 'upcoming'
      ELSE 'active'
    END
  `;
  try {
    await pool.query(query);
  } catch (err) {
    logger.error(`[CommunityService] Failed to update challenge states:`, err);
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
  expired: ChallengeItem[];
}> {
  // Ensure challenge states are up-to-date
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

  const { rows } = await pool.query(query, [ user_id ]);

  const categorized = {
    active: [] as ChallengeItem[],
    upcoming: [] as ChallengeItem[],
    completed: [] as ChallengeItem[],
    expired: [] as ChallengeItem[],
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
        completedOn: end.toISOString().split('T')[ 0 ],
      });
    } else if (row.challenge_status === 'expired') {
      categorized.expired.push(base);
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

export async function getChallenge(challenge_id: number) {
  const query = `
  SELECT 
      ch.*,
      c.community_name,
      b.banner_image_path,

      -- total accepted members count
      (
        SELECT COUNT(*) 
        FROM community_members cm
        WHERE cm.community_id = ch.community_id
          AND cm.membership_status = 'accepted'
      ) AS "participantsCount",

      -- list of avatar image paths (e.g. latest 5)
      (
        SELECT COALESCE(json_agg(ai.avatar_image_path), '[]'::json)
        FROM community_members cm
        JOIN user_preferences up
          ON up.user_id = cm.user_id
        JOIN avatar_images ai
          ON ai.avatar_id = up.avatar_id
        WHERE cm.community_id = ch.community_id
          AND cm.membership_status = 'accepted'
        LIMIT 5
      ) AS participants,

      (ch.target_date::date - CURRENT_DATE) AS days_until_due,
      GREATEST(10, FLOOR(ch.target_amount / 100)) AS xp_points

    FROM challenges ch
    JOIN communities c   ON c.community_id = ch.community_id
    LEFT JOIN banner_images b
      ON b.banner_id = c.banner_id
    WHERE ch.challenge_id = $1;`

  try {
    const result = await pool.query(query, [ challenge_id ]);
    if (result.rowCount === 0) {
      throw new Error(`Challenge ID ${challenge_id} not found.`);
    }
    return result.rows[ 0 ];
  } catch (err) {
    logger.error(`[CommunityService] Failed to fetch challenge ID ${challenge_id}:`, err);
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
      friends,
      socialPosts
    ] = await Promise.all([
      // 1) Communities joined
      client.query(
        `
        SELECT COUNT(*) 
        FROM community_members
        WHERE user_id = $1
          AND membership_status = 'accepted'
        `,
        [user_id]
      ),

      // 2) Challenges across user's communities
      client.query(
        `
        SELECT COUNT(*)
        FROM challenges c
        WHERE c.community_id IN (
          SELECT community_id 
          FROM community_members
          WHERE user_id = $1
            AND membership_status = 'accepted'
        )
        `,
        [user_id]
      ),

      // 3) Leaderboard rank (assumes 1 row per user)
      client.query(
        `
        SELECT ranking
        FROM (
          SELECT user_id, RANK() OVER (ORDER BY total_points DESC) AS ranking
          FROM user_points
        ) ranked
        WHERE user_id = $1
        `,
        [user_id]
      ),

      // 4) Games played — from quiz attempts
      client.query(
        `
        SELECT COUNT(*)
        FROM quiz_attempts
        WHERE user_id = $1
        `,
        [user_id]
      ),

      // 5) Friends — accepted only
      client.query(
        `
        SELECT COUNT(*)
        FROM friendships
        WHERE (user_id = $1 OR friend_id = $1)
          AND relationship_status = 'accepted'
        `,
        [user_id]
      ),

      // 6) Social posts authored by the user
      client.query(
        `
        SELECT COUNT(*) 
        FROM social_posts
        WHERE user_id = $1
        `,
        [user_id]
      )
    ]);

    client.release();

    return {
      communities: parseInt(communities.rows[0].count, 10),
      challenges: parseInt(challenges.rows[0].count, 10),
      leaderboard: leaderboardRank.rows[0]?.ranking ?? null,
      gamesPlayed: parseInt(gamesPlayed.rows[0].count, 10),
      friends: parseInt(friends.rows[0].count, 10),
      socialPosts: parseInt(socialPosts.rows[0].count, 10)
    };
  } catch (err) {
    logger.error(`[CommunityService] Failed to fetch stats for user ${user_id}:`, err);
    throw err;
  }
}


async function getContributionScoresByCommunity(communityId: number) {
  try {
  const query = `
    SELECT
      cp.user_id,
      u.username AS name,
      SUM(cp.progress_amount) AS total_user_progress,
      SUM(c.target_amount) AS total_target
    FROM challenge_progress cp
    JOIN challenges c ON cp.challenge_id = c.challenge_id
    JOIN users u ON cp.user_id = u.user_id
    WHERE c.community_id = $1
      AND cp.participation_status = 'joined'
      AND c.challenge_status = 'active'
    GROUP BY cp.user_id, u.username
    ORDER BY total_user_progress DESC
  `;

  const { rows } = await pool.query(query, [communityId]);

  return rows.map(row => ({
    userId: row.user_id,
    name: row.name,
    score: Math.min(100, Number(((row.total_user_progress / row.total_target) * 100).toFixed(2))),
  }));
  } catch (err) {
    logger.error(`[CommunityService] Failed to fetch contribution scores for community ${communityId}:`, err);
    throw new Error("Could not fetch contribution scores.");
  }
}



// Get community performance summary for a user
export async function getCommunityPerformanceSummary(user_id: number) {
  try {
    await pool.query(`
      INSERT INTO user_points (user_id, total_points)
      VALUES ($1, 0)
      ON CONFLICT (user_id) DO NOTHING
    `, [ user_id ]);

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

    const { rows } = await pool.query(query, [ user_id ]);
    const d = rows[ 0 ];
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
      [ community_id ]
    );

    if (result.rowCount === 0) {
      throw new Error(`Community ID ${community_id} not found.`);
    }

    logger.info(`[CommunityService] Deleted community ID ${community_id}`);
    return result.rows[ 0 ];
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
    return result.rows;
  } catch (err) {
    logger.error('[CommunityService] Failed to fetch banners:', err);
    throw err;
  }
}

export async function getUserID(username: string) {
  const query = `
    SELECT user_id FROM users WHERE username ILIKE $1
  `;

  try {
    const result = await pool.query(query, [ `%${username}%` ]);
    if (result.rowCount === 0) {
      throw new Error(`No user found with username "${username}"`);
    }
    return result.rows[ 0 ].user_id;
  } catch (err) {
    logger.error(`[CommunityService] Failed to fetch user ID for username "${username}":`, err);
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
    const result = await pool.query(query, [ user_id ]);
    logger.info(`[CommunityService] Fetched friends with avatars and tier for user ID ${user_id}`);
    return result.rows;
  } catch (err) {
    logger.error(`[CommunityService] Failed to fetch friends for user ${user_id}:`, err);
    throw err;
  }
}

export async function fetchAllUsers() {
  const query = `
    SELECT 
      u.user_id,  
      u.username,
      ai.avatar_image_path,
      up.tier_status
    FROM users u
    JOIN user_preferences pref ON pref.user_id = u.user_id  
    JOIN avatar_images ai ON pref.avatar_id = ai.avatar_id
    LEFT JOIN user_points up ON u.user_id = up.user_id
    ORDER BY u.username;
  `;

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    logger.error('[CommunityService] Failed to fetch all users:', err);
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

    const { rows } = await pool.query(query, [ user_id, limit ]);
    logger.info(`[CommunityService] Fetched ${rows.length} friend recommendations for user ${user_id}`);
    return rows;
  } catch (err) {
    logger.error(`[CommunityService] Failed to get recommendations for user ${user_id}:`, err);
    throw err;
  }
}

export async function sendFriendRequest(sender_id: number, receiver_id: number) {
  // check if sender and receiver are not the same
  if (sender_id === receiver_id) {
    throw new Error("You cannot send a friend request to yourself silly.");
  }

  // check if a friendship already exists
  const existingQuery = `
    SELECT * FROM friendships
    WHERE (user_id = $1 AND friend_id = $2)
       OR (user_id = $2 AND friend_id = $1);
  `;
  
  const existingResult = await pool.query(existingQuery, [ sender_id, receiver_id ]);

  if ((existingResult?.rowCount ?? 0) > 0) {
    const existingFriendship = existingResult.rows[ 0 ];
    
    if (existingFriendship.relationship_status === 'accepted') {
      throw new Error("You are already friends with this user.");
    } else if (existingFriendship.relationship_status === 'pending') {
      throw new Error("A friend request is already pending.");
    } else if (existingFriendship.relationship_status === 'declined') {
      throw new Error("You cannot send a new request after it was declined.");
    }
  }

  const query = `
    INSERT INTO friendships (user_id, friend_id, relationship_status)
    VALUES ($1, $2, 'pending')
    ON CONFLICT (user_id, friend_id) DO UPDATE
    SET relationship_status = 'pending',
        created_at = CURRENT_TIMESTAMP
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, [ sender_id, receiver_id ]);
    logger.info(`[CommunityService] Friend request recorded between ${sender_id} and ${receiver_id}`);
    return result.rows[ 0 ];
  } catch (err) {
    logger.error(`[CommunityService] Failed to send friend request:`, err);
    throw err;
  }
}


export async function deleteFriend(user_id: number, friend_id: number) {
  const query = `
    DELETE FROM friendships
    WHERE user_id = $1 AND friend_id = $2
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, [user_id, friend_id]);
    if (result.rowCount === 0) {
      throw new Error(`No friendship found between ${user_id} and ${friend_id}`);
    }
    logger.info(`[CommunityService] Friendship deleted between ${user_id} and ${friend_id}`);
    return result.rows[0];
  } catch (err) {
    logger.error(`[CommunityService] Failed to delete friend between ${user_id} and ${friend_id}:`, err);
    throw err;
  }
}

export async function getFriendshipStatus(user_id: number, friend_id: number) {
  const query = `
    SELECT user_id, friend_id, relationship_status AS status
    FROM friendships
    WHERE user_id = $1
    AND friend_id = $2
  `;

  try {
    const result = await pool.query(query,[ user_id, friend_id]);
    logger.info(`[CommunityService] Fetched friend request `);
    return result.rows[0];
  } catch (error) {
    logger.error(`[CommunityService] Failed to get friend requests`, error);
    throw error;
  }
}

export async function respondToFriendRequests(userId: number, receiver_id: number, response: string) {

  const query = `
    UPDATE friendships
    SET relationship_status = $1
    WHERE user_id = $2
    AND  friend_id = $3
      RETURNING *;
  `;

  try {
    const res = await pool.query(query, [response, userId, receiver_id]);
    if (res.rowCount === 0) throw new Error('No such friendship');
    return res.rows[0];
  } catch (err) {
    logger.error(`[CommunityService] Friend requests for userID ${userId} updated with ${response} failed`);
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
    return result.rows[ 0 ]; // includes xp_reward as virtual field
  } catch (err) {
    logger.error('[CommunityService] Failed to create challenge:', err);
    throw err;
  }
}

export async function deleteChallengeById(challenge_id: number) {
  const query = `
    DELETE FROM challenges
    WHERE challenge_id = $1
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, [ challenge_id ]);
    if (result.rowCount === 0) {
      throw new Error(`Challenge ID ${challenge_id} not found.`);
    }
    logger.info(`[CommunityService] Deleted challenge ID ${challenge_id}`);
    return result.rows[ 0 ];
  } catch (err) {
    logger.error(`[CommunityService] Failed to delete challenge ID ${challenge_id}:`, err);
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
    const result = await pool.query(query, [ userId ]);
    return result.rows;
  } catch (err) {
    logger.error('[CommunityService] Failed to fetch categories:', err);
    throw err;
  }
}


// Post Feature Services

export async function createSocialPost({
  userId,
  achievementId,
  caption = '',
  communityTagIds = [],
}: {
  userId: number;
  achievementId: number;
  caption?: string;
  communityTagIds?: number[]; // Optional, max 3
}) {
  if (communityTagIds.length > 3) {
    throw new Error('You can tag a maximum of 3 communities.');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Validate all provided communities belong to the user
    if (communityTagIds.length > 0) {
      const { rows: validCommunities } = await client.query(
        `
        SELECT community_id
        FROM community_members
        WHERE user_id = $1
          AND community_id = ANY($2)
        `,
        [userId, communityTagIds]
      );

      const validIds = validCommunities.map(row => row.community_id);

      const invalidIds = communityTagIds.filter(id => !validIds.includes(id));
      if (invalidIds.length > 0) {
        throw new Error(`You are not a member of community ID(s): ${invalidIds.join(', ')}`);
      }
    }

    // 2. Insert post
    const { rows } = await client.query(
      `INSERT INTO social_posts (user_id, achievement_id, caption)
       VALUES ($1, $2, $3)
       RETURNING post_id`,
      [userId, achievementId, caption]
    );
    const postId = rows[0].post_id;

    // 3. Insert valid community tags
    for (const communityId of communityTagIds) {
      await client.query(
        `INSERT INTO post_community_tags (post_id, community_id)
         VALUES ($1, $2)`,
        [postId, communityId]
      );
    }

    await client.query('COMMIT');
    return { postId, message: 'Post created successfully' };
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating post with community validation:', err);
    throw err;
  } finally {
    client.release();
  }
}

export async function getCompletedUmbrellaAchievements(userId: number) {
  const { rows } = await pool.query(
    `
    SELECT 
      a.achievement_id,
      a.achievement_title,
      a.banner_image_path
    FROM achievements a
    WHERE a.is_umbrella = TRUE
      AND NOT EXISTS (
        SELECT 1
        FROM achievements sub
        LEFT JOIN user_achievements ua 
          ON ua.achievement_id = sub.achievement_id AND ua.user_id = $1
        WHERE sub.parent_id = a.achievement_id
          AND (ua.achievement_status IS NULL OR ua.achievement_status != 'complete')
      )
    ORDER BY a.display_order
    `,
    [userId]
  );

  return rows;
}

export async function getUserCommunities(userId: number) {
  const { rows } = await pool.query(
    `
    SELECT 
      c.community_id,
      c.community_name
    FROM communities c
    JOIN community_members cm ON cm.community_id = c.community_id
    WHERE cm.user_id = $1
    ORDER BY c.community_name
    `,
    [userId]
  );
  return rows;
}

export async function getFriendFeed(userId: number) {
  const { rows } = await pool.query(
    `
    SELECT 
      sp.post_id,
      sp.caption,
      sp.created_at,

      -- User info
      u.user_id,
      u.username,
      up.avatar_id,
      pts.tier_status,

      -- Achievement
      a.achievement_title,
      a.banner_image_path,

      -- Community tags
      COALESCE(
        JSON_AGG(DISTINCT c.community_name)
        FILTER (WHERE c.community_id IS NOT NULL),
        '[]'
      ) AS community_tags,

      -- Comments (as array of JSON objects)
      COALESCE(
        JSON_AGG(
          DISTINCT JSONB_BUILD_OBJECT(
            'comment_id', pc.comment_id,
            'user_id', cu.user_id,
            'username', cu.username,
            'avatar_id', cp.avatar_id,
            'comment', pc.comment,
            'created_at', pc.created_at
          )
        ) FILTER (WHERE pc.comment_id IS NOT NULL),
        '[]'
      ) AS comments,

      COUNT(DISTINCT pl.user_id) AS like_count

    FROM social_posts sp

    JOIN users u ON u.user_id = sp.user_id
    LEFT JOIN user_preferences up ON up.user_id = u.user_id
    LEFT JOIN user_points pts ON pts.user_id = u.user_id
    JOIN achievements a ON a.achievement_id = sp.achievement_id

    LEFT JOIN post_likes pl ON pl.post_id = sp.post_id

    LEFT JOIN post_community_tags pct ON pct.post_id = sp.post_id
    LEFT JOIN communities c ON c.community_id = pct.community_id

    -- Comments + comment users
    LEFT JOIN post_comments pc ON pc.post_id = sp.post_id
    LEFT JOIN users cu ON cu.user_id = pc.user_id
    LEFT JOIN user_preferences cp ON cp.user_id = cu.user_id

    WHERE sp.user_id = $1
      OR sp.user_id IN (
        SELECT friend_id FROM friendships WHERE user_id = $1 AND relationship_status = 'accepted'
        UNION
        SELECT user_id FROM friendships WHERE friend_id = $1 AND relationship_status = 'accepted'
      )

    GROUP BY 
      sp.post_id, u.user_id, up.avatar_id, pts.tier_status, a.achievement_id
    ORDER BY sp.created_at DESC
    LIMIT 50
    `,
    [userId]
  );

  return rows;
}

export async function likePost(userId: number, postId: number) {
  // Check if post exists
  const { rowCount } = await pool.query(
    `SELECT 1 FROM social_posts WHERE post_id = $1`,
    [postId]
  );
  if (rowCount === 0) {
    throw new Error('Post not found');
  }

  // Insert like
  await pool.query(
    `INSERT INTO post_likes (user_id, post_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    [userId, postId]
  );

  // Return updated like count
  const { rows } = await pool.query(
    `SELECT COUNT(*)::INT AS like_count FROM post_likes WHERE post_id = $1`,
    [postId]
  );

  return rows[0];
}

export async function unlikePost(userId: number, postId: number) {
  await pool.query(
    `DELETE FROM post_likes
     WHERE user_id = $1 AND post_id = $2`,
    [userId, postId]
  );

  const { rows } = await pool.query(
    `SELECT COUNT(*) AS like_count
     FROM post_likes
     WHERE post_id = $1`,
    [postId]
  );

  return { like_count: Number(rows[0]?.like_count || 0) };
}

export async function addPostComment(userId: number, postId: number, comment: string) {
  const trimmedComment = comment.trim();

  if (!trimmedComment) {
    throw new Error('Comment cannot be empty');
  }

  // Check if post exists
  const { rowCount } = await pool.query(
    `SELECT 1 FROM social_posts WHERE post_id = $1`,
    [postId]
  );
  if (rowCount === 0) {
    throw new Error('Post not found');
  }

  // Insert comment and return minimal response
  const { rows } = await pool.query(
    `INSERT INTO post_comments (user_id, post_id, comment)
     VALUES ($1, $2, $3)
     RETURNING comment_id, comment, created_at`,
    [userId, postId, trimmedComment]
  );

  return rows[0];
}

export async function getPostComments(postId: number) {
  const { rows } = await pool.query(
    `SELECT 
        pc.comment_id,
        pc.comment,
        pc.created_at,
        u.username,
        up.avatar_id
     FROM post_comments pc
     JOIN users u ON pc.user_id = u.user_id
     LEFT JOIN user_preferences up ON up.user_id = u.user_id
     WHERE pc.post_id = $1
     ORDER BY pc.created_at ASC`,
    [postId]
  );

  return rows;
}

export async function deleteSocialPost(userId: number, postId: number) {
  // Verify post exists & ownership
  const { rows: postRows } = await pool.query(
    `SELECT user_id FROM social_posts WHERE post_id = $1`,
    [postId]
  );
  if (postRows.length === 0) {
    throw new Error('Post not found');
  }
  if (postRows[0].user_id !== userId) {
    throw new Error('You are not authorized to delete this post');
  }

  // Delete post
  const { rowCount } = await pool.query(
    `DELETE FROM social_posts WHERE post_id = $1 AND user_id = $2`,
    [postId, userId]
  );

  if (rowCount === 0) {
    // Extremely unlikely if the above check passed, but guards against races
    throw new Error('Failed to delete post');
  }

  return { post_id: postId, message: 'Post deleted successfully' };
}

export async function deletePostComment(
  userId: number,
  postId: number,
  commentId: number
) {
  // Pull comment + owning post user
  const { rows: commentRows } = await pool.query(
    `
    SELECT 
      pc.comment_id,
      pc.user_id      AS comment_user_id,
      pc.post_id,
      sp.user_id      AS post_user_id
    FROM post_comments pc
    JOIN social_posts sp ON sp.post_id = pc.post_id
    WHERE pc.comment_id = $1
    `,
    [commentId]
  );

  if (commentRows.length === 0) {
    throw new Error('Comment not found');
  }

  const c = commentRows[0];

  // Ensure this comment is on the expected post
  if (Number(c.post_id) !== Number(postId)) {
    throw new Error('Comment does not belong to the specified post');
  }

  // Authorization: comment author OR post owner can delete
  const isCommentOwner = Number(c.comment_user_id) === Number(userId);
  const isPostOwner = Number(c.post_user_id) === Number(userId);

  if (!isCommentOwner && !isPostOwner) {
    throw new Error('You are not authorized to delete this comment');
  }

  // Delete the comment
  const { rowCount } = await pool.query(
    `DELETE FROM post_comments WHERE comment_id = $1`,
    [commentId]
  );

  if (rowCount === 0) {
    throw new Error('Failed to delete comment');
  }

  // Return remaining comment count (handy for optimistic UI updates)
  const { rows: countRows } = await pool.query(
    `SELECT COUNT(*)::INT AS remaining FROM post_comments WHERE post_id = $1`,
    [postId]
  );

  return {
    comment_id: commentId,
    post_id: postId,
    remaining_comments: countRows[0]?.remaining ?? 0,
    message: 'Comment deleted successfully',
  };
}
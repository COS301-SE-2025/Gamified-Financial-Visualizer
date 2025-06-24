// auth.service.ts
// Handles database operations for user accounts, authentication, preferences, and push subscriptions.
import dotenv from 'dotenv';
dotenv.config();
import pool from "../../../config/db";
import { logger } from '../../../config/logger';


export interface UserRecord {
  email: string;
  username: string;
  full_name: string;
  hashed_password: string;
}

export async function createUser(user: UserRecord) {
  const query = `
    INSERT INTO users (email, username, full_name, hashed_password)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  try {
    const result = await pool.query(query, [
      user.email,
      user.username,
      user.full_name,
      user.hashed_password,
    ]);
    logger.info(`[AuthService] User registered: ${user.username}`);
    return result.rows[0];
  } catch (err) {
    logger.error('[AuthService] Registration failed:', err);
    throw err;
  }
}

/* one live token per user; UX-friendly for SPAs */
export async function upsertToken(user_id: number, token: string, expires_at: Date) {

  await pool.query('DELETE FROM user_tokens WHERE user_id = $1', [user_id]);
  await pool.query(
    'INSERT INTO user_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
    [user_id, token, expires_at]
  );
  logger.info(`[AuthService] Token updated for user ${user_id}`);

}


export async function authenticateUser(username: string, hashedPassword: string) {
  const query = 'SELECT * FROM users WHERE username = $1 AND hashed_password = $2';
  try {
    const result = await pool.query(query, [username, hashedPassword]);
    return result.rows[0];
  } catch (err) {
    logger.error(`[AuthService] Authentication failed for user ${username}:`, err);
    throw err;
  }
}

 export async function storeUserTokens(user_id: number, accessToken: string, expires_at: Date) {
  const query = `
    INSERT INTO user_tokens (user_id, token, expires_at)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id) DO UPDATE SET
      access_token = EXCLUDED.access_token,
      refresh_token = ,
      updated_at = CURRENT_TIMESTAMP;
  `;
  try {
    await pool.query(query, [user_id, accessToken, expires_at]);
    logger.info(`[AuthService] Tokens stored for user ID ${user_id}`);
  } catch (err) {
    logger.error(`[AuthService] Failed to store tokens for user ID ${user_id}:`, err);
    throw err;
  }
}

export async function getUserById(user_id: number) {
  const query = 'SELECT * FROM users WHERE user_id = $1';
  try {
    const result = await pool.query(query, [user_id]);
    return result.rows[0];
  } catch (err) {
    logger.error(`[AuthService] Failed to fetch user profile for ID ${user_id}:`, err);
    throw err;
  }
}

export async function getUserID(username: string) {
  const query = 'SELECT user_id FROM users WHERE username = $1';
  try {
    const result = await pool.query(query, [username]);
    if (result.rows.length === 0) {
      throw new Error(`User with username '${username}' not found`);
    }
    return result.rows[0].user_id;
  } catch (err) {
    logger.error(`[AuthService] Failed to fetch user ID for username ${username}:`, err);
    throw err;
  }
}

export async function getUserByEmail(email: string) {
  const query = 'SELECT * FROM users WHERE email = $1';
  try {
    const result = await pool.query(query, [email]);
    return result.rows[0];
  } catch (err) {
    logger.error(`[AuthService] Failed to fetch user by email ${email}:`, err);
    throw err;
  }
}

export async function getUserByUsername(username: string) {
  const query = 'SELECT * FROM users WHERE username = $1';
  try {
    const result = await pool.query(query, [username]);
    return result.rows[0];
  } catch (err) {
    logger.error(`[AuthService] Failed to fetch user by username ${username}:`, err);
    throw err;
  }
}
export async function updateUserProfile(user_id: number, updates: Partial<UserRecord>) {
  const query = `
    UPDATE users
    SET
    email = COALESCE($1, email),
    username = COALESCE($2, username),
    full_name = COALESCE($3, full_name),
    updated_at = CURRENT_TIMESTAMP
    WHERE user_id = $4
    RETURNING *;
  `;
  try {
    const result = await pool.query(query, [
      updates.email,
      updates.username,
      updates.full_name,
      user_id
    ]);
    return result.rows[0];
  } catch (err) {
    logger.error(`[AuthService] Failed to update profile for user ID ${user_id}:`, err);
    throw err;
  }
}

export async function deleteUser(user_id: number) {
  const query = 'DELETE FROM users WHERE user_id = $1';
  try {
    await pool.query(query, [user_id]);
    logger.info(`[AuthService] Deleted user ID: ${user_id}`);
  } catch (err) {
    logger.error(`[AuthService] Failed to delete user ID ${user_id}:`, err);
    throw err;
  }
}

export async function updatePassword(user_id: number, newHashedPassword: string) {
  const query = 'UPDATE users SET hashed_password = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2';
  try {
    await pool.query(query, [newHashedPassword, user_id]);
    logger.info(`[AuthService] Password updated for user ID ${user_id}`);
  } catch (err) {
    logger.error(`[AuthService] Failed to update password for user ID ${user_id}:`, err);
    throw err;
  }
}

export async function updateUserPreferences(
  user_id: number,
  theme: string,
  notificationsEnabled: boolean,
  avatar_id: number
) {
  // Validate theme value against schema constraint
  const allowedThemes = ['light', 'dark'];
  if (!allowedThemes.includes(theme)) {
    throw new Error(`Invalid theme: '${theme}'. Must be 'light' or 'dark'.`);
  }

  // Optional: Validate avatar_id is a valid integer
  if (!Number.isInteger(avatar_id) || avatar_id <= 0) {
    throw new Error(`Invalid avatar_id: must be a positive integer.`);
  }

  const query = `
    INSERT INTO user_preferences (user_id, theme, in_app_notifications_enabled, avatar_id)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id) DO UPDATE SET
      theme = EXCLUDED.theme,
      in_app_notifications_enabled = EXCLUDED.in_app_notifications_enabled,
      avatar_id = EXCLUDED.avatar_id,
      updated_at = CURRENT_TIMESTAMP;
  `;
  try {
    await pool.query(query, [user_id, theme, notificationsEnabled, avatar_id]);
    logger.info(`[AuthService] Preferences updated for user ID ${user_id}`);
  } catch (err) {
    logger.error(`[AuthService] Failed to update preferences for user ID ${user_id}:`, err);
    throw err;
  }
}

export async function getUserPreferences(user_id: number) {
  const query = 'SELECT * FROM user_preferences WHERE user_id = $1';
  try {
    const result = await pool.query(query, [user_id]);
    return result.rows[0];
  } catch (err) {
    logger.error(`[AuthService] Failed to fetch preferences for user ID ${user_id}:`, err);
    throw err;
  }
}

export async function addPushSubscription(user_id: number, endpoint: string, p256dh: string, auth: string) {
  const query = `
    INSERT INTO user_push_subscriptions (user_id, endpoint, p256dh, auth)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  try {
    const result = await pool.query(query, [user_id, endpoint, p256dh, auth]);
    return result.rows[0];
  } catch (err) {
    logger.error(`[AuthService] Failed to add push subscription for user ID ${user_id}:`, err);
    throw err;
  }
}

export async function getPushSubscriptions(user_id: number) {
  const query = 'SELECT * FROM user_push_subscriptions WHERE user_id = $1 AND enabled = TRUE';
  try {
    const result = await pool.query(query, [user_id]);
    return result.rows;
  } catch (err) {
    logger.error(`[AuthService] Failed to fetch push subscriptions for user ID ${user_id}:`, err);
    throw err;
  }
}

export async function deletePushSubscription(push_id: number) {
  const query = 'DELETE FROM user_push_subscriptions WHERE push_id = $1';
  try {
    await pool.query(query, [push_id]);
    logger.info(`[AuthService] Deleted push subscription ID: ${push_id}`);
  } catch (err) {
    logger.error(`[AuthService] Failed to delete push subscription ID ${push_id}:`, err);
    throw err;
  }
}

export async function setTwoFactorEnabled(user_id: number, enabled: boolean) {
  const query = 'UPDATE users SET two_factor_enabled = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2';
  try {
    await pool.query(query, [enabled, user_id]);
    logger.info(`[AuthService] Updated 2FA setting for user ID ${user_id} to ${enabled}`);
  } catch (err) {
    logger.error(`[AuthService] Failed to update 2FA setting for user ID ${user_id}:`, err);
    throw err;
  }
}

export async function setPasswordResetToken(user_id: number, token: string, expires_at: Date) {
  const query = `
    INSERT INTO user_tokens (user_id, token, expires_at)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id) DO UPDATE SET
      token = EXCLUDED.token,
      expires_at = EXCLUDED.expires_at,
      created_at = CURRENT_TIMESTAMP;
  `;
  try {
    await pool.query(query, [user_id, token, expires_at]);
    logger.info(`[AuthService] Password reset token set for user ID ${user_id}`);
  } catch (err) {
    logger.error(`[AuthService] Failed to set reset token for user ID ${user_id}:`, err);
    throw err;
  }
}

export async function resetPassword(token: string, newHashedPassword: string) {
  const tokenQuery = 'SELECT user_id FROM user_tokens WHERE token = $1 AND expires_at > CURRENT_TIMESTAMP';
  try {
    const tokenResult = await pool.query(tokenQuery, [token]);
    if (tokenResult.rows.length === 0) {
      throw new Error('Invalid or expired token');
    }
    const user_id = tokenResult.rows[0].user_id;
    await updatePassword(user_id, newHashedPassword);
    await pool.query('DELETE FROM user_tokens WHERE user_id = $1', [user_id]);
    logger.info(`[AuthService] Password reset successfully for user ID ${user_id}`);
  } catch (err) {
    logger.error('[AuthService] Password reset failed:', err);
    throw err;
  }
}

export async function changePassword(user_id: number, oldHashedPassword: string, newHashedPassword: string) {
  const user = await getUserById(user_id);
  if (!user || user.hashed_password !== oldHashedPassword) {
    throw new Error('Incorrect old password');
  }
  return updatePassword(user_id, newHashedPassword);
}

export async function updateUserSettings(user_id: number, updates: {
  username?: string;
  full_name?: string;
  theme?: 'light' | 'dark';
  avatar_id?: number;  // updated from string to number
  inAppNotifications?: boolean;
  outOfAppEnabled?: boolean;
  twoFactorEnabled?: boolean;
}) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    if (updates.username || updates.full_name) {
      await client.query(`
        UPDATE users SET
          username = COALESCE($1, username),
          full_name = COALESCE($2, full_name),
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $3
      `, [updates.username, updates.full_name, user_id]);
    }

    if (
      updates.theme || typeof updates.avatar_id !== 'undefined' ||
      typeof updates.inAppNotifications !== 'undefined'
    ) {
      // Optional validation: ensure avatar_id is valid if provided
      if (typeof updates.avatar_id !== 'undefined') {
        if (!Number.isInteger(updates.avatar_id) || updates.avatar_id <= 0) {
          throw new Error(`Invalid avatar_id: must be a positive integer.`);
        }
      }

      await client.query(`
        INSERT INTO user_preferences (user_id, theme, avatar_id, in_app_notifications_enabled)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id) DO UPDATE SET
          theme = COALESCE(EXCLUDED.theme, user_preferences.theme),
          avatar_id = COALESCE(EXCLUDED.avatar_id, user_preferences.avatar_id),
          in_app_notifications_enabled = COALESCE(EXCLUDED.in_app_notifications_enabled, user_preferences.in_app_notifications_enabled),
          updated_at = CURRENT_TIMESTAMP;
      `, [
        user_id,
        updates.theme,
        updates.avatar_id,
        updates.inAppNotifications,
      ]);
    }

    if (typeof updates.outOfAppEnabled !== 'undefined') {
      await client.query(`
        UPDATE user_push_subscriptions
        SET enabled = $1
        WHERE user_id = $2
      `, [updates.outOfAppEnabled, user_id]);
    }

    if (typeof updates.twoFactorEnabled !== 'undefined') {
      await setTwoFactorEnabled(user_id, updates.twoFactorEnabled);
    }

    await client.query('COMMIT');
    logger.info(`[AuthService] Updated profile & preferences for user ID ${user_id}`);
  } catch (err) {
    await client.query('ROLLBACK');
    logger.error(`[AuthService] Failed to update settings for user ID ${user_id}:`, err);
    throw err;
  } finally {
    client.release();
  }
}



// =============== Profile Page Specific Functions ============== //

export async function getProfileTopBar(user_id: number) {
  const query = `
    SELECT 
      u.username,
      u.created_at,
      a.avatar_image_path,
      b.banner_image_path
    FROM users u
    JOIN user_preferences up ON u.user_id = up.user_id
    JOIN avatar_images a ON up.avatar_id = a.avatar_id
    JOIN banner_images b ON up.banner_id = b.banner_id
    WHERE u.user_id = $1
  `;
  try {
    const result = await pool.query(query, [user_id]);
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    return result.rows[0]; // Contains: username, created_at, avatar_image_path, banner_image_path
  } catch (err) {
    logger.error(`[AuthService] Failed to load profile top bar for user ID ${user_id}:`, err);
    throw err;
  }
}

export async function getUserSidebarStats(user_id: number) {
  const query = `
    SELECT
      -- Total active or completed goals
      (SELECT COUNT(*) FROM goals WHERE user_id = $1 AND goal_status IN ('in-progress', 'completed')) AS total_goals,

      -- Achievement percentage
      (
        SELECT
          ROUND(COUNT(*) FILTER (WHERE achievement_status = 'complete') * 100.0 / NULLIF(COUNT(*), 0), 0)
        FROM user_achievements
        WHERE user_id = $1
      ) AS achievement_percentage,

      -- Total accounts
      (SELECT COUNT(*) FROM accounts WHERE user_id = $1) AS total_accounts,

      -- Recent transactions (last 30 days)
      (
        SELECT COUNT(*) FROM transactions
        WHERE account_id IN (SELECT account_id FROM accounts WHERE user_id = $1)
        AND transaction_date >= NOW() - INTERVAL '7 days'
      ) AS recent_transactions,

      -- Total joined communities
      (
        SELECT COUNT(*) FROM community_members
        WHERE user_id = $1 AND membership_status = 'accepted'
      ) AS total_communities,

      -- Total lessons completed
      (
        SELECT 
          ROUND(
            COUNT(*) * 100.0 / NULLIF(
              (SELECT COUNT(*) FROM lessons), 0
            ), 0
          )
        FROM user_lessons WHERE user_id = $1
      ) AS lessons_completed_percentage
  `;

  try {
    const result = await pool.query(query, [user_id]);
    return result.rows[0];
  } catch (err) {
    logger.error(`[AuthService] Failed to fetch sidebar stats for user ID ${user_id}:`, err);
    throw err;
  }
}

export async function getCurrentUserGoals(user_id: number) {
  const query = `
    SELECT 
      g.goal_id,
      g.goal_name,
      g.goal_type,
      g.current_amount,
      g.target_amount,
      ROUND((g.current_amount / g.target_amount) * 100) AS progress_percentage,
      calculate_goal_xp(g.goal_type, g.target_amount, g.current_amount) AS xp_reward
    FROM goals g
    WHERE g.user_id = $1 AND g.goal_status = 'in-progress'
    ORDER BY g.target_date ASC
    LIMIT 4;
  `;

  const result = await pool.query(query, [user_id]);
  return result.rows;
}

export async function getUserPerformanceStats(user_id: number) {
  const query = `
    SELECT
      -- Accuracy: % of passed quizzes
      COALESCE((
        SELECT ROUND(COUNT(*) FILTER (WHERE passed) * 100.0 / NULLIF(COUNT(*), 0), 0)
        FROM quiz_attempts
        WHERE user_id = $1
      ), 0) AS accuracy,

      -- Leaderboard Rank (lower rank is better)
      COALESCE((
        SELECT ranking FROM leaderboard_entries
        WHERE user_id = $1
        ORDER BY created_at DESC LIMIT 1
      ), 0) AS leaderboard_rank,

      -- Total joined challenges
      COALESCE((
        SELECT COUNT(*) FROM challenge_progress
        WHERE user_id = $1 AND participation_status = 'joined'
      ), 0) AS challenges_joined,

      -- Goals completed / total
      COALESCE((
        SELECT COUNT(*) FROM goals WHERE user_id = $1 AND goal_status = 'completed'
      ), 0) AS goals_completed,

      COALESCE((
        SELECT COUNT(*) FROM goals WHERE user_id = $1
      ), 0) AS goals_total
  `;

  try {
    const result = await pool.query(query, [user_id]);
    return result.rows[0];
  } catch (err) {
    logger.error(`[AuthService] Failed to fetch performance stats for user ID ${user_id}:`, err);
    throw err;
  }
}

export async function getRecentAchievements(user_id: number) {
  const query = `
    SELECT 
      a.achievement_id,
      a.achievement_title,
      a.points_awarded AS xp_reward,
      b.image_path AS icon_image_path,
      ua.awarded_at
    FROM user_achievements ua
    JOIN achievements a ON ua.achievement_id = a.achievement_id
    JOIN badges b ON a.badge_id = b.badge_id
    WHERE ua.user_id = $1 AND ua.achievement_status = 'complete'
    ORDER BY ua.awarded_at DESC
    LIMIT 3;
  `;

  const result = await pool.query(query, [user_id]);
  return result.rows;
}

export async function getUserCommunities(user_id: number) {
  const query = `
    SELECT
      c.community_id,
      c.community_name,
      b.banner_image_path AS banner,
      
      -- Total XP from challenge_progress for that community
      COALESCE((
        SELECT SUM(cp.progress_amount)
        FROM challenges ch
        JOIN challenge_progress cp ON ch.challenge_id = cp.challenge_id
        WHERE ch.community_id = c.community_id
          AND cp.participation_status = 'joined'
      ), 0) AS xp_total,

      -- Total accepted members
      (
        SELECT COUNT(*) FROM community_members cm
        WHERE cm.community_id = c.community_id
          AND cm.membership_status = 'accepted'
      ) AS member_count,

      -- Total goals (linked by user_id to community members)
      (
        SELECT COUNT(*) FROM goals g
        WHERE g.user_id IN (
          SELECT cm.user_id FROM community_members cm
          WHERE cm.community_id = c.community_id AND cm.membership_status = 'accepted'
        )
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
    WHERE m.user_id = $1
      AND m.membership_status = 'accepted'
    ORDER BY c.created_at DESC;
  `;

  try {
    const result = await pool.query(query, [user_id]);
    return result.rows;
  } catch (err) {
    logger.error(`[AuthService] Failed to fetch communities for user ID ${user_id}:`, err);
    throw err;
  }
}

export async function getUserPerformanceSummary(user_id: number) {
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

        COALESCE((
          SELECT ROUND(COUNT(*) FILTER (WHERE passed) * 100.0 / NULLIF(COUNT(*), 0), 0)
          FROM quiz_attempts
          WHERE user_id = $1
        ), 0) AS accuracy,

        COALESCE((
          SELECT 100 - ROUND(ranking * 100.0 / NULLIF(total_rows, 1))
          FROM (
            SELECT ranking, COUNT(*) OVER() AS total_rows
            FROM leaderboard_entries
            WHERE user_id = $1
            ORDER BY created_at DESC LIMIT 1
          ) t
        ), 0) AS leaderboard,

        COALESCE((SELECT COUNT(*) FROM challenge_progress WHERE user_id = $1 AND participation_status = 'joined'), 0) AS challenges,

        COALESCE((
          SELECT ROUND(COUNT(*) FILTER (WHERE goal_status = 'completed') * 100.0 / NULLIF(COUNT(*), 0), 0)
          FROM goals WHERE user_id = $1
        ), 0) AS goals,

        COALESCE((
          SELECT COUNT(*) FROM transactions t
          JOIN accounts a ON t.account_id = a.account_id
          WHERE a.user_id = $1
        ), 0) AS transactions,

        COALESCE((SELECT COUNT(*) FROM budgets WHERE user_id = $1), 0) AS budgets

      FROM user_points up
      JOIN user_preferences pref ON pref.user_id = up.user_id
      JOIN avatar_images ai ON pref.avatar_id = ai.avatar_id
      WHERE up.user_id = $1;
    `;

    const { rows } = await pool.query(query, [user_id]);
    const d = rows[0];

    if (!d) throw new Error("No data found for user.");

    const xp = d.total_points;

    const score = (
      (d.accuracy * 2) +
      (d.leaderboard * 1.5) +
      (Math.min(d.challenges, 50) * 3) +
      (d.goals * 2) +
      (Math.min(d.transactions, 100) * 1.5) +
      (Math.min(d.budgets, 50) * 3)
    );

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
    logger.error(`[AuthService] Failed to fetch performance summary for user ID ${user_id}:`, err.message || err);
    throw new Error("Could not fetch performance summary.");
  }
}

export async function getUserLevelProgress(user_id: number) {
  const query = `
    SELECT total_points, tier_status
    FROM user_points
    WHERE user_id = $1;
  `;

  const { rows } = await pool.query(query, [user_id]);
  if (rows.length === 0) {
    throw new Error("User not found in user_points");
  }

  const { total_points, tier_status } = rows[0];
  const xp = total_points ?? 0;

  const tierThresholds = {
    Wood: 0,
    Bronze: 1000,
    Silver: 3000,
    Gold: 6000,
    Platinum: 10000,
    Diamond: 15000,
  } as const;

  const nextThresholds = {
    Wood: 1000,
    Bronze: 3000,
    Silver: 6000,
    Gold: 10000,
    Platinum: 15000,
    Diamond: 50000, // Arbitrary high cap
  } as const;

  type Tier = keyof typeof tierThresholds;

  const tier = (tier_status ?? 'Wood') as Tier;

  const currentThreshold = tierThresholds[tier];
  const nextThreshold = nextThresholds[tier];
  const currentTierXP = xp - currentThreshold;
  const tierXPRequired = nextThreshold - currentThreshold;
  const levelNumber = Math.floor(xp / 2000) + 1;
  const nextLevel = levelNumber + 1;
  const pointsToNextTier = Math.max(0, nextThreshold - xp);

  return {
    level_number: levelNumber,
    tier_status: tier,
    next_level: nextLevel,
    current_tier_xp: currentTierXP,
    tier_xp_required: tierXPRequired,
    points_to_next_tier: pointsToNextTier,
  };
}

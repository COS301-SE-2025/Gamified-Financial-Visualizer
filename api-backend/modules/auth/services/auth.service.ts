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
    // Check if username already exists
    const usernameCheckQuery = 'SELECT * FROM users WHERE username = $1';
    const usernameCheckResult = await pool.query(usernameCheckQuery, [user.username]);
    if (usernameCheckResult.rows.length > 0) {
      logger.warn(`[AuthService] Registration failed: Username ${user.username} already exists`);
      throw new Error(`Username '${user.username}' is already taken.`);
    }

    // Check if email already exists
    const emailCheckQuery = 'SELECT * FROM users WHERE email = $1';
    const emailCheckResult = await pool.query(emailCheckQuery, [user.email]);
    if (emailCheckResult.rows.length > 0) {
      logger.warn(`[AuthService] Registration failed: Email ${user.email} already exists`);
      throw new Error(`Email '${user.email}' is already registered.`);
    }

    const result = await pool.query(query, [
      user.email,
      user.username,
      user.full_name,
      user.hashed_password,
    ]);
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

// auth.service.ts
// Handles database operations for user accounts, authentication, preferences, and push subscriptions.
import dotenv from 'dotenv';
dotenv.config();
import pool from "../config/db";
import { logger } from '../config/logger';


export interface UserRecord {
  email: string;
  username: string;
  full_name: string;
  hashed_password: string;
  password_salt: string;
}

export async function createUser(user: UserRecord) {
  const query = `
    INSERT INTO users (email, username, full_name, hashed_password, password_salt)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  try {
    const result = await pool.query(query, [
      user.email,
      user.username,
      user.full_name,
      user.hashed_password,
      user.password_salt
    ]);
    logger.info(`[AuthService] User registered: ${user.username}`);
    return result.rows[0];
  } catch (err) {
    logger.error('[AuthService] Registration failed:', err);
    throw err;
  }
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
  avatar_id: string
) {
  // Validate theme value against schema constraint
  const allowedThemes = ['light', 'dark'];
  if (!allowedThemes.includes(theme)) {
    throw new Error(`Invalid theme: '${theme}'. Must be 'light' or 'dark'.`);
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

export async function verifyUserEmail(user_id: number) {
  const query = 'UPDATE users SET email_verified = TRUE, updated_at = CURRENT_TIMESTAMP WHERE user_id = $1';
  try {
    await pool.query(query, [user_id]);
    logger.info(`[AuthService] Email verified for user ID ${user_id}`);
  } catch (err) {
    logger.error(`[AuthService] Failed to verify email for user ID ${user_id}:`, err);
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
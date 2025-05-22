// userService.ts
// Handles database operations for user accounts

import { Pool } from 'pg';
import { logger } from '../config/logger';

const pool = new Pool();

interface UserRecord {
   uid: string;
   email: string;
   username: string;
   name: string;
   surname: string;
   hash_password: string;
}

export async function register(userRecord: UserRecord) {
   const { uid, email, username, name, surname, hash_password} = userRecord;

   const query = `
    INSERT INTO users (id, email, username, name, surname, hash_password, salt)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (id) DO NOTHING;
  `;

   try {
      await pool.query(query, [ uid, email, username, name, surname, hash_password ]);
      logger.info(`[UserService] Created user profile: ${uid}`);
   } catch (error) {
      logger.error(`[UserService] Error creating user profile for ${uid}:`, error);
      throw error;
   }
}

export async function getUserProfile(uid: number) {
   const query = `
    SELECT * FROM users WHERE id = $1;
  `;

   try {
      const result = await pool.query(query, [ uid ]);
      return result.rows[0];
   } catch (error) {
      logger.error(`[UserService] Error fetching user profile for ${uid}:`, error);
      throw error;
   }
}

export async function login(username: string, password: string) {
   const query = `
    SELECT * FROM users WHERE username = $1 AND hash_password = $2;
  `;

   try {
      const result = await pool.query(query, [username, password ]);
      if (result.rows.length > 0) {
         return result.rows[0];
      }
   } catch (error) {
      logger.error(`[UserService] Error logging in user ${username}:`, error);
      throw error;
   }
}

export async function updateUserProfile(uid: string, updates: Partial<UserRecord>) {
   const query = `
    UPDATE users SET email = $1, username = $2, name = $3, surname = $4
    WHERE id = $5;
  `;

   try {
      await pool.query(query, [ updates.email, updates.username, updates.name, updates.surname, uid ]);
      logger.info(`[UserService] Updated user profile: ${uid}`);
   } catch (error) {
      logger.error(`[UserService] Error updating user profile for ${uid}:`, error);
      throw error;
   }
}

export async function deleteUserProfile(uid: string) {
   const query = `
    DELETE FROM users WHERE id = $1;
  `;

   try {
      await pool.query(query, [ uid ]);
      logger.info(`[UserService] Deleted user profile: ${uid}`);
   } catch (error) {
      logger.error(`[UserService] Error deleting user profile for ${uid}:`, error);
      throw error;
   }
}

export async function getUserByEmail(email: string) {
   const query = `
    SELECT * FROM users WHERE email = $1;
  `;

   try {
      const result = await pool.query(query, [ email ]);
      return result.rows[0];
   } catch (error) {
      logger.error(`[UserService] Error fetching user by email ${email}:`, error);
      throw error;
   }
}

export async function changePassword(uid: string, newPassword: string) {
   const query = `
    UPDATE users SET hash_password = $1 WHERE id = $2;
  `;

   try {
      await pool.query(query, [ newPassword, uid ]);
      logger.info(`[UserService] Changed password for user: ${uid}`);
   } catch (error) {
      logger.error(`[UserService] Error changing password for user ${uid}:`, error);
      throw error;
   }
}


// TODO: needs to be confirmed with frontend
/*
export async function twofaSetup(uid, secret) {
   const query = `
    UPDATE users SET two_factor_secret = $1 WHERE id = $2;
  `;

   try {
      await pool.query(query, [ secret, uid ]);
      logger.info(`[UserService] Set up 2FA for user: ${uid}`);
   } catch (error) {
      logger.error(`[UserService] Error setting up 2FA for user ${uid}:`, error);
      throw error;
   }
}
*/
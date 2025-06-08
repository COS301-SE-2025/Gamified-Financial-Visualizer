// social.service.ts
import pool from "../../../config/db";
import { logger } from "../../../config/logger";

// ✅ Get accepted friends
export async function getFriends(user_id: number, search?: string) {
  const query = `
    SELECT u.user_id, u.username, u.full_name
    FROM friendships f
    JOIN users u ON u.user_id = CASE
      WHEN f.user_id = $1 THEN f.friend_id
      ELSE f.user_id
    END
    WHERE (f.user_id = $1 OR f.friend_id = $1)
      AND f.relationship_status = 'accepted'
      ${search ? `AND u.username ILIKE '%' || $2 || '%'` : ''}
  `;
  const values = search ? [user_id, search] : [user_id];
  const result = await pool.query(query, values);
  return result.rows;
}

// ✅ Get a specific friendship record
export async function getFriendById(user_id: number, friend_id: number) {
  const query = `
    SELECT * FROM friendships
    WHERE ((user_id = $1 AND friend_id = $2)
        OR (user_id = $2 AND friend_id = $1))
  `;
  const result = await pool.query(query, [user_id, friend_id]);
  return result.rows[0];
}

// ✅ Send a friend request (enforces ordered pair uniqueness)
export async function sendFriendRequest(user_id: number, friend_id: number) {
  if (user_id === friend_id) throw new Error("Cannot send request to self");
  const [a, b] = user_id < friend_id ? [user_id, friend_id] : [friend_id, user_id];

  const query = `
    INSERT INTO friendships (user_id, friend_id, relationship_status)
    VALUES ($1, $2, 'pending')
    ON CONFLICT (user_id, friend_id) DO NOTHING
    RETURNING *;
  `;
  const result = await pool.query(query, [a, b]);
  return result.rows[0];
}

// ✅ Accept a pending friend request
export async function acceptFriendRequest(user_id: number, friend_id: number) {
  const [a, b] = user_id < friend_id ? [user_id, friend_id] : [friend_id, user_id];
  const query = `
    UPDATE friendships
    SET relationship_status = 'accepted'
    WHERE user_id = $1 AND friend_id = $2
      AND relationship_status = 'pending'
    RETURNING *;
  `;
  const result = await pool.query(query, [a, b]);
  return result.rows[0];
}

// ✅ Decline (delete) a friend request
export async function declineFriendRequest(user_id: number, friend_id: number) {
  const [a, b] = user_id < friend_id ? [user_id, friend_id] : [friend_id, user_id];
  const query = `
    DELETE FROM friendships
    WHERE user_id = $1 AND friend_id = $2
      AND relationship_status = 'pending';
  `;
  await pool.query(query, [a, b]);
}

// ✅ Delete any friendship (accepted or pending)
export async function deleteFriend(user_id: number, friend_id: number) {
  const [a, b] = user_id < friend_id ? [user_id, friend_id] : [friend_id, user_id];
  const query = `DELETE FROM friendships WHERE user_id = $1 AND friend_id = $2`;
  await pool.query(query, [a, b]);
}

// ✅ View pending requests *received* (where user is the recipient)
export async function getIncomingRequests(user_id: number) {
  const query = `
    SELECT u.user_id, u.username, u.full_name
    FROM friendships f
    JOIN users u ON u.user_id = CASE
      WHEN f.user_id = $1 THEN f.friend_id
      ELSE f.user_id
    END
    WHERE (f.user_id = $1 OR f.friend_id = $1)
      AND f.relationship_status = 'pending'
      AND f.friend_id = $1
  `;
  const result = await pool.query(query, [user_id]);
  return result.rows;
}

// ✅ Mutual friends lookup
export async function getMutualFriends(user_id: number, other_id: number) {
  const query = `
    SELECT u.user_id, u.username, u.full_name
    FROM users u
    WHERE u.user_id IN (
      SELECT CASE WHEN f.user_id = $1 THEN f.friend_id ELSE f.user_id END AS friend_id
      FROM friendships f
      WHERE (f.user_id = $1 OR f.friend_id = $1)
        AND f.relationship_status = 'accepted'
    )
    AND u.user_id IN (
      SELECT CASE WHEN f.user_id = $2 THEN f.friend_id ELSE f.user_id END AS friend_id
      FROM friendships f
      WHERE (f.user_id = $2 OR f.friend_id = $2)
        AND f.relationship_status = 'accepted'
    );
  `;
  const result = await pool.query(query, [user_id, other_id]);
  return result.rows;
}
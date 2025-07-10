// services/notification.service.ts
import { redisClient } from '../../../config/redis';
import pool from '../../../config/db';

export type Notification = {
   type: string;          // e.g. "friend_request", "achievement", …
   payload: any;          // whatever meta you need
   timestamp: number;     // ms since epoch
};

/**
 * Push a new notification onto user’s list *and* publish
 */
export async function notifyUser(
   userId: number,
   type: string,
   payload: any
) {
   const note: Notification = { type, payload, timestamp: Date.now()};
   const channel = `notifications:${userId}`;
   const inboxKey = `notif:inbox:${userId}`;
   const msg = JSON.stringify(note);

   // atomic: push to list, trim, then publish
   await redisClient.multi()
    .lPush(inboxKey, msg)
    .lTrim(inboxKey, 0, 99)
    .publish(channel, msg)
    .exec();
}

/**
 * Get the last N notifications for a user
 */
export async function getUserNotifications(
   userId: number,
   count = 50
): Promise<Notification[]> {
   const inboxKey = `notif:inbox:${userId}`;
   const raw = await redisClient.lRange(inboxKey, 0, count - 1);
   return raw.map((s) => JSON.parse(s) as Notification);
}


/**
 * Fetch all friend‐requests pending *to* this user,
 * and map them into our Notification shape.
 */
export async function getPendingFriendRequests(userId: number): Promise<Notification[]> {
   const sql = `
    SELECT
      f.user_id   AS requester_id,
      u.username,
      ai.avatar_image_path,
      f.created_at
    FROM friendships f
    JOIN users u ON u.user_id = f.user_id
    JOIN user_preferences up ON up.user_id = u.user_id
    JOIN avatar_images ai ON ai.avatar_id = up.avatar_id
    WHERE f.friend_id = $1
      AND f.relationship_status = 'pending'
    LIMIT 50
  `;
   const { rows } = await pool.query(sql, [ userId ]);


   interface FriendRequestRow {
      requester_id: number;
      username: string;
      avatar_image_path: string;
      created_at: string;
   }

   interface FriendRequestPayload {
      from: number;
      username: string;
      avatar: string;
   }

   return (rows as FriendRequestRow[]).map((r): Notification => ({
      type: 'friend_request',
      payload: {
         from: r.requester_id,
         username: r.username,
         avatar: r.avatar_image_path,
      } as FriendRequestPayload,
      timestamp: new Date(r.created_at).getTime(),
   }));
}

/**
 * Clear all notifications for a user
 */
export async function clearUserNotifications(userId: number) {
   const inboxKey = `notif:inbox:${userId}`;
   await redisClient.del(inboxKey);
}

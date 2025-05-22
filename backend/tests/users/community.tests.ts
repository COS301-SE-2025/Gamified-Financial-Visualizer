
import {
   inviteFriend,
   getFriends,
   removeFriend,
   sendFriendRequest,
   getFriendRequests,
   acceptFriendRequest,
   rejectFriendRequest,
} from '../../services/community.service';

import { describe, it } from 'node:test';
import expect from 'node:test';

describe('Community Service', () => {
   const userId = Math.floor(Math.random() * 1000000);
   const friendId = userId + 1;

   it('should invite and retrieve a friend', async () => {
      await inviteFriend(userId, friendId);
      const friends = await getFriends(userId);
      const found = friends.find(f => f.friend_id === friendId);
      expect(found).toBeDefined();
   });

   it('should remove a friend', async () => {
      await removeFriend(userId, friendId);
      const friends = await getFriends(userId);
      const removed = friends.find(f => f.friend_id === friendId);
      expect(removed).toBeUndefined();
   });

   it('should send a friend request', async () => {
      await sendFriendRequest(userId, friendId);
      const requests = await getFriendRequests(userId);
      const found = requests.find(r => r.friend_id === friendId);
      expect(found).toBeDefined();
   });

   it('should accept a friend request', async () => {
      await sendFriendRequest(friendId, userId);
      await acceptFriendRequest(friendId, userId);
      const friends = await getFriends(friendId);
      const confirmed = friends.find(f => f.friend_id === userId);
      expect(confirmed).toBeDefined();
   });

   it('should reject a friend request', async () => {
      await sendFriendRequest(userId, friendId);
      await rejectFriendRequest(userId, friendId);
      const requests = await getFriendRequests(userId);
      const rejected = requests.find(r => r.friend_id === friendId);
      expect(rejected).toBeUndefined();
   });
});

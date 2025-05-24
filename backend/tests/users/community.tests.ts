
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import * as community from '../../services/community.service';

import * as auth from '../../services/auth.service';
import pool from '../../db/index';
/*
const testUsers = [
  {
    user_id: 901,
    email: 'user1@example.com',
    username: 'user1',
    full_name: 'User One',
    hashed_password: 'pass1',
    password_salt: 'salt1',
  },
  {
    user_id: 902,
    email: 'user2@example.com',
    username: 'user2',
    full_name: 'User Two',
    hashed_password: 'pass2',
    password_salt: 'salt2',
  },
  {
    user_id: 903,
    email: 'user3@example.com',
    username: 'user3',
    full_name: 'User Three',
    hashed_password: 'pass3',
    password_salt: 'salt3',
  },
];

await Promise.all(testUsers.map(user => auth.createUser(user)));
*/

let testUserId1: number = 901;
let testUserId2: number = 902;

describe('Community Service Tests', () => {
  beforeAll(async () => {
    // Ensure test users exist in the database
    await pool.query(`
      INSERT INTO users (user_id, email, username, full_name, hashed_password, password_salt)
      VALUES ($1, 'user1@example.com', 'user1', 'User One', 'pass1', 'salt1')
      ON CONFLICT (user_id) DO NOTHING;
    `, [testUserId1]);

    await pool.query(`
      INSERT INTO users (user_id, email, username, full_name, hashed_password, password_salt)
      VALUES ($1, 'user2@example.com', 'user2', 'User Two', 'pass2', 'salt2')
      ON CONFLICT (user_id) DO NOTHING;
    `, [testUserId2]);
  });

  it('should send and accept a friend request', async () => {
    await community.sendFriendRequest(testUserId1, testUserId2);
    await community.acceptFriendRequest(testUserId1, testUserId2);
    const friends = await community.getFriends(testUserId1);
    expect(friends.some(f => f.friend_id === testUserId2)).toBe(true);
  });

  it('should invite to goal and then leave goal', async () => {
    const goalId = 999;
    await pool.query(`
      INSERT INTO goals (goal_id, user_id, goal_name, goal_type, target_amount, target_date, goal_status)
      VALUES ($1, $2, 'Test Goal', 'savings', 1000, NOW() + INTERVAL '30 days', 'in-progress')
      ON CONFLICT (goal_id) DO NOTHING;
    `, [goalId, testUserId1]);

    await community.inviteToGoal(testUserId1, goalId, testUserId2);
    await community.leaveGoal(testUserId2, goalId);
  });

  it('should update and fetch leaderboard', async () => {
    await community.updateUserPoints(testUserId1, 100);
    const leaderboard = await community.getLeaderboard();
    expect(Array.isArray(leaderboard)).toBe(true);
  });

  it('should create and remove an achievement', async () => {
    await community.addAchievement(testUserId1, 1);
    const achievements = await community.getUserAchievements(testUserId1);
    expect(achievements.some(a => a.achievement === 1)).toBe(true);

    await community.removeAchievement(testUserId1, 1);
    const updated = await community.getUserAchievements(testUserId1);
    expect(updated.some(a => a.achievement === 1)).toBe(false);
  });

  afterAll(async () => {
    await pool.query('DELETE FROM friends WHERE user_id = $1 OR friend_id = $1', [testUserId1]);
    await pool.query('DELETE FROM users WHERE user_id IN ($1, $2)', [testUserId1, testUserId2]);
    await pool.end();
  });
});

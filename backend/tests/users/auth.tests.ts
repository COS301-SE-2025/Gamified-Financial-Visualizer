import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import * as auth from '../../services/auth.service';
import { Pool } from 'pg';

// Sample user data
const testUser = {
  email: 'yohali@example.com',
  username: 'testyohali',
  full_name: 'Test Yohali',
  hashed_password: 'String123',
  password_salt: 'salt123'
};

let createdUserId: number;

describe('Auth Service Tests', () => {
  it('should create a user', async () => {
    const user = await auth.createUser(testUser);
    expect(user).toHaveProperty('user_id');
    expect(user.username).toBe(testUser.username);
    createdUserId = user.user_id;
  });

  it('should authenticate the user with correct credentials', async () => {
    const user = await auth.authenticateUser(testUser.username, testUser.hashed_password);
    expect(user).toBeDefined();
    expect(user.email).toBe(testUser.email);
  });

  it('should fetch user by email', async () => {
    const user = await auth.getUserByEmail(testUser.email);
    expect(user).toBeDefined();
    expect(user.username).toBe(testUser.username);
  });

  it('should update user profile', async () => {
    const updated = await auth.updateUserProfile(createdUserId, { full_name: 'Updated Test User' });
    expect(updated.full_name).toBe('Updated Test User');
  });

  it('should update password', async () => {
    await auth.updatePassword(createdUserId, 'newhashedpassword');
    const user = await auth.authenticateUser(testUser.username, 'newhashedpassword');
    expect(user).toBeDefined();
  });

  it('should update and fetch user preferences', async () => {
    await auth.updateUserPreferences(createdUserId, 'dark', true, 'avatar_99');
    const prefs = await auth.getUserPreferences(createdUserId);
    expect(prefs.theme).toBe('dark');
    expect(prefs.avatar_id).toBe('avatar_99');
  });

  it('should manage push subscriptions', async () => {
    const sub = await auth.addPushSubscription(createdUserId, 'https://endpoint.com', 'key', 'auth');
    expect(sub.endpoint).toBe('https://endpoint.com');

    const subs = await auth.getPushSubscriptions(createdUserId);
    expect(subs.length).toBeGreaterThan(0);

    await auth.deletePushSubscription(sub.push_id);
  });

  it('should verify email and set 2FA', async () => {
    await auth.verifyUserEmail(createdUserId);
    await auth.setTwoFactorEnabled(createdUserId, true);
    const user = await auth.getUserById(createdUserId);
    expect(user.email_verified).toBe(true);
    expect(user.two_factor_enabled).toBe(true);
  });

  it('should delete the user', async () => {
    await auth.deleteUser(createdUserId);
    const deleted = await auth.getUserById(createdUserId);
    expect(deleted).toBeUndefined();
  });
});

import { v4 as uuidv4 } from 'uuid';
import {
  register,
  getUserProfile,
  login,
  updateUserProfile,
  deleteUserProfile,
} from '../../services/auth.service';

import { describe, it } from 'node:test';
import expect from 'node:test';

describe('User Service', () => {
  const testUserId = uuidv4();
  const testUser = {
    uid: testUserId,
    email: 'testuser@example.com',
    username: 'testuser',
    name: 'Test',
    surname: 'User',
    hash_password: 'hashedpw123'
  };

  beforeAll(async () => {
    await register(testUser);
  });

  it('should register and fetch a user', async () => {
    const user = await getUserProfile(testUserId);
    expect(user).toBeDefined();
    expect(user.email).toBe(testUser.email);
  });

  it('should login with correct credentials', async () => {
    const user = await login(testUser.username, testUser.hash_password);
    expect(user).toBeDefined();
    expect(user.id).toBe(testUserId);
  });

  it('should update user profile', async () => {
    await updateUserProfile(testUserId, {
      email: 'updated@example.com',
      username: 'updateduser',
      name: 'Updated',
      surname: 'User'
    });

    const updated = await getUserProfile(testUserId);
    expect(updated.email).toBe('updated@example.com');
  });

  afterAll(async () => {
    await deleteUserProfile(testUserId);
  });
});
function beforeAll(arg0: () => Promise<void>) {
   throw new Error('Function not implemented.');
}


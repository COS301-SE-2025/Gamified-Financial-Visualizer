import request from 'supertest';
import app from '../src/app';
import pool from '../src/config/db';

describe('Auth API (integration)', () => {
  let server: ReturnType<typeof app.listen>;
  const PORT = 5001;

  beforeAll(() => {
    server = app.listen(PORT, () => {
      console.log(`Auth test server running on port ${PORT}`);
    });
  });

  afterAll(async () => {
    await pool.end();
    server.close();
  });

  it('GET /health should return OK', async () => {
    const res = await request(server).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('OK');
  });

  const mockUser = {
    full_name: 'Test User',
    username: 'test_user',
    email: `testuser_${Date.now()}@example.com`,
    password: 'TestPass123!'
  };

  test('POST /api/auth/register creates a new user', async () => {
    const res = await request(server).post('/api/auth/register').send(mockUser);
    expect(res.status).toBe(201);
    expect(res.body.data.user).toHaveProperty('username', mockUser.username);
  });

  test('POST /api/auth/login authenticates the user', async () => {
    const res = await request(server).post('/api/auth/login').send({
      email: mockUser.email,
      password: mockUser.password
    });
    expect(res.status).toBe(200);
    expect(res.body.data.user).toHaveProperty('username', mockUser.username);
  });

  test('POST /api/auth/login with wrong password should fail', async () => {
    const res = await request(server).post('/api/auth/login').send({
      email: mockUser.email,
      password: 'WrongPassword123!'
    });
    expect(res.status).toBe(401);
  });

  test('POST /api/auth/register with invalid name should fail', async () => {
    const res = await request(server).post('/api/auth/register').send({
      ...mockUser,
      full_name: 'invalid_name_123'
    });
    expect(res.status).toBe(400);
  });
});

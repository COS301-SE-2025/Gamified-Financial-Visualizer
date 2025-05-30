import request from 'supertest';
import app from '../src/app';
import pool from '../src/config/db';

describe('Auth API (integration)', () => {
  let server: ReturnType<typeof app.listen>;
  const user = {
    email: 'testapi@example.com',
    username: 'apitester',
    full_name: 'API Test',
    hashed_password: 'testpass',
    password_salt: 'salt123'
  };

  beforeAll(() => {
    server = app.listen(4002, () => {
      console.log('Auth API Test server running on port 4002');
    });
  });

  afterAll(async () => {
    await pool.end();
    server.close();
  });

  it('POST /api/auth/register should register user', async () => {
    const res = await request(server).post('/api/auth/register').send(user);
    expect(res.status).toBe(201);
    expect(res.body.data.username).toBe(user.username);
  });

  it('POST /api/auth/login should authenticate user', async () => {
    const res = await request(server).post('/api/auth/login').send({
      username: user.username,
      password: user.hashed_password
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('GET /api/users/:id/preferences should fetch preferences', async () => {
    const res = await request(server).get('/api/users/1/preferences');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
  });
});

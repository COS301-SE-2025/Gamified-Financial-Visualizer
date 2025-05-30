import request from 'supertest';
import app from '../src/app';
import pool from '../src/config/db';

describe('Goals API (integration)', () => {
  let server: ReturnType<typeof app.listen>;

  beforeAll(() => {
    server = app.listen(4001, () => {
      console.log('Goals API Test server running on port 4001');
    });
  });

  afterAll(async () => {
    await pool.end();
    server.close();
  });

  it('POST /api/goals/personal should create a personal goal', async () => {
    const res = await request(server).post('/api/goals/personal').send({
      user_id: 1,
      goal_name: 'Integration Goal',
      goal_type: 'savings',
      target_amount: 1000,
      target_date: '2025-12-31'
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data.goal_name).toBe('Integration Goal');
  });

  it('GET /api/goals/my should fetch user goals', async () => {
    const res = await request(server).get('/api/goals/my?user_id=1');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('POST /api/goals/:goalId/progress should update goal progress', async () => {
    const goalId = 1;
    const res = await request(server)
      .post(`/api/goals/${goalId}/progress`)
      .send({ user_id: 1, amount: 50 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
  });
});

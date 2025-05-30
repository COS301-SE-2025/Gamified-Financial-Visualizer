import request from 'supertest';
import app from '../src/app';
import pool from '../src/config/db';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

describe('Transactions API (integration)', () => {
  let server: ReturnType<typeof app.listen>;

  beforeAll(() => {
    server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Test server running on port ${PORT}`);
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

  test('POST /api/transactions creates a transaction', async () => {
    const res = await request(server).post('/api/transactions').send({
      account_id: 1,
      category_id: 2,
      transaction_amount: 123.45,
      transaction_type: 'expense',
      transaction_date: '2025-05-25T12:00:00Z',
      description: 'Test via integration',
      is_recurring: false
    });

    expect(res.status).toBe(201);
    console.log('Response body:', res.body);
    expect(res.body).toHaveProperty('data');
  });

  test('GET /api/transactions/user/:userId returns an array', async () => {
    const res = await request(server).get('/api/transactions/user/1');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('GET /api/transactions/user/:userId/summary returns summary', async () => {
    const res = await request(server).get('/api/transactions/user/1/summary');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

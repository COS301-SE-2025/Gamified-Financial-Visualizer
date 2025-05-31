import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import pool from '../config/db';

describe('Database Connection Test', () => {
  it('should connect to the database and return the current time', async () => {
    const result = await pool.query('SELECT NOW()');
    expect(result.rows.length).toBeGreaterThan(0);
    console.log('🟢 DB Time:', result.rows[0].now);
  });

  afterAll(async () => {
    await pool.end();
  });
});

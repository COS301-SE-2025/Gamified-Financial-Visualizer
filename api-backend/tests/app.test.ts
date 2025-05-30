import dotenv from 'dotenv';
dotenv.config(); 

import { startDaemon } from '../../backend/daemon/daemon.js';
import pool from '../config/db.js';

describe('Daemon Engine Test', () => {
  it('should connect to the DB and return a valid user count', async () => {
    const userCount = await startDaemon();
    expect(Number(userCount)).toBeGreaterThanOrEqual(0);
    console.log('✅ Daemon successfully fetched user count.');
  });

  afterAll(async () => {
    await pool.end(); // Close DB pool after test
  });
});

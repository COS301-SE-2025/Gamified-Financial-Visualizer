import pool from '../db/index';
import { after, describe, it } from 'node:test';
import assert from 'node:assert';

describe('Database Connection Test', () => {
   it('should connect to the database and return the current time', async () => {
      const result = await pool.query('SELECT NOW()');
      assert.ok(result.rows.length > 0);
      console.log('🟢 DB Time:', result.rows[ 0 ].now);
   });

   after(async () => {
      await pool.end();
   });
});

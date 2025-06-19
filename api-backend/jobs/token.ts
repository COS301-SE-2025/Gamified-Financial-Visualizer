import cron  from 'node-cron';
import pool  from '../config/db';
import { logger } from '../config/logger';

cron.schedule('0 * * * *', async () => { // set out to run every hour
  const { rowCount } = await pool.query(
    'DELETE FROM user_tokens WHERE expires_at < CURRENT_TIMESTAMP',
  );
  if (rowCount) logger.info(`[Cron] Removed ${rowCount} expired tokens`);
});

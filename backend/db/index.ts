// db.ts
import dotenv from 'dotenv';

dotenv.config();
console.log('🔐 DB_PASSWORD:', typeof process.env.DB_PASSWORD, process.env.DB_PASSWORD?.length);

import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export default pool;

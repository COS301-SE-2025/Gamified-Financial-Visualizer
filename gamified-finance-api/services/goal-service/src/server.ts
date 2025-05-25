import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import goalRoutes from './routes/goalRoutes.js'; // ✅ Correct name + extension
import { logger } from './config/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api/goal', goalRoutes); // ✅ Proper path and variable

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
});

app.listen(PORT, () => {
  logger.info(`Goal service running on port ${PORT}`);
});

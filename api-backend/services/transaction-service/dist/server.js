import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
import transactionRoutes from './routes/transactionRoutes';
import { logger } from './config/logger';
dotenv.config();
var app = express();
var PORT = process.env.PORT || 5003;
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use('/api/transaction', transactionRoutes);
app.get('/health', function (req, res) {
    res.status(200).json({ status: 'OK' });
});
app.listen(PORT, function () {
    logger.info("Transaction service running on port ".concat(PORT));
});

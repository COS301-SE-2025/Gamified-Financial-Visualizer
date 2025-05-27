// config/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info', // minimum level to log (can be dynamic via env)
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    // Optionally add file or external service transports
    // new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // new winston.transports.Http({ ... })
  ],
});

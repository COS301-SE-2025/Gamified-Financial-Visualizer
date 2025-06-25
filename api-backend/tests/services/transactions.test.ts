import request from 'supertest';
import express from 'express';
import {
  createAccount,
  getAccounts,
  getAccountById,
  deleteAccount,
  updateAccountName
} from '../../modules/transactions/services/transaction.service';
import { logger } from '../../config/logger';
import accountRoutes from '../../modules/transactions/routes/accountRoutes';

// Mock the service functions and logger
jest.mock('../../modules/transactions/services/transaction.service');
jest.mock('../../config/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));


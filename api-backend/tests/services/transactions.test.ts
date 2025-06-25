// tests/services/transaction.service.test.ts

import * as service from '../../modules/transactions/services/transaction.service';
import pool from '../../config/db';
import { logger } from '../../config/logger';
import { eventBus } from '../../events/event-bus';

jest.mock('../../config/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

jest.mock('../../events/event-bus', () => ({
  eventBus: {
    emit: jest.fn(),
  },
}));

const mockQuery = jest.fn();
const mockRelease = jest.fn();
const mockClient = {
  query: mockQuery,
  release: mockRelease,
};


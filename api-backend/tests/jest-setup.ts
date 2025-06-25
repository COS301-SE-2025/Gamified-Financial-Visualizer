import dotenv from 'dotenv';
import path from 'path';

// Load test environment variables
dotenv.config({
  path: path.resolve(__dirname, '.env.test')
});

// Mock Buffer.from safely
jest.mock('buffer', () => ({
  Buffer: {
    from: jest.fn((input, encoding) => {
      if (input === undefined) {
        throw new Error('Buffer input cannot be undefined');
      }
      return jest.requireActual('buffer').Buffer.from(input, encoding);
    })
  }
}));

// Mock Redis globally for all tests
jest.mock('@redis/client', () => ({
  createClient: jest.fn(() => ({
    connect: jest.fn().mockResolvedValue(undefined),
    disconnect: jest.fn().mockResolvedValue(undefined),
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
    on: jest.fn(),
    isOpen: true
  }))
}));


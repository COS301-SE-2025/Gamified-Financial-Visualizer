/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // only run files under tests/integration
  testMatch: ['<rootDir>/intergration-tests/**/*.test.ts'],

  // load your .env
  setupFiles: ['dotenv/config'],

  // if you need to transform imports outside src:
  moduleDirectories: ['node_modules', 'src'],

  // clear DB between tests (optional):
  // globalSetup: '<rootDir>/tests/setup.ts',
  // globalTeardown: '<rootDir>/tests/teardown.ts',
};

// jest.config.mjs
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true }]
  },
  setupFiles: ['dotenv/config'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1' // helps TypeScript ESM import paths
  }
};

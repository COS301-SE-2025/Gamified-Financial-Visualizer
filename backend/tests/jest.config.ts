export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
 // setupFiles: ['dotenv/config'],
  globals: {
    'ts-jest': {
      useESM: true,
    }
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1" // removes `.js` extension resolution problems
  }
};

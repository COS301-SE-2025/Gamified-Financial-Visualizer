module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest', // <-- This line is key for .jsx support
  },
  moduleNameMapper: {
  '\\.(css|less|scss|sass|gif|jpg|jpeg|png|svg)$': '<rootDir>/__mocks__/fileMock.js'
},
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['**/UnitTesting/**/*.test.ts?(x)', '**/UnitTesting/**/*.test.js?(x)'],
};

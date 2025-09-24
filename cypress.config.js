const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.jsx',
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    experimentalMemoryManagement: true,  // Enable experimental memory management
    numTestsKeptInMemory: 1,  // Limit the number of tests kept in memory during 'cypress open'
  },
});

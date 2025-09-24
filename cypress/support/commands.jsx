// /cypress/support/commands.js
Cypress.Commands.add('login', (username, password) => {
  cy.visit('/login');
  cy.get('input[name="username"]').type(username);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

Cypress.on('window:before:load', (win) => {
  // Mock model and asset requests to prevent them from loading
  cy.intercept('GET', '**/models/*.glb', { statusCode: 200, body: {} }).as('mockModel');
  cy.intercept('GET', '**/static/media/*', { statusCode: 200, body: {} }).as('mockImage');
});
/* global describe, it, cy, before, beforeEach */

describe('Register Page', () => {
  before('visit the register page', () => {
    cy.visit('http://localhost:3000/register');
  });

  it('should display the correct page title', () => {
    cy.contains('h1', 'Register').should('be.visible');
  });

  it('should display registration form correctly', () => {
    cy.get('[data-cy="full-name"]').should('be.visible');
    cy.get('[data-cy="email"]').should('be.visible');
    cy.get('[data-cy="username"]').should('be.visible');
    cy.get('[data-cy="password"]').should('be.visible');
    cy.get('[data-cy="confirm-password"]').should('be.visible');
    cy.get('[data-cy="register-button"]').should('be.visible');
  });

  describe('Registration Tests', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/register');
      cy.intercept('POST', 'http://localhost:5000/api/auth/register').as('registerApi');
    });

    it('should show error message for missing fields', () => {
      cy.get('[data-cy="register-button"]').click();
      cy.get('.error').should('contain', 'Please fill in all fields.');
    });

    it('should show error for password mismatch', () => {
      cy.get('[data-cy="full-name"]').type('Test User');
      cy.get('[data-cy="email"]').type('testuser@example.com');
      cy.get('[data-cy="username"]').type('testuser');
      cy.get('[data-cy="password"]').type('password123');
      cy.get('[data-cy="confirm-password"]').type('password124');
      cy.get('[data-cy="register-button"]').click();
      cy.get('.error').should('contain', 'Passwords do not match.');
    });

    it('should successfully register with valid credentials', () => {
      const uniqueId = Date.now();
      const testEmail = `testuser${uniqueId}@example.com`;
      const testUsername = `testuser${uniqueId}`;

      cy.get('[data-cy="full-name"]').type('Valid User');
      cy.get('[data-cy="email"]').type(testEmail);
      cy.get('[data-cy="username"]').type(testUsername);
      cy.get('[data-cy="password"]').type('ValidPass123!');
      cy.get('[data-cy="confirm-password"]').type('ValidPass123!');
      cy.get('[data-cy="register-button"]').click();
      cy.url().should('include', '/login');
    });
  });
});

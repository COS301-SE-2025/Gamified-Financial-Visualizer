/* global describe, it, cy, before, beforeEach */

describe('Login Page', () => {
  before('visit the login page', () => {
    // Intercept .glb file requests and return a mock response (or empty response)
    cy.intercept('GET', '/models/*.glb', { statusCode: 200, body: {} }).as('mockModels');

    // Visit the login page
    cy.visit('http://localhost:3000/login');
  });

  it('should display the correct page title', () => {
    cy.contains('h1', 'Welcome Back!').should('be.visible');
  });

  it('should display login form correctly', () => {
    cy.get('[data-cy="username"]').should('be.visible');
    cy.get('[data-cy="password"]').should('be.visible');
    cy.get('[data-cy="login-button"]').should('be.visible');
  });

  describe('Login Tests', () => {
    beforeEach(() => {
      // Visit login page before each test
      cy.visit('http://localhost:3000/login');
      // Intercept the login request to mock a successful response
      cy.intercept('POST', 'http://localhost:5000/api/auth/login').as('loginApi');
    });

    it('should display error message when credentials are missing', () => {
      cy.get('[data-cy="login-button"]').click();
      cy.get('.error').should('contain', 'Please enter both username and password.');
    });

    it('should show error for invalid login credentials', () => {
      cy.get('[data-cy="username"]').type('invaliduser');
      cy.get('[data-cy="password"]').type('invalidpassword');
      cy.get('[data-cy="login-button"]').click();
      cy.get('.error').should('contain', 'Invalid credentials');
    });

    it('should successfully log in with valid credentials', () => {
      cy.get('[data-cy="username"]').type('validuser');
      cy.get('[data-cy="password"]').type('validpassword123');
      cy.get('[data-cy="login-button"]').click();
      cy.url().should('include', '/transactions');
    });
  });
});

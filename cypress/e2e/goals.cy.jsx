describe('Goals Page - Frontend Testing', () => {
  beforeEach(() => {
    // Mock login API response
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: { token: 'fake-jwt-token', user: { id: 1, name: 'Test User', email: 'test@example.com' } },
    }).as('loginApi');

    // Mock API responses for goals
    cy.intercept('GET', '/api/goals/user/*', {
      statusCode: 200,
      body: {
        data: [
          { goal_id: 1, goal_name: 'Save for Vacation', goal_description: 'Save money for a trip to Bali', goal_progress: 30, goal_target: 1000 },
          { goal_id: 2, goal_name: 'Buy a Car', goal_description: 'Save for a new car', goal_progress: 50, goal_target: 5000 },
        ],
      },
    }).as('getGoals');

    cy.visit('/login');
    cy.get('[data-cy="username"]').type('testuser@example.com');
    cy.get('[data-cy="password"]').type('password123');
    cy.get('[data-cy="login-button"]').click();

    cy.wait('@loginApi');
    cy.visit('/goals'); // Visit the goals page
  });

  it('should display goals and their progress correctly', () => {
    // Check if the goal names and progress bars are visible
    cy.contains('Save for Vacation').should('be.visible');
    cy.contains('Buy a Car').should('be.visible');
    cy.contains('30%').should('be.visible'); // Goal progress for "Save for Vacation"
    cy.contains('50%').should('be.visible'); // Goal progress for "Buy a Car"
  });

  it('should add a new goal successfully', () => {
    // Simulate adding a new goal
    cy.get('button').contains('Add Goal').click();

    cy.get('input[name="goal_name"]').type('New Goal');
    cy.get('textarea[name="goal_description"]').type('This is a new goal');
    cy.get('input[name="goal_target"]').type('2000');
    cy.get('button[type="submit"]').click();

    cy.contains('New Goal').should('be.visible');
  });

  it('should update goal progress correctly', () => {
    // Simulate updating progress of an existing goal
    cy.contains('Save for Vacation').click();
    cy.get('input[name="goal_progress"]').clear().type('60');
    cy.get('button').contains('Update Progress').click();

    cy.contains('60%').should('be.visible');
  });

  it('should filter goals by name', () => {
    // Test search functionality
    cy.get('input').type('Save for Vacation');  // Search for "Save for Vacation"

    cy.contains('Save for Vacation').should('be.visible');
    cy.contains('Buy a Car').should('not.exist');  // Ensure non-matching goal is hidden
  });
});

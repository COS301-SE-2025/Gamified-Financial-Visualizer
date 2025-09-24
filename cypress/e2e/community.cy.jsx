describe('Community Page - Frontend Testing', () => {
  beforeEach(() => {
    // Mock login API response
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: { token: 'fake-jwt-token', user: { id: 1, name: 'Test User', email: 'test@example.com' } },
    }).as('loginApi');

    // Mock API responses for communities
    cy.intercept('GET', '/api/communities/user/*', {
      statusCode: 200,
      body: {
        data: [
          { community_id: 1, community_name: 'Tech Enthusiasts', community_description: 'A community for tech lovers', members_count: 50 },
          { community_id: 2, community_name: 'Gamers', community_description: 'A community for gamers', members_count: 120 },
        ],
      },
    }).as('getCommunities');

    cy.visit('/login');
    cy.get('[data-cy="username"]').type('testuser@example.com');
    cy.get('[data-cy="password"]').type('password123');
    cy.get('[data-cy="login-button"]').click();

    cy.wait('@loginApi');
    cy.visit('/community'); // Visit the community page
  });

  it('should display community names and member counts correctly', () => {
    // Check if community names and member counts are displayed
    cy.contains('Tech Enthusiasts').should('be.visible');
    cy.contains('Gamers').should('be.visible');
    cy.contains('50 members').should('be.visible');
    cy.contains('120 members').should('be.visible');
  });

  it('should join a community successfully', () => {
    // Simulate joining a community
    cy.get('button').contains('Join Tech Enthusiasts').click();

    cy.contains('You have joined Tech Enthusiasts').should('be.visible');
  });

  it('should display the correct community description', () => {
    // Simulate clicking on a community card
    cy.contains('Tech Enthusiasts').click();

    cy.contains('A community for tech lovers').should('be.visible');
  });

  it('should filter communities by name', () => {
    // Test search functionality
    cy.get('input').type('Gamers');  // Search for "Gamers"

    cy.contains('Gamers').should('be.visible');
    cy.contains('Tech Enthusiasts').should('not.exist');  // Ensure non-matching community is hidden
  });
});

describe('Accounts Page - Frontend Testing', () => {
  beforeEach(() => {
    // Mock login API response to simulate a logged-in user
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: { token: 'fake-jwt-token', user: { id: 1, name: 'Test User', email: 'test@example.com' } },
    }).as('loginApi');

    // Mock API responses for accounts and transactions after login
    cy.intercept('GET', '/api/accounts/user/*', {
      statusCode: 200,
      body: {
        data: [
          { account_id: 1, bank_name: 'Bank A', account_name: 'Account 1', account_balance: 1000, currency: 'ZAR', account_type: 'Savings' },
          { account_id: 2, bank_name: 'Bank B', account_name: 'Account 2', account_balance: 500, currency: 'USD', account_type: 'Checking' },
        ],
      },
    }).as('getAccounts');

    cy.intercept('GET', '/api/transactions/user/*', {
      statusCode: 200,
      body: {
        data: [
          { transaction_id: 1, transaction_name: 'Deposit', transaction_amount: 500, category_name: 'Income', transaction_date: '2025-09-20', account_id: 1 },
          { transaction_id: 2, transaction_name: 'Withdrawal', transaction_amount: -200, category_name: 'Expense', transaction_date: '2025-09-21', account_id: 1 },
        ],
      },
    }).as('getTransactions');

    // Visit the login page to simulate the user login
    cy.visit('/login');

    // Simulate login by providing mock credentials
    cy.get('[data-cy="username"]').type('testuser@example.com'); // Email
    cy.get('[data-cy="password"]').type('password123'); // Password
    cy.get('[data-cy="login-button"]').click();

    // Wait for login API call to finish
    cy.wait('@loginApi');

    // After successful login, visit the accounts page
    cy.visit('/accounts');
  });

  it('should display account names and balances correctly', () => {
    // Check if account names and balances are displayed
    cy.contains('Account 1').should('be.visible');
    cy.contains('Account 2').should('be.visible');
    cy.contains('R 1000.00').should('be.visible');
    cy.contains('R 500.00').should('be.visible');
  });

  it('should render transaction details for the selected account', () => {
    // Click on the first account card
    cy.get('[data-cy="account-card"]').first().click();

    // Check if the transaction names for the selected account are displayed
    cy.contains('Deposit').should('be.visible');
    cy.contains('Withdrawal').should('be.visible');
  });

  it('should be able to paginate through accounts', () => {
    // Test pagination - Next button
    cy.get('button').contains('Next').click();

    // Verify if the page changes (ensure the second page's content is rendered)
    cy.contains('Page 2').should('be.visible');
  });

  it('should filter transactions based on search input', () => {
    // Test search functionality
    cy.get('input').type('Income');  // Search for transaction name "Income"

    // Check if the relevant transaction is displayed
    cy.contains('Deposit').should('be.visible');
    cy.contains('Withdrawal').should('not.exist');  // Ensure non-matching transaction is hidden
  });
});

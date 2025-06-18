import React from 'react';
import AccountsLayout from './AccountsLayout';
import AccountsPage from '../../pages/Accounts/AccountsPage';

const TransactionsPage = () => {
  return (
    <AccountsLayout>
      <AccountsPage />
    </AccountsLayout>
  );
};

export default TransactionsPage;

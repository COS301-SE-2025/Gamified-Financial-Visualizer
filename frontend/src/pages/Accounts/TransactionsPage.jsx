import React from 'react';
import AccountsLayout from './AccountsLayout';
import AccountsCard from '../../pages/Accounts/AccountsPage';
import RecentTransactionsTable from '../../components/tables/RecentTransactionsTable';

const TransactionsPage = () => {
  return (
    <AccountsLayout>
      <div className="flex flex-col gap-6 -ml-[18px]">   
        <AccountsCard /> 
      </div>
    </AccountsLayout>
  );
};

export default TransactionsPage;

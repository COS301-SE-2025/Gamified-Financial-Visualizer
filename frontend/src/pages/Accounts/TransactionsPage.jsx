import React, { useState } from 'react';
import AccountsSidebar from '../../layouts/sidebars/AccountsSidebar';
import {FaSearch, FaPlus, FaDownload, FaLightbulb, FaMoneyCheckAlt, FaEdit, FaTrash} from 'react-icons/fa';
import AccountsHeader from '../../layouts/headers/AccountsHeader';
import AccountsCard from '../../pages/Accounts/AccountsPage';


const TransactionsPage = () => {

    const [view, setView] = useState('transactions'); 
    const budgetItems = [
    { category: 'Groceries', limit: 9000, used: 5000 },
    { category: 'Transport', limit: 9000, used: 5000 },
    { category: 'Entertainment', limit: 9000, used: 5000 },
  ];


  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
        <div className="flex">
          <div className="w-[400px] -ml-[-15px] -mt-[-19px]">
            <AccountsSidebar />
          </div>
          <div className="flex-1 px-4"></div>
        </div>

      {/* Main content */}
      <main className="w-3/4 p-6 space-y-6">
        <AccountsHeader />
        <AccountsCard/>

      </main>
    </div>
  );
};

export default TransactionsPage;

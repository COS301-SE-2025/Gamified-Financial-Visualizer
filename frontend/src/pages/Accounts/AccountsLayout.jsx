import React, { useEffect, useState } from 'react';
import AccountSidebar from '../../layouts/sidebars/AccountsSidebar';
import AccountHeader from '../../layouts/headers/AccountsHeader';
import PacmanLoader from '../../components/loaders/PacmanLoader';
import AccountsSidebar from '../../layouts/sidebars/AccountsSidebar';

const AccountsLayout = ({ children }) => {
  const [tab, setTab] = useState('transaction');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate page load (replace with real loading logic if needed)
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Adjust time as needed

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-50">
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white">
          <PacmanLoader />
        </div>
      )}

      <div className={`${isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-500`}>
        {/* 🔁 PERFORMANCE HEADER moved to top full width */}
        <div className="px-6 pt-6">
          <AccountsSidebar />
        </div>

        {/* Main Page Content */}
        <div className="flex">
          <div className="flex-1 flex flex-col h-full pr-6">
            <div className="flex-1 px-6 pb-6 overflow-y-auto min-h-0">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsLayout;

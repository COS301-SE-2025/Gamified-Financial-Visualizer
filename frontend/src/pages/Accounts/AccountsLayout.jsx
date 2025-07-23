import React, { useEffect, useState } from 'react';
import AccountSidebar from '../../layouts/sidebars/AccountsSidebar';
import AccountHeader from '../../layouts/headers/AccountsHeader';
import PacmanLoader from '../../components/loaders/PacmanLoader';

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
    <div className="relative h-screen bg-gray-50">
      {/* Loader overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white">
          <PacmanLoader />
        </div>
      )}

      {/* Page content */}
      <div className={`${isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-500`}>
        <div className="flex h-full overflow-hidden">
          {/* Sidebar */}
          <div className="w-1/4 pl-6 pt-6 pb-6">
            <AccountSidebar />
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col h-full pr-6">
            {/* Header */}
            <div className="p-6">
              <AccountHeader tab={tab} setTab={setTab} />
            </div>

            {/* Scrollable content area */}
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

import React,{useState}from 'react';
import AccountSidebar from '../../layouts/sidebars/AccountsSidebar';
import AccountHeader from '../../layouts/headers/AccountsHeader';

const AccountsLayout = ({ children }) => {
  const [tab, setTab] = useState('transaction'); // or 'main', etc.

  return (
    <div className="h-screen bg-gray-50">
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
  );
};

export default AccountsLayout;

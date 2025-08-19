import React from 'react';
import { Outlet } from 'react-router-dom';
import SupportSidebar from '../../layouts/sidebars/SupportSidebar';
import SupportHeader from '../../layouts/headers/SupportHeader';

const HelpViewLayout = () => {
  return (
    <div className="h-screen bg-gray-50">
      <div className="flex h-full">
        

        {/* Main content with header and scrollable body */}
        <div className="flex-1 flex flex-col h-full pr-6">
          {/* Header */}
          <div className="p-6">
            <SupportHeader />
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpViewLayout;
import React from 'react';
import { Outlet } from 'react-router-dom';

const HelpViewLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex h-full">
        {/* Main content with header and scrollable body */}
        <div className="flex-1 flex flex-col h-full pr-2 sm:pr-4 md:pr-6">
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpViewLayout;
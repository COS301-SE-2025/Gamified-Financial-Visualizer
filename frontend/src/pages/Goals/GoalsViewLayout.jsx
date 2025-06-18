import React from 'react';
import GoalsSidebar from '../../layouts/sidebars/GoalsSidebar';
import GoalsHeader from '../../layouts/headers/GoalsHeader';

const GoalsViewLayout = ({ children }) => {
return (
    <div className="h-screen bg-gray-50">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-1/4 pl-6 pt-6 pb-6"> 
          <GoalsSidebar />
        </div>

        {/* Main content with internal scroll */}
        <div className="flex-1 flex flex-col h-full pr-6">
          {/* Header */}
          <div className="p-6">
            <GoalsHeader />
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalsViewLayout;
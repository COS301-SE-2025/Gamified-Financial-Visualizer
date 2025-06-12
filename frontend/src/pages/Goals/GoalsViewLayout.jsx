import React from 'react';
import GoalsSidebar from '../../layouts/sidebars/GoalsSidebar';
import GoalsHeader from '../../layouts/headers/GoalsHeader';
import NotificationsPanel from '../../components/notifications/NotificationsPanel';

const GoalsViewLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header at the top */}
      <div className="px-6 pt-6 pb-2">
        <GoalsHeader />
      </div>

      {/* Content Row: Sidebar + Main Content */}
      <div className="flex">
        {/* Sidebar with matching top padding */}
        <div className="w-1/4 pl-6 pt-2 pb-6">
          <GoalsSidebar />
        </div>

        {/* Main content aligned with sidebar */}
        <div className="flex-1 pr-6 pt-2 pb-6">
          {children}
        </div>
      </div>

      {/* Notifications overlay (absolute/fixed) */}
      {/* <NotificationsPanel /> */}
    </div>
  );
};

export default GoalsViewLayout;
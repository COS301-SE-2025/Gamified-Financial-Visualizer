// ✅ src/pages/Goals/GoalsListPage.jsx
import React from 'react';
import GoalsHeader from './GoalsHeader';
import GoalsProfileCard from './GoalsProfileCard';
import GoalsLevelCard from './GoalsLevelCard';
import GoalsList from './GoalsList';
import NotificationsPanel from '../CommunityPage/SidebarRight/NotificationsPanel';

const GoalsListPage = () => {
  return (
    <div className="flex gap-4 p-6">
      {/* Left Sidebar */}
      <div className="w-1/4 space-y-4">
        <GoalsHeader />
        <GoalsProfileCard />
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <GoalsLevelCard />

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h4 className="text-md font-semibold text-gray-700 mb-3">Your Goals</h4>
          <GoalsList />
        </div>
      </div>

      {/* Notification Panel */}
      <NotificationsPanel onClose={() => {}} />
    </div>
  );
};

export default GoalsListPage;

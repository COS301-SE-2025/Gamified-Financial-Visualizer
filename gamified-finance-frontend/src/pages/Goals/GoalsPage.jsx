import React, { useState } from 'react';
import GoalsHeader from './GoalsHeader';
import GoalsLevelCard from './GoalsLevelCard';
import GoalsProfileCard from './GoalsProfileCard';
import GoalsStatsPanel from './GoalsStatsPanel';
import GoalsBadgesPanel from './GoalsBadgesPanel';
import GoalsCreateForm from './GoalsCreateForm';
import GoalsList from './GoalsList'; // This can be dynamic
import NotificationsPanel from '../CommunityPage/SidebarRight/NotificationsPanel'; // Create this
import latestBanner from '../../assets/Images/pixelShop.gif';

const GoalsPage = () => {
   const [showNotifications, setShowNotifications] = useState(false);
  return (
    <div className="flex min-h-screen bg-white relative">
      {/* Left Sidebar */}
      <aside className="w-[280px] border-r p-4 flex flex-col gap-6">
        <div>
          <img
            src={latestBanner}
            alt="Latest Goal"
            className="rounded-md mb-2"
          />
          <h2 className="text-center bg-cyan-100 rounded-lg font-normal text-lg text-slate-500">Profile</h2>
        </div>
        <GoalsProfileCard />
        <GoalsStatsPanel />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <GoalsHeader />
        <div className="mt-4">
          <GoalsLevelCard />
        </div>

        {/* Dynamic Content */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GoalsBadgesPanel />
          <GoalsCreateForm />
        </div>

        <div className="mt-6">
          <GoalsList />
        </div>
      </main>

      {/* Notification Panel */}
       <div
        className="fixed bottom-4 right-6 bg-white px-4 py-2 rounded-full shadow-md border flex items-center justify-between w-72 cursor-pointer"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">🔔 Notifications</span>
          <span className="text-xs bg-red-500 text-white rounded-full px-2">6</span>
        </div>
        <span className="text-sm text-gray-500">{showNotifications ? '▾' : '▸'}</span>
      </div>

      {/* Slide-in Notification Panel */}
      {showNotifications && (
        <div className="absolute top-0 right-0 mt-20 w-full z-10">
          <NotificationsPanel onClose={() => setShowNotifications(false)} />
        </div>
      )}
    </div>
  );
};

export default GoalsPage;

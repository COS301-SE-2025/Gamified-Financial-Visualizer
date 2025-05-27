import React, { useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import GoalsHeader from './MainContent/GoalsHeader';
import GoalsLevelCard from './MainContent/GoalsLevelCard';
import GoalsProfileCard from './SidebarLeft/GoalsProfileCard';
import GoalsStatsPanel from './SidebarLeft/GoalsStatsPanel';
import GoalsBadgesPanel from './GoalBadges/GoalsBadgesPanel';
import GoalsCreateForm from './GoalsCreatePage/GoalsCreateForm';
import NotificationsPanel from './SidebarRight/NotificationsPanel';
import GoalsList from './AllMyGoals/GoalsList';
import latestBanner from '../../assets/Images/pixelShop.gif'; 

const GoalsPage = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const { id } = useParams(); // Check if /goals/:id

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

        {id ? (
          <Outlet /> // 🔁 Render detail subpage
        ) : (
          <>
            {/* Default content */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GoalsBadgesPanel />
              <GoalsCreateForm />
            </div>
          </>
        )}
      </main>

      {/* Right Sidebar */}
      <aside className="w-[260px] border-l p-4 flex flex-col gap-4">
        <div
          className="fixed bottom-4 bg-white px-4 py-2 rounded-full shadow-md border flex items-center justify-between cursor-pointer"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">🔔 Notifications</span>
            <span className="text-xs bg-red-500 text-white rounded-full px-2">6</span>
          </div>
          <span className="text-sm text-gray-500">{showNotifications ? '▾' : '▸'}</span>
        </div>

        {/* Sidebar Goals List */}
        <div className="max-h-[calc(100vh-220px)] pr-1 overflow-y-auto">
          <GoalsList filter="ongoing" smallCard={true} />
        </div>
      </aside>

      {/* Notification Panel */}
      {showNotifications && (
        <div className="fixed bottom-4 right-4 z-50">
          <NotificationsPanel onClose={() => setShowNotifications(false)} />
        </div>
      )}
    </div>
  );
};

export default GoalsPage;

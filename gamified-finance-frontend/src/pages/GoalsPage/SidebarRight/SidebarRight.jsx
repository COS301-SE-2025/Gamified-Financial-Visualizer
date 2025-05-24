import React, { useState } from 'react';
import NotificationsPanel from './NotificationsPanel';
import GoalsList from '../AllMyGoals/GoalsList';

const SidebarRight = () => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="w-[320px] flex flex-col h-screen">
      {/* Scrollable Goal List */}
      <div className="flex-1 overflow-y-auto pr-2 pb-24"> {/* padding-bottom for space above toggle */}
        <GoalsList filter="ongoing" />
      </div>

      {/* Toggle Button - pinned to bottom */}
      <div
        className="fixed bottom-4 right-4 bg-white px-4 py-2 rounded-full shadow-md border flex items-center justify-between w-[280px] cursor-pointer z-50"
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
        <NotificationsPanel onClose={() => setShowNotifications(false)} />
      )}
    </div>
  );
};

export default SidebarRight;

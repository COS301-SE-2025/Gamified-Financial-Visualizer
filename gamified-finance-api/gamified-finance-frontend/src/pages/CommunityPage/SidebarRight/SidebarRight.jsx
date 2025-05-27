import React, { useState } from 'react';
import FriendsList from './FriendsList';
import NotificationsPanel from './NotificationsPanel';

const SidebarRight = () => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="relative space-y-4">
      <FriendsList />

      {/* Notification Toggle */}
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

export default SidebarRight;

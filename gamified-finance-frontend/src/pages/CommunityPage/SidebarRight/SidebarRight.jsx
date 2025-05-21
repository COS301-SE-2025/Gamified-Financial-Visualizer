import React, { useState } from 'react';
import FriendsList from './FriendsList';
import NotificationsPanel from './NotificationsPanel';

const SidebarRight = () => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="relative space-y-4">
      <FriendsList />

      {/* Notification Toggle */}
      <button
        onClick={() => setShowNotifications((prev) => !prev)}
        className="w-full text-left p-3 rounded-xl bg-purple-100 text-white-800 font-medium shadow-sm hover:bg-purple-200 transition"
      >
        {showNotifications ? 'Hide Notifications' : 'Show Notifications'}
      </button>

      {/* Slide-in Notification Panel */}
      {showNotifications && (
        <div className="absolute top-0 right-0 mt-20 w-full z-10">
          <NotificationsPanel />
        </div>
      )}
    </div>
  );
};

export default SidebarRight;

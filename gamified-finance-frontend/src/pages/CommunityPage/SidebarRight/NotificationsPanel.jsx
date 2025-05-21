import React from 'react';

const notifications = [
  {
    type: 'badge',
    message: 'You earned the "Investor" badge!',
    icon: '🏅',
  },
  {
    type: 'comment',
    message: 'Someone commented on your Bali Trip goal.',
    icon: '💬',
  },
  {
    type: 'invite',
    message: 'New invite to PC Build Club.',
    icon: '📩',
  },
];

const NotificationsPanel = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md space-y-3">
      <h4 className="text-lg font-semibold text-purple-600">Notifications</h4>
      {notifications.map((note, index) => (
        <div
          key={index}
          className="flex items-center space-x-3 border-l-4 border-purple-400 pl-3 py-2 bg-gray-50 rounded-md"
        >
          <span className="text-xl">{note.icon}</span>
          <p className="text-sm text-gray-700">{note.message}</p>
        </div>
      ))}
    </div>
  );
};

export default NotificationsPanel;

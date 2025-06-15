import React from 'react';

const notifications = [
  { id: 1, message: "🏆 You completed your 'Laptop Fund' goal!" },
  { id: 2, message: "🎉 You've earned 100 XP for setting a new goal!" },
  { id: 3, message: "⏳ Your 'Vacation' goal is halfway there!" },
];

const NotificationsPanel = () => {
  return (
    <div className="fixed bottom-4 right-4 w-80 max-h-72 overflow-y-auto bg-white border border-gray-300 rounded-xl shadow-lg p-4 z-50">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">🔔 Notifications</h3>
      <ul className="space-y-2">
        {notifications.map((note) => (
          <li key={note.id} className="bg-gray-100 text-sm p-2 rounded-md shadow-sm text-gray-700">
            {note.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsPanel;

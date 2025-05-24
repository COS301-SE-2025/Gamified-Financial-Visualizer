import React from 'react';

const notifications = [
  {
    id: 1,
    type: 'friend_request',
    name: 'Lebo',
    avatar: require('../../../assets/Images/pixelPorch.gif'),
    message: 'wants to be friends with you.',
  },
  {
    id: 2,
    type: 'info',
    name: 'GTA 6 Preppers',
    avatar: require('../../../assets/Images/pixelStore.jpeg'),
    message: 'Goal reached 80% milestone!',
  },
  {
    id: 3,
    type: 'friend_request',
    name: 'Jordan',
    avatar: require('../../../assets/Images/pixelPond.jpeg'),
    message: 'sent you a friend request.',
  },
  {
    id: 4,
    type: 'info',
    name: 'Bali Trip',
    avatar: require('../../../assets/Images/pixelToy.gif'),
    message: 'New comment on your update.',
  },
];

const NotificationsPanel = ({ onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-xl shadow-2xl border p-4 space-y-3 z-50 animate-slideInUp">
      {/* Header */}
      <div className="relative mb-2 text-center">
        <h4 className="text-lg font-semibold text-orange-500">Notifications</h4>
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-red-400 hover:text-red-600 text-xl"
        >
          ❌
        </button>
      </div>

      {/* Notification Items */}
      {notifications.map((note) => (
        <div
          key={note.id}
          className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-full shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <img
              src={note.avatar}
              alt={note.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="text-xs text-gray-700 leading-tight">
              <p className="font-medium">{note.name}</p>
              <p className="text-gray-500">{note.message}</p>
            </div>
          </div>

          <div className="flex space-x-2">
            {note.type === 'friend_request' ? (
              <>
                <button className="text-green-500 text-sm hover:scale-110">✔️</button>
                <button className="text-red-500 text-sm hover:scale-110">❌</button>
              </>
            ) : (
              <button className="bg-green-200 text-green-800 text-xs px-3 py-1 rounded-full hover:bg-green-300 transition">
                View
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationsPanel;

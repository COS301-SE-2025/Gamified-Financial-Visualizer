import React from 'react';
import user1 from '../../../assets/Images/pixelBar.jpeg';
import user2 from '../../../assets/Images/pixelDesk.jpeg';
import user3 from '../../../assets/Images/pixelPond.jpeg';
import user4 from '../../../assets/Images/pixelMoonLight.jpeg';

const friends = [
  { name: 'Nobuhle', avatar: user1, progress: 42.1 },
  { name: 'Malaika', avatar: user2, progress: 23.9 },
  { name: 'Aundrea', avatar: user3, progress: 60.8 },
  { name: 'Amantle', avatar: user4, progress: 51.9 },
];

const getColor = (progress) => {
  if (progress < 30) return '#f97316'; // orange
  if (progress < 60) return '#facc15'; // yellow
  if (progress < 90) return '#60a5fa'; // blue
  return '#4ade80'; // green
};

const CommunityFriendsList = () => {
  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm">
      <h4 className="text-sm font-semibold text-gray-700 mb-4">Community Friends</h4>
      <div className="flex flex-wrap gap-6 justify-center">
        {friends.map((friend, idx) => (
          <div key={idx} className="flex flex-col items-center text-center space-y-1">
            {/* Donut Progress Wrapper */}
            <div
              className="relative w-20 h-20 rounded-full"
              style={{
                background: `conic-gradient(${getColor(friend.progress)} ${friend.progress}%, #e5e7eb ${friend.progress}% 100%)`,
              }}
            >
              {/* Inner Avatar */}
              <div className="absolute top-1/2 left-1/2 w-14 h-14 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center overflow-hidden">
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>

            {/* Name & Progress */}
            <p className="text-sm font-medium text-gray-800">{friend.name}</p>
            <p className="text-xs font-medium text-blue-500">{friend.progress}%</p>

            {/* Invite Button */}
            <button className="text-xs text-blue-500 border border-blue-300 rounded-full px-3 py-0.5 hover:bg-blue-50">
              Invite
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityFriendsList;

import React from 'react';
import { FaTrophy } from 'react-icons/fa';

// User Avatars 
import avatar1 from '../../assets/Images/avatars/beachAvatar.jpeg';
import avatar2 from '../../assets/Images/avatars/ghostAvatar.jpeg';
import avatar3 from '../../assets/Images/avatars/windowAvatar.jpeg';
import avatar4 from '../../assets/Images/avatars/butterflyAvatar.jpeg';
import avatar5 from '../../assets/Images/avatars/crossiontAvatar.jpeg';
import avatar6 from '../../assets/Images/avatars/cottageAvatar.jpeg';

// Medals
import goldMedal from '../../assets/Images/badges/goldMedal.png';
import silverMedal from '../../assets/Images/badges/silverMedal.png';
import bronzeMedal from '../../assets/Images/badges/bronzeMedal.png';

const mockLeaderboard = [
  { username: 'ayaka', level: 'Platinum', xp: 5600, avatar: avatar1 },
  { username: 'moonrider', level: 'Gold', xp: 4800, avatar: avatar2 },
  { username: 'zuluX', level: 'Silver', xp: 3700, avatar: avatar3 },
  { username: 'andy_handy', level: 'Silver', xp: 2100, avatar: avatar4 },
  { username: 'lily', level: 'Bronze', xp: 1450, avatar: avatar5 },
  { username: 'big_man', level: 'Wood', xp: 820, avatar: avatar6 },
];

const getMedalIcon = (rank) => {
  if (rank === 0) return goldMedal;
  if (rank === 1) return silverMedal;
  if (rank === 2) return bronzeMedal;
  return null;
};

const LeaderboardPanel = () => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow space-y-2">
      <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2 border-b pb-3">
        <FaTrophy className="text-[#FBBF24]" /> Leaderboard
      </h3>

      {mockLeaderboard.map((user, i) => (
        <div
          key={i}
          className="flex items-start py-3 border-b last:border-b-0 gap-3"
        >
          <img
            src={user.avatar}
            alt={user.username}
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800 leading-tight">{user.username}</span>
            <span className="text-xs text-gray-500 leading-tight mb-1">{user.level}</span>
            <div className="flex items-center gap-2 mt-1">
              {i < 3 && (
                <img
                  src={getMedalIcon(i)}
                  alt="medal"
                  className="w-5 h-5 object-contain"
                />
              )}
              <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">{user.xp} XP</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeaderboardPanel;

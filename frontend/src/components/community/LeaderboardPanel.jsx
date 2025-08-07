import React, { useEffect, useState } from 'react';
import { FaTrophy } from 'react-icons/fa';

// Medals
import goldMedal from '../../assets/Images/medals/goldMedal.png';
import silverMedal from '../../assets/Images/medals/silverMedal.png';
import bronzeMedal from '../../assets/Images/medals/bronzeMedal.png';
import avatar from '../../assets/Images/avatars/Ramen.png';

// Utility for top 3 medals
const getMedalIcon = (rank) => {
  if (rank === 0) return goldMedal;
  if (rank === 1) return silverMedal;
  if (rank === 2) return bronzeMedal;
  return null;
};

const LeaderboardPanel = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/community/leaderboard')
      .then(res => res.json())
      .then(data => setLeaderboard(data.data || []))
      .catch(err => console.error('Failed to load leaderboard:', err));
  }, []);

  return (
    <div className="bg-white p-5 rounded-2xl shadow space-y-2 dark:bg-gray-800">
      <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2 border-b pb-3 dark:text-gray-200 dark:border-gray-700">
        <FaTrophy className="text-[#FBBF24]" /> Leaderboard
      </h3>

      {leaderboard.map((user, i) => (
        <div
          key={user.username}
          className="flex items-start py-3 border-b last:border-b-0 gap-4 dark:border-gray-700"
        >
          {/* Rank */}
          <span className="text-sm font-bold text-gray-600 w-6 text-right dark:text-gray-400">#{user.rank}</span>

          {/* Avatar */}
          <img
            src={`/assets/Images/${user.avatar_image_path}` || avatar}
            alt={user.username}
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
          />

          {/* Info */}
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800 leading-tight dark:text-gray-200">{user.username}</span>
            <span className="text-xs text-gray-500 leading-tight mb-1 dark:text-gray-400">{user.tier_status}</span>
            <div className="flex items-center gap-2 mt-1">
              {getMedalIcon(i) && (
                <img src={getMedalIcon(i)} alt="medal" className="w-5 h-5 object-contain" />
              )}
              <span className="text-sm font-semibold text-gray-800 whitespace-nowrap dark:text-gray-200">
                {user.total_points} XP
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeaderboardPanel;
// src/pages/Community/FriendsList.jsx
import React from 'react';
import CommunityLayout from '../../pages/Community/CommunityLayout';
import CommunityHeader from '../../layouts/headers/CommunityHeader';
import { FaSearch, FaUserPlus, FaFire, FaCrown, FaMedal, FaAward } from 'react-icons/fa';

const mockFriends = [
  {
    username: 'moonrider',
    xp: 3400,
    level: 'Gold',
    avatar: '/images/avatars/moon.png',
    status: 'Online',
    streak: 21,
    achievements: 5
  },
  {
    username: 'satoshi_nak',
    xp: 2800,
    level: 'Silver',
    avatar: '/images/avatars/satoshi.png',
    status: 'Offline',
    streak: 7,
    achievements: 3
  },
  {
    username: 'ayaka',
    xp: 4100,
    level: 'Platinum',
    avatar: '/images/avatars/ayaka.png',
    status: 'Online',
    streak: 42,
    achievements: 8
  },
  {
    username: 'crypto_queen',
    xp: 5200,
    level: 'Diamond',
    avatar: '/images/avatars/queen.png',
    status: 'Online',
    streak: 35,
    achievements: 10
  },
  {
    username: 'bitcoiner',
    xp: 1900,
    level: 'Bronze',
    avatar: '/images/avatars/bitcoin.png',
    status: 'Offline',
    streak: 3,
    achievements: 1
  },
  {
    username: 'fiat_hater',
    xp: 3800,
    level: 'Gold',
    avatar: '/images/avatars/fiat.png',
    status: 'Online',
    streak: 28,
    achievements: 6
  },
];

const getLevelBadgeColor = (level) => {
  switch(level) {
    case 'Bronze': return 'bg-[#CD7F32]';
    case 'Silver': return 'bg-[#C0C0C0]';
    case 'Gold': return 'bg-[#FFD700]';
    case 'Platinum': return 'bg-[#E5E4E2]';
    case 'Diamond': return 'bg-[#B9F2FF]';
    default: return 'bg-gray-400';
  }
};

const FriendsList = () => {
  return (
    <CommunityLayout>
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <CommunityHeader />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Friends List</h2>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search friends..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#72C1F5] focus:border-transparent"
              />
            </div>
            <button className="flex items-center gap-2 bg-gradient-to-r from-[#72C1F5] to-[#B1E1FF] text-white px-4 py-2 rounded-full text-sm font-medium shadow hover:shadow-md transition">
              <FaUserPlus /> Add Friend
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockFriends.map((friend, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-2xl shadow border border-gray-100 hover:shadow-md transition hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={friend.avatar}
                    alt={friend.username}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div className={`absolute -bottom-2 -right-2 ${getLevelBadgeColor(friend.level)} text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1`}>
                    {friend.level === 'Platinum' && <FaCrown size={10} />}
                    {friend.level === 'Diamond' && <FaAward size={10} />}
                    {friend.level}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <span className="text-lg font-semibold text-gray-800">@{friend.username}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      friend.status === 'Online' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {friend.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500">XP: {friend.xp.toLocaleString()}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="flex items-center gap-1 text-sm text-amber-600">
                      <FaFire size={12} /> {friend.streak}d
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="flex items-center gap-1 text-sm text-purple-600">
                      <FaMedal size={12} /> {friend.achievements}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                    <div 
                      className="bg-gradient-to-r from-[#72C1F5] to-[#B1E1FF] h-2 rounded-full" 
                      style={{ width: `${Math.min(100, (friend.xp / 6000) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg text-sm font-medium transition">
                  Message
                </button>
                <button className="flex-1 bg-[#f8fafc] hover:bg-gray-100 border border-gray-200 text-gray-800 py-2 rounded-lg text-sm font-medium transition">
                  Compare
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-6">
          <button className="bg-white border border-gray-200 text-gray-700 px-6 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition">
            Load More Friends
          </button>
        </div>
      </div>
    </CommunityLayout>
  );
};

export default FriendsList;
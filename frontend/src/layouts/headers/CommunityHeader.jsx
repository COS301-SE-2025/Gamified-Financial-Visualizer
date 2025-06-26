// src/layouts/headers/GoalsHeader.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaFire, FaUsers, FaUserFriends, FaThLarge } from 'react-icons/fa';

const CommunityHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white border-b shadow rounded-xl">

      {/* Search Input */}
      {/* Removed this functionality for the time being */}

      {/*Action Buttons */}
      <div className="flex space-x-2 ml-4">
        <button
          onClick={() => navigate('/community')}
          className={`px-4 py-2 border rounded-xl shadow flex items-center gap-2 transition-all duration-200 ${path === '/community' ? 'bg-[#88BC46] text-white' : 'bg-white text-gray-600'
            }`}
        >
          <FaUsers /> Posts
        </button>

        <button
          onClick={() => navigate('/community/list')}
          className={`px-4 py-2 border rounded-xl shadow flex items-center gap-2 transition-all duration-200 ${path === '/community/list' ? 'bg-[#88BC46] text-white' : 'bg-white text-gray-600'
            }`}
        >
          <FaThLarge /> Community
        </button>

        <button
          onClick={() => navigate('/community/friends')}
          className={`px-4 py-2 border rounded-xl shadow flex items-center gap-2 transition-all duration-200 ${path === '/community/friends' ? 'bg-[#88BC46] text-white' : 'bg-white text-gray-600'
            }`}
        >
          <FaUserFriends /> Friends
        </button>

        <button
          onClick={() => navigate('/community/challenges')}
          className={`px-4 py-2 border rounded-xl shadow flex items-center gap-2 transition-all duration-200 ${path === '/community/challenges' ? 'bg-[#88BC46] text-white' : 'bg-white text-gray-600'
            }`}
        >
          <FaFire /> Challenges
        </button>
      </div>
    </div>
  );
};

export default CommunityHeader;

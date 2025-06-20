// src/layouts/headers/GoalsHeader.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaListUl, FaBullseye, FaPlus } from 'react-icons/fa';

const CommunityHeader= () => {
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname;
    return (
      <div className="flex justify-between items-center px-6 py-4 bg-white border-b shadow rounded-xl">

        {/*Search Input */}
        <div className="flex items-center w-full max-w-4xl -ml-[14px] px-4 py-2 rounded-3xl border-4 border-[#E5794B] bg-white shadow-sm">
          <FaSearch className="text-[#E5794B] mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full outline-none bg-transparent text-sm text-[#E5794B] placeholder-[#E5794B]/70"
          />
        </div>

        {/*Action Buttons */}
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => navigate('/community')}
            className={`px-4 py-2 border rounded-xl shadow flex items-center gap-2 transition-all duration-200 ${path === '/community' ? 'bg-[#88BC46] text-white' : 'bg-white text-gray-600'
              }`}
          >
            <FaBullseye /> Community
          </button>

          <button
            onClick={() => navigate('/community/friends')}
            className={`px-4 py-2 border rounded-xl shadow flex items-center gap-2 transition-all duration-200 ${path === '/community/friends' ? 'bg-[#88BC46] text-white' : 'bg-white text-gray-600'
              }`}
          >
            <FaBullseye /> Friends
          </button>

          <button
            onClick={() => navigate('/community/challenges')}
            className={`px-4 py-2 border rounded-xl shadow flex items-center gap-2 transition-all duration-200 ${path === '/community/challenges' ? 'bg-[#88BC46] text-white' : 'bg-white text-gray-600'
              }`}
          >
            <FaListUl /> Challenges
          </button>

          <button
            onClick={() => navigate('/community/list')}
            className={`px-4 py-2 border rounded-xl shadow flex items-center gap-2 transition-all duration-200 ${path === '/community/list' ? 'bg-[#88BC46] text-white' : 'bg-white text-gray-600'
              }`}
          >
            <FaListUl /> All
          </button>
        </div>
      </div>
    );
  };

export default CommunityHeader;

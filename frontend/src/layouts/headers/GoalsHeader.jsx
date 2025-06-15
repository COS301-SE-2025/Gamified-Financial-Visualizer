import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaListUl, FaBullseye } from 'react-icons/fa';

const GoalsHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="flex justify-between rounded-xl items-center space-x-4 px-6 py-4 bg-[#ffffff] border-b shadow">
      {/* 🔍 Search Input */}
      <div className="flex items-center w-full bg-white px-3 py-2 rounded-xl shadow border max-w-md">
        <FaSearch className="text-[#E5794B] mr-2" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full outline-none bg-transparent text-sm text-[#E5794B]"
        />
      </div>

      {/* 🧭 Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => navigate('/goals/create')}
          className={`px-4 py-2 border rounded-xl shadow flex items-center gap-2 transition-all duration-200 ${
            path.includes('/goals/create') ? 'bg-[#88BC46] text-white' : 'bg-white text-gray-600'
          }`}
        >
          <FaBullseye className="text-md" /> Create Goal
        </button>

        <button
          onClick={() => navigate('/goals')}
          className={`px-4 py-2 border rounded-xl shadow flex items-center gap-2 transition-all duration-200 ${
            path === '/goals' ? 'bg-[#88BC46] text-white' : 'bg-white text-gray-600'
          }`}
        >
          <FaListUl className="text-md" /> View All
        </button>
      </div>
    </div>
  );
};

export default GoalsHeader;
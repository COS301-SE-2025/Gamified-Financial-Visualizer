import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaListUl, FaPlus } from 'react-icons/fa';

const GoalsHeader = () => {
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
          onClick={() => navigate('/goals')}
          className={`px-4 py-2 border rounded-xl shadow flex items-center gap-2 transition-all duration-200 ${path === '/goals' ? 'bg-[#88BC46] text-white' : 'bg-white text-gray-600'
            }`}
        >
          <FaListUl /> View
        </button>

        <button
          onClick={() => navigate('/goals/create')}
          className={`px-4 py-2 border rounded-xl shadow flex items-center gap-2 transition-all duration-200 ${path === '/goals/create' ? 'bg-[#88BC46] text-white' : 'bg-white text-gray-600'
            }`}
        >
          <FaPlus /> Create
        </button>


      </div>
    </div>
  );
};

export default GoalsHeader;


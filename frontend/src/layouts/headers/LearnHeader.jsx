import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {  
  FaBook,         // For All courses
  FaCheckCircle,  // For Completed
  FaClock        // For Incomplete
} from 'react-icons/fa';

const AccountsHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname; 

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white border-b shadow rounded-xl">
      {/* Search Input */}
      {/* Removed this functionality for the time being */}

      {/* Action Buttons */}
      <div className="flex space-x-2 ml-4">
        <button 
          onClick={() => navigate('/learn')}
          className={`px-4 py-2 border rounded-xl shadow flex items-center gap-2 transition-all duration-200 ${
            path === '/learn' ? 'bg-[#88BC46] text-white' : 'bg-white text-gray-600'
          }`}
        >
          <FaBook /> All 
        </button>

        <button 
          onClick={() => navigate('/learn/complete')}
          className={`px-4 py-2 border rounded-xl shadow flex items-center gap-2 transition-all duration-200 ${
            path === '/learn/complete' ? 'bg-[#88BC46] text-white' : 'bg-white text-gray-600'
          }`}
        >
          <FaCheckCircle /> Completed 
        </button>

        <button 
          onClick={() => navigate('/learn/incomplete')}
          className={`px-4 py-2 border rounded-xl shadow flex items-center gap-2 transition-all duration-200 ${
            path === '/learn/incomplete' ? 'bg-[#88BC46] text-white' : 'bg-white text-gray-600'
          }`}
        >
          <FaClock /> Incomplete
        </button>
      </div>
    </div>
  );
};

export default AccountsHeader;
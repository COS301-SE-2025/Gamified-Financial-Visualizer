import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaInfoCircle, FaQuestionCircle, FaPlayCircle, FaBookOpen } from 'react-icons/fa';

const GoalsHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white border-b shadow rounded-xl">
      {/*Action Buttons */}
      <div className="flex space-x-2 ml-4">

        {/* Main Help Page route */}
        <button
          onClick={() => navigate('/support')}
          className={`px-4 py-2 border rounded-xl shadow flex items-center gap-2 transition-all duration-200 ${path === '/support' ? 'bg-[#88BC46] text-white' : 'bg-white text-gray-600'
            }`}
        >
          <FaQuestionCircle /> Help Center
        </button>

        {/* FAQ Page route */}
        <button
         onClick={() => navigate('/support/faqs')}
          className={`px-4 py-2 border rounded-xl shadow flex items-center gap-2 transition-all duration-200 ${path === '/support/faqs' ? 'bg-[#88BC46] text-white' : 'bg-white text-gray-600'
            }`}
        >
          <FaInfoCircle />FAQ
        </button>

        {/* FAQ Page route */}
        <button
         onClick={() => navigate('/support/overview')}
          className={`px-4 py-2 border rounded-xl shadow flex items-center gap-2 transition-all duration-200 ${path === '/support/overview' ? 'bg-[#88BC46] text-white' : 'bg-white text-gray-600'
            }`}
        >
          <	FaBookOpen /> Help Details
        </button>

        {/* Tutorial Page route */}
        <button
          onClick={() => navigate('/support/tutorials')}
          className={`px-4 py-2 border rounded-xl shadow flex items-center gap-2 transition-all duration-200 ${path === '/support/tutorials' ? 'bg-[#88BC46] text-white' : 'bg-white text-gray-600'
            }`}
        >
          <FaPlayCircle  /> Tutorial
        </button>
      </div>
    </div>
  );
};

export default GoalsHeader;

// onClick={() => navigate('/goals/create')}
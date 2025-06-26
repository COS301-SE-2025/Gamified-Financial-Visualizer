import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSlidersH, FaChartLine, FaFileImport, FaChartBar } from 'react-icons/fa';

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
          onClick={() => navigate('/transactions')}
          className={`px-4 py-2 border rounded-xl shadow flex items-center gap-2 transition-all duration-200 ${
            path === '/transactions' ? 'bg-[#88BC46] text-white' : 'bg-white text-gray-600'
          }`}
        >
          <FaChartBar /> Accounts
        </button>

        <button 
          onClick={() => navigate('/transactions/budget')}
          className={`px-4 py-2 border rounded-xl shadow flex items-center gap-2 transition-all duration-200 ${
            path === '/transactions/budget' ? 'bg-[#88BC46] text-white' : 'bg-white text-gray-600'
          }`}
        >
          <FaSlidersH /> Budgets
        </button>

        <button 
          onClick={() => navigate('/transactions/insights')}
          className={`px-4 py-2 border rounded-xl shadow flex items-center gap-2 transition-all duration-200 ${
            path === '/transactions/insights' ? 'bg-[#88BC46] text-white' : 'bg-white text-gray-600'
          }`}
        >
          <FaChartLine /> Insights
        </button>

        <button 
          onClick={() => navigate('/transactions/import')}
          className={`px-4 py-2 border rounded-xl shadow flex items-center gap-2 transition-all duration-200 ${
            path === '/transactions/import' ? 'bg-[#88BC46] text-white' : 'bg-white text-gray-600'
          }`}
        >
          <FaFileImport /> Import
        </button>
      </div>
    </div>
  );
};

export default AccountsHeader;
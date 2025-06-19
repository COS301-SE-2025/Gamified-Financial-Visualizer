import React from 'react';
import { FaSearch, FaSlidersH, FaChartLine, FaFileImport } from 'react-icons/fa';

const LearnHeader = ({ tab, setTab }) => {
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
          onClick={() => setTab('main')}
          className={`px-4 py-2 border rounded-xl shadow flex items-center gap-2 transition-all duration-200 ${
            tab === 'main' ? 'bg-[#88BC46] text-white' : 'bg-white text-gray-600'
          }`}
        >
          <FaSlidersH /> Budget
        </button>

        <button
          onClick={() => setTab('insights')}
          className={`px-4 py-2 border rounded-xl shadow flex items-center gap-2 transition-all duration-200 ${
            tab === 'insights' ? 'bg-[#88BC46] text-white' : 'bg-white text-gray-600'
          }`}
        >
          <FaChartLine /> Insights
        </button>

        <button
          onClick={() => setTab('import')}
          className={`px-4 py-2 border rounded-xl shadow flex items-center gap-2 transition-all duration-200 ${
            tab === 'import' ? 'bg-[#88BC46] text-white' : 'bg-white text-gray-600'
          }`}
        >
          <FaFileImport /> Import
        </button>
      </div>
    </div>
  );
};

export default LearnHeader;

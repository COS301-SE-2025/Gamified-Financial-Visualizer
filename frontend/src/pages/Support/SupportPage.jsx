import React, { useState } from 'react';
import { FaSearch, FaPlus, FaMinus } from 'react-icons/fa';

const SupportPage = () => {
  // ⬇️ Component: SearchBar
  const SearchBar = () => (
    <div className="flex items-center bg-white shadow-inner rounded-full px-4 py-2 w-full max-w-md">
      <FaSearch className="text-red-400 mr-2" />
      <input
        type="text"
        placeholder="Search..."
        className="w-full focus:outline-none text-sm text-gray-700 placeholder-red-400"
      />
    </div>
  );

  // ⬇️ Component: FAQAccordion
  const FAQAccordion = ({ title }) => {
    const [openIndex, setOpenIndex] = useState(null);
    const faqs = [
      'Lorem ipsum dolor sit ame',
      'Lorem ipsum dolor sit ame',
      'Lorem ipsum dolor sit ame',
      'Lorem ipsum dolor sit ame, consectetur adipiscing elit, sed do eiusmod tempor incididunt.'
    ];
    const toggleIndex = (index) => {
      setOpenIndex(openIndex === index ? null : index);
    };

    return (
      <div>
        <h2 className="text-green-700 text-xl font-semibold mb-2">{title}</h2>
        <div className="space-y-1">
          {faqs.map((text, index) => (
            <div
              key={index}
              className="border-b border-green-300 py-1 flex justify-between items-start text-sm text-gray-700 cursor-pointer"
              onClick={() => toggleIndex(index)}
            >
              <p className={`flex-1 transition-all duration-300 ${openIndex === index ? 'pr-2' : 'truncate'}`}>
                {text}
              </p>
              <span className="text-green-600 pt-1 pr-1">
                {openIndex === index ? <FaMinus /> : <FaPlus />}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ⬇️ Component: TableOfContents
  const TableOfContents = () => {
    const items = [
      'Goals',
      'Community Life',
      'Transactions',
      'Challenges',
      'Point Tracking',
      'Achievements & Badges',
      'Learning'
    ];

    return (
      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-green-700 font-semibold text-lg mb-3">Table of Contents</h2>
        <ul className="space-y-2 text-sm">
          {items.map((item) => (
            <li key={item} className="text-green-900 border-l-4 border-transparent pl-2 hover:border-green-500 hover:text-blue-500 transition-all">
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // ⬇️ Main Return
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      <div className="flex flex-row flex-grow p-6 gap-6">
        {/* Left Sidebar */}
        <aside className="w-1/4 space-y-6">
          {/* Placeholder blocks for: XP ring, badges, and stats */}
          <div className="bg-white rounded-2xl p-4 shadow text-center">
            <p className="text-sm font-semibold mb-2">Overall Performance</p>
            <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-blue-800">560</span>
            </div>
            <p className="text-xs mt-2 text-gray-500">Lv 3: Silver</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow">
            <p className="text-sm font-semibold mb-2">Badges</p>
            <div className="flex justify-around items-center">
              <img src="/images/coin.svg" alt="badge" className="w-8 h-8" />
              <img src="/images/plant.svg" alt="badge" className="w-8 h-8" />
              <img src="/images/pray.svg" alt="badge" className="w-8 h-8" />
              <img src="/images/trophy.svg" alt="badge" className="w-8 h-8" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow">
            <p className="text-sm font-semibold mb-2">Overall Statistics</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-center">
              <div className="bg-red-50 p-2 rounded">55 Quizzes</div>
              <div className="bg-green-50 p-2 rounded">83% Accuracy</div>
              <div className="bg-blue-50 p-2 rounded">#2 Leaderboard</div>
              <div className="bg-yellow-50 p-2 rounded">14 Goals</div>
              <div className="bg-orange-50 p-2 rounded">56% Badges</div>
              <div className="bg-pink-50 p-2 rounded">#7 Challenger</div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-6">
          <div className="flex justify-between items-center">
            <SearchBar />
            <div className="space-x-4">
              <button className="px-4 py-2 bg-white rounded shadow text-sm">Questions</button>
              <button className="px-4 py-2 bg-white rounded shadow text-sm">Tutorial</button>
            </div>
          </div>

          <div className="space-y-8">
            <FAQAccordion title="Goals" />
            <FAQAccordion title="Community Life" />
            <FAQAccordion title="Transactions" />
            <FAQAccordion title="Challenges" />
            <FAQAccordion title="Point Tracking" />
            <FAQAccordion title="Achievements & Badges" />
            <FAQAccordion title="Learning" />
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-1/5">
          <TableOfContents />
        </aside>
      </div>
    </div>
  );
};

export default SupportPage;

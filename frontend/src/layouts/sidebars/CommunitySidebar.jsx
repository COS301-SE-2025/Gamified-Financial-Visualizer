import React from 'react';
import avatar from '../../assets/Images/avatars/totoroAvatar.jpeg';

// Badge Icons
import badgeCoins from '../../assets/Images/badges/CoinStack.png';
import badgePlant from '../../assets/Images/badges/plantIocn.png';
import badgeHighfive from '../../assets/Images/badges/highFiveIcon.png';
import badgeTrophy from '../../assets/Images/badges/awardIcon.png';

import {
  FaBolt,
  FaChartBar,
  FaHourglassHalf,
  FaCheck,
  FaTimes,
  FaBan,
} from 'react-icons/fa';

const CommunitySidebar = () => {
  return (
    <aside className="space-y-6">
      {/* Goal Performance */}
      <div className="bg-white rounded-2xl p-4 shadow text-center">
        <p className="text-sm font-semibold text-[#4A5568] bg-[#D6EAFE] px-3 py-1 rounded-full inline-block mb-2">
          Goal Performance
        </p>

        {/* Progress Circle Styling */}
        <div className="relative w-40 h-40 mx-auto">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Background Circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#E8F0FA"
              strokeWidth="10"
            />
            {/* Foreground Arc */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="10"
              strokeDasharray="270"  /* ~75% of 2πr */
              strokeDashoffset="67"
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#93C5FD" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[24px] font-bold text-[#2D3748]">350</p>
            <p className="text-sm text-[#718096]">Excellent</p>
            <img
              src={avatar}
              alt="Silver Level"
              className="w-8 h-8 mt-1 rounded-full object-cover"
            />
          </div>

          {/* Top Blue Dot */}
          <div className="absolute top-[6px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-blue-400 rounded-full" />
          </div>
        </div>
        <p className="text-sm text-[#F56565] mt-2 font-medium">Lv 3: Silver</p>
      </div>

      {/* Badges */}
      <div className="bg-white rounded-2xl p-4 shadow text-center">
        <p className="text-sm font-semibold text-[#4A5568] bg-[#D6EAFE] px-3 py-1 rounded-full inline-block mb-3">
          Badges
        </p>
        <div className="flex justify-between items-center px-2">
          {[badgeCoins, badgePlant, badgeHighfive, badgeTrophy].map((src, i) => (
            <div
              key={i}
              className="w-16 h-16 bg-white rounded-full shadow-md border border-gray-200 flex items-center justify-center"
            >
              <img
                src={src}
                alt={`Badge ${i}`}
                className="w-16 h-16 rounded-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Goal Statistics */}
      <div className="bg-white rounded-2xl p-4 shadow">
        <p className="text-sm font-semibold text-[#4A5568] bg-[#D6EAFE] px-4 py-1 rounded-full inline-block mb-4">
          Goal Statistics
        </p>

        <div className="grid grid-cols-2 gap-4">
          {[
            { value: '14', label: 'Goals', icon: <FaBolt />, color: '#FF8A8A' },
            { value: '83%', label: 'Completed', icon: <FaCheck />, color: '#7FDD53' },
            { value: '12', label: 'Inactive', icon: <FaChartBar />, color: '#5FBFFF' },
            { value: '14', label: 'In-Progress', icon: <FaHourglassHalf />, color: '#FFC541' },
            { value: '56%', label: 'Incomplete', icon: <FaTimes />, color: '#F68D2B' },
            { value: '7', label: 'Cancelled', icon: <FaBan />, color: '#FF7F9E' },
          ].map(({ value, label, icon, color }, i) => (
            <div key={i} className="relative bg-white rounded-xl shadow-md p-3 flex items-center justify-between">
              {/* Icon Bubble */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: color + '20' }} // Light version of color
              >
                <div className="text-white" style={{ color }}>
                  {icon}
                </div>
              </div>

              {/* Stat Content */}
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>

              {/* Bottom Bar */}
              <div
                className="absolute bottom-0 left-0 h-[5px] w-full rounded-b-xl"
                style={{ backgroundColor: color }}
              />
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default CommunitySidebar;

// import React from 'react';
import avatar from '../../assets/Images/avatars/totoroAvatar.jpeg';

import React, { useEffect, useState } from 'react';

import {
  FaBolt,
  FaChartBar,
  FaHourglassHalf, 
  FaCheck,
  FaTimes, 
  FaBan,
} from 'react-icons/fa';

const ProfileSidebar = () => {

  const [sidebarStats, setSidebarStats] = useState(null);
  const [performanceSummary, setPerformanceSummary] = useState(null);

  useEffect(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user?.id) return;

  fetch(`http://localhost:5000/api/auth/sidebar/${user.id}`)
    .then(res => res.json())
    .then(data => setSidebarStats(data.data))
    .catch(err => console.error('Sidebar stats error:', err));

  fetch(`http://localhost:5000/api/auth/profile/performance-summary/${user.id}`)
    .then(res => res.json())
    .then(data => setPerformanceSummary(data.data))
    .catch(err => console.error('Performance summary error:', err));
}, []);

  return (
    <aside className="space-y-6">
      {/* Goal Performance */}
      <div className="bg-white rounded-2xl p-4 shadow text-center">
        <p className="text-sm font-semibold text-[#4A5568] bg-[#D6EAFE] px-3 py-1 rounded-full inline-block mb-2">
          Overall Performance
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
              strokeDasharray="282.6" // Circumference = 2πr = 2π×45
              strokeDashoffset={
                performanceSummary?.performance_score !== undefined
                  ? 282.6 - (performanceSummary.performance_score / 1000) * 282.6
                  : 282.6
              }
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
            <defs>
              <linearGradient id="gradient" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#93C5FD" />
              </linearGradient>
            </defs>
          </svg>


          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[24px] font-bold text-[#2D3748]">
              {performanceSummary?.performance_score ?? '0'}
            </p>
            <p className="text-sm text-[#718096]">
              {performanceSummary?.performance_label ?? '0'}
            </p>
            <img
              src={
                performanceSummary?.avatar_image_path
                  ? `/assets/Images/${performanceSummary.avatar_image_path}`
                  : avatar
              }
              alt="User Avatar"
              className="w-8 h-8 mt-1 rounded-full object-cover"
            />
          </div>

          {/* Top Blue Dot */}
          <div className="absolute top-[6px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-blue-400 rounded-full" />
          </div>
          </div>

          {/* Level and Tier */}
          <p className="text-sm text-[#F56565] mt-2 font-medium">
            Lv {performanceSummary?.level_number ?? '?'}: {performanceSummary?.tier_level ?? '0'}
          </p>
      </div>

      {/* Goal Statistics */}
      <div className="bg-white rounded-2xl p-4 shadow text-center">
        <p className="text-sm font-semibold text-[#4A5568] bg-[#D6EAFE] px-4 py-1 rounded-full inline-block mb-4">
          Overall Statistics
        </p>

        <div className="grid grid-cols-2 gap-4">
          {[
            { value: sidebarStats?.total_goals ?? '...', label: 'Goals', icon: <FaBolt />, color: '#FF8A8A' },
            { value: `${sidebarStats?.achievement_percentage ?? '...'}%`, label: 'Achievements', icon: <FaCheck />, color: '#7FDD53' },
            { value: sidebarStats?.total_accounts ?? '...', label: 'Accounts', icon: <FaChartBar />, color: '#5FBFFF' },
            { value: sidebarStats?.recent_transactions ?? '...', label: 'Recent Transactions', icon: <FaHourglassHalf />, color: '#FFC541' },
            { value: `${sidebarStats?.lessons_completed_percentage ?? '...'}%`, label: 'Lessons', icon: <FaTimes />, color: '#F68D2B' },
            { value: sidebarStats?.total_communities ?? '...', label: 'Communities', icon: <FaBan />, color: '#FF7F9E' },
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

export default ProfileSidebar;

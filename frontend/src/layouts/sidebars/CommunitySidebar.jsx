import React, { useEffect, useState } from 'react';
import avatarFallback from '../../assets/Images/avatars/totoroAvatar.jpeg';
import {
  FaGamepad, FaUsers, FaFire, FaMedal,
  FaHandshake, FaCommentDots
} from 'react-icons/fa';

const CommunitySidebar = () => {
  const [stats, setStats] = useState(null);
  const [performance, setPerformance] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.id) return;

    fetch(`http://localhost:5000/api/community/stats/${user.id}`)
      .then(res => res.json())
      .then(data => setStats(data.data))
      .catch(err => console.error('Community stats error:', err));

    fetch(`http://localhost:5000/api/community/performance-summary/${user.id}`)
      .then(res => res.json())
      .then(data => setPerformance(data.data))
      .catch(err => console.error('Community performance summary error:', err));
  }, []);

  if (!stats || !performance) {
    return <div className="text-sm text-gray-500">Loading community sidebar...</div>;
  }

  const metrics = [
    { value: stats.communities, label: 'Communities', icon: <FaUsers />, color: '#FF8A8A' },
    { value: stats.challenges, label: 'Challenges', icon: <FaFire />, color: '#7FDD53' },
    { value: stats.leaderboard ?? '-', label: 'Leaderboard', icon: <FaMedal />, color: '#5FBFFF' },
    { value: stats.gamesPlayed, label: 'Games Played', icon: <FaGamepad />, color: '#FFC541' },
    { value: stats.friends, label: 'Friends', icon: <FaHandshake />, color: '#F68D2B' },
    { value: stats.socialPosts, label: 'Social Post', icon: <FaCommentDots />, color: '#FF7F9E' },
  ];

  const progressPercent = performance.performance_score / 1000;
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (progressPercent * circumference);

  return (
    <aside className="space-y-6">
      {/* Community Performance Block (Dynamic) */}
      <div className="bg-white rounded-2xl p-4 shadow text-center">
        <p className="text-sm font-semibold text-[#4A5568] bg-[#D6EAFE] px-3 py-1 rounded-full inline-block mb-2">
          Community Performance
        </p>

        <div className="relative w-40 h-40 mx-auto">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#E8F0FA" strokeWidth="10" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
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

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[24px] font-bold text-[#2D3748]">
              {performance.performance_score}
            </p>
            <p className="text-sm text-[#718096]">{performance.performance_label}</p>
            <img
              src={
                performance.avatar_image_path
                  ? `/assets/Images/${performance.avatar_image_path}`
                  : avatarFallback
              }
              alt="Avatar"
              className="w-8 h-8 mt-1 rounded-full object-cover"
            />
          </div>

          <div className="absolute top-[6px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-blue-400 rounded-full" />
          </div>
        </div>

        <p className="text-sm text-[#F56565] mt-2 font-medium">
          Lv {performance.level_number}: {performance.tier_level}
        </p>
      </div>

      {/* Community Statistics Cards */}
      <div className="bg-white rounded-2xl p-4 shadow text-center">
        <p className="text-sm font-semibold text-[#4A5568] bg-[#D6EAFE] px-4 py-1 rounded-full inline-block mb-4">
          Community Statistics
        </p>
        <div className="grid grid-cols-2 gap-4">
          {metrics.map(({ value, label, icon, color }, i) => (
            <div key={i} className="relative bg-white rounded-xl shadow-md p-3 flex items-center justify-between">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: color + '20' }}
              >
                <div className="text-white" style={{ color }}>{icon}</div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
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

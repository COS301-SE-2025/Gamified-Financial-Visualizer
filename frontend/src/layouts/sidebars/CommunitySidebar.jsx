import React, {useState, useEffect} from 'react';
import {
  FaUserFriends,
  FaTrophy,
  FaGamepad,
  FaUsers,
  FaMedal,
  FaFire,
  FaCommentDots,
  FaHandshake
} from 'react-icons/fa';
import avatar from '../../assets/Images/avatars/BeachShore.png';

const AccountsPerformanceHeader = () => {
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

  const progressPercent = performance?.performance_score/500 *100 || 0;

  const metrics = [
    { value: stats?.communities, label: 'Communities', icon: <FaUsers />, color: '#FF8A8A' },
    { value: stats?.challenges, label: 'Challenges', icon: <FaFire />, color: '#7FDD53' },
    { value: '#' + (stats?.leaderboard ?? '-'), label: 'Leaderboard', icon: <FaMedal />, color: '#5FBFFF' },
    { value: stats?.gamesPlayed, label: 'Games Played', icon: <FaGamepad />, color: '#FFC541' },
    { value: stats?.friends, label: 'Friends', icon: <FaHandshake />, color: '#F68D2B' },
    { value: stats?.socialPosts, label: 'Social Post', icon: <FaCommentDots />, color: '#FF7F9E' },
  ];

  return (
    <div className="flex flex-wrap justify-between gap-6 items-start w-full mb-6">
      {/* Left Label */}
      <div className="text-center lg:text-left">
        <div className="flex items-center justify-center lg:justify-start gap-2 text-[#B4DFA4]">
          <FaUsers className="text-6xl" />
          <h1 className="text-5xl font-light">Community</h1>
        </div>
        <p className="text-lg text-gray-400 mt-1 max-w-xs mx-auto lg:mx-0 dark:text-gray-300">
          Connect with peers, join communities, and take part in exciting financial challenges.
        </p>
      </div>

      {/* Right Section (Performance Card + Stat Grid) */}
      <div className="flex flex-col gap-4 flex-1">
        {/* Center Performance Card */}
        <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col sm:flex-row items-center justify-between gap-6 dark:bg-gray-800">
          {/* Avatar + Info */}
          <div className="flex items-center gap-6">
            <img 
              src={
                performance?.avatar_image_path
                  ? `/assets/Images/${performance?.avatar_image_path}`
                  : avatar
              } 
              className="w-16 h-16 rounded-full object-cover" 
              alt="Avatar" 
            />
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{performance?.performance_score}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{performance?.performance_label}</p>
              <p className="text-sm text-[#F97156] font-medium">Lv {performance?.level_number}: {performance?.tier_level}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full">
            <p className="text-sm font-medium text-[#7FBCE9] mb-1">Community Performance</p>
            <div className="relative h-4 w-full rounded-full bg-[#f5f5f5] dark:bg-gray-700 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progressPercent}%`,
                  background: 'linear-gradient(to right, #4FC3F7, #B3E5FC)'
                }}
              />
              <div
                className="absolute top-1/2 w-5 h-5 bg-[#B3E5FC] rounded-full border-2 border-white shadow-md"
                style={{
                  left: `calc(${progressPercent}% - 10px)`,
                  transform: 'translateY(-50%)'
                }}
              />
            </div>
          </div>
        </div>

        {/* Stat Blocks*/}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
          {metrics.map(({ label, value, icon, color }, index) => (
            <div key={index} className="relative bg-white rounded-xl shadow-sm overflow-hidden dark:bg-gray-800">
              <div className="flex items-center justify-between px-4 py-3">
                {/* Icon circle with soft background */}
                <div className="w-10 h-10 flex items-center justify-center rounded-full dark:text-gray-400" style={{ backgroundColor: `${color}20` }}>
                  <span className="text-xl" style={{ color }}>{icon}</span>
                </div>

                {/* Stat content */}
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-200">{value}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">{label}</div>
                </div>
              </div>

              {/* Bottom colored bar */}
              <div className="absolute bottom-0 left-0 h-[5px] w-full rounded-b-xl" style={{ backgroundColor: color }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountsPerformanceHeader;
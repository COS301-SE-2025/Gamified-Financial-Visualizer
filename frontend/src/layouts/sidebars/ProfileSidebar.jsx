import React, {useEffect, useState} from 'react';
import {
  FaUsers,
  FaBolt,
  FaChartBar,
  FaHourglassHalf,
  FaCheck,
  FaTimes,
  FaBan,
} from 'react-icons/fa';
import avatar from '../../assets/Images/avatars/sharkAvatar.jpeg';

const AccountsPerformanceHeader = () => {
  const [sidebarStats, setSidebarStats] = useState(null);
  const [performanceSummary, setPerformanceSummary] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  
  const fetchSidebarData = () => {
    if (!user?.id) return;

    fetch(`http://localhost:5000/api/auth/sidebar/${user.id}`)
      .then(res => res.json())
      .then(data => setSidebarStats(data.data))
      .catch(err => console.error('Sidebar stats error:', err));

    fetch(`http://localhost:5000/api/auth/profile/performance-summary/${user?.id}`)
      .then(res => res.json())
      .then(data => setPerformanceSummary(data.data))
      .catch(err => console.error('Performance summary error:', err));
  };

  useEffect(() => {
    fetchSidebarData();

    const handleUserUpdated = () => fetchSidebarData();
    window.addEventListener('userUpdated', handleUserUpdated);

    return () => window.removeEventListener('userUpdated', handleUserUpdated);
  }, []);

  return (
    <div className="flex flex-wrap justify-between gap-6 items-start w-full mb-6">
      {/* Left Label */}
      <div className="text-center lg:text-left">
        <div className="flex items-center justify-center lg:justify-start gap-2 text-[#B4DFA4]">
          <FaUsers className="text-6xl" />
          <h1 className="text-5xl font-light">Profile</h1>
        </div>
        <p className="text-lg text-gray-400 mt-1 max-w-xs mx-auto lg:mx-0">
          Manage your personal details, track XP, and monitor progress toward your goals and achievements.
        </p>
      </div>

      {/* Right Section (Performance Card + Stat Grid) */}
      <div className="flex flex-col gap-4 flex-1">
        {/* Center Performance Card */}
        <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Avatar + Info */}
          <div className="flex items-center gap-6">
            <img src={
                performanceSummary?.avatar_image_path
                  ? `/assets/Images/${performanceSummary.avatar_image_path}`
                  : avatar
              } className="w-16 h-16 rounded-full object-cover" alt="Avatar" />
            <div>
              <p className="text-2xl font-bold text-gray-800">{performanceSummary?.performance_score}</p>
              <p className="text-sm text-gray-500">{performanceSummary?.performance_label }</p>
              <p className="text-sm text-[#F97156] font-medium">Lv {performanceSummary?.level_number ?? '?'}: {performanceSummary?.tier_level ?? '0'}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full">
            <p className="text-sm font-medium text-[#7FBCE9] mb-1">Overall Performance</p>
            <div className="relative h-4 w-full rounded-full bg-[#f5f5f5] overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${performanceSummary?.performance_score/500 *100}%`,
                  background: 'linear-gradient(to right, #4FC3F7, #B3E5FC)'
                }}
              />
              <div
                className="absolute top-1/2 w-5 h-5 bg-[#B3E5FC] rounded-full border-2 border-white shadow-md"
                style={{
                  left: `calc(${performanceSummary?.performance_score/500 *100}% - 10px)`,
                  transform: 'translateY(-50%)'
                }}
              />
            </div>
          </div>
        </div>

        {/* Stat Blocks*/}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
          {[
            { value: sidebarStats?.total_goals ?? '...', label: 'Goals', icon: <FaBolt />, color: '#FF8A8A' },
            { value: `${sidebarStats?.achievement_percentage ?? '...'}%`, label: 'Achievements', icon: <FaCheck />, color: '#7FDD53' },
            { value: sidebarStats?.total_accounts ?? '...', label: 'Accounts', icon: <FaChartBar />, color: '#5FBFFF' },
            { value: sidebarStats?.recent_transactions ?? '...', label: 'Recent Transactions', icon: <FaHourglassHalf />, color: '#FFC541' },
            { value: `${sidebarStats?.lessons_completed_percentage ?? '...'}%`, label: 'Lessons', icon: <FaTimes />, color: '#F68D2B' },
            { value: sidebarStats?.total_communities ?? '...', label: 'Communities', icon: <FaBan />, color: '#FF7F9E' },
          ].map(({ label, value, icon, color }, index) => (
            <div key={index} className="relative bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3">
                {/* Icon circle with soft background */}
                <div className="w-10 h-10 flex items-center justify-center rounded-full" style={{ backgroundColor: `${color}20` }}>
                  <span className="text-xl" style={{ color }}>{icon}</span>
                </div>

                {/* Stat content */}
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{value}</div>
                  <div className="text-sm text-gray-500">{label}</div>
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

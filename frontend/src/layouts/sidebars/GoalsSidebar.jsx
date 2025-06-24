import React, { useEffect, useState } from 'react';
import avatar from '../../assets/Images/avatars/totoroAvatar.jpeg';
import {
  FaBolt,
  FaChartBar,
  FaHourglassHalf,
  FaCheck,
  FaTimes,
  FaBan,
} from 'react-icons/fa';

const GoalsSidebar = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [goalStats, setGoalStats] = useState(null);
  const [performanceScore, setPerformanceScore] = useState(0);

  const scoreToLevelText = (score) => {
    if (score >= 400) return 'Excellent';
    if (score >= 300) return 'Good';
    if (score >= 200) return 'Average';
    return 'Needs Improvement';
  };

  useEffect(() => {
    const fetchStatsAndScore = async () => {
      try {
        const [summaryRes, performanceRes] = await Promise.all([
          fetch(`http://localhost:5000/api/goal/${user.id}/summary`),
          fetch(`http://localhost:5000/api/goal/${user.id}/performance`)
        ]);

        const summaryData = await summaryRes.json();
        const performanceData = await performanceRes.json();

        setGoalStats(summaryData.data);
        setPerformanceScore(performanceData.data || 0);
      } catch (err) {
        console.error('Failed to fetch goal data:', err);
      }
    };

    if (user?.id) fetchStatsAndScore();
  }, [user?.id]);

  return (
    <aside className="space-y-6">
      {/* Goal Performance */}
      <div className="bg-white rounded-2xl p-4 shadow text-center">
        <p className="text-sm font-semibold text-[#4A5568] bg-[#D6EAFE] px-3 py-1 rounded-full inline-block mb-2">
          Goal Performance
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
              strokeDasharray="270"
              strokeDashoffset={270 - (performanceScore / 500) * 270}
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
            <p className="text-[24px] font-bold text-[#2D3748]">{performanceScore}</p>
            <p className="text-sm text-[#718096]">{scoreToLevelText(performanceScore)}</p>
            <img src={avatar} alt="User Avatar" className="w-8 h-8 mt-1 rounded-full object-cover" />
          </div>

          <div className="absolute top-[6px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-blue-400 rounded-full" />
          </div>
        </div>

        <p className="text-sm text-[#F56565] mt-2 font-medium">Lv 3: Silver</p>
      </div>

      {/* Goal Statistics */}
      {goalStats && (
        <div className="bg-white rounded-2xl p-4 shadow text-center">
          <p className="text-sm font-semibold text-[#4A5568] bg-[#D6EAFE] px-4 py-1 rounded-full inline-block mb-4">
            Goal Statistics
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: goalStats.total_goals, label: 'Goals', icon: <FaBolt />, color: '#FF8A8A' },
              {
                value: `${Math.round(
                  (Number(goalStats.completed_goals) / Math.max(1, Number(goalStats.total_goals))) * 100
                )}%`,
                label: 'Completed',
                icon: <FaCheck />,
                color: '#7FDD53'
              },
              { value: goalStats.paused_goals, label: 'Inactive', icon: <FaChartBar />, color: '#5FBFFF' },
              { value: goalStats.in_progress_goals, label: 'In-Progress', icon: <FaHourglassHalf />, color: '#FFC541' },
              {
                value: `${Math.round(
                  ((Number(goalStats.failed_goals) + Number(goalStats.cancelled_goals)) / Math.max(1, Number(goalStats.total_goals))) * 100
                )}%`,
                label: 'Incomplete',
                icon: <FaTimes />,
                color: '#F68D2B'
              },
              { value: goalStats.cancelled_goals, label: 'Cancelled', icon: <FaBan />, color: '#FF7F9E' }
            ].map(({ value, label, icon, color }, i) => (
              <div key={i} className="relative bg-white rounded-xl shadow-md p-3 flex items-center justify-between">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
                  <div className="text-white" style={{ color }}>{icon}</div>

                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{value}</p>
                  <p className="text-sm text-gray-500">{label}</p>
                </div>
                <div className="absolute bottom-0 left-0 h-[5px] w-full rounded-b-xl" style={{ backgroundColor: color }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};

export default GoalsSidebar;

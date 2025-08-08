import React, {useEffect, useState} from 'react';
import {
  FaUsers,
  FaBolt,
  FaCheck,
  FaHourglassHalf,
  FaChartBar,
  FaTimes,
  FaBan
} from 'react-icons/fa';
import avatar from '../../assets/Images/avatars/BlueSky.png';


const AccountsPerformanceHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [goalStats, setGoalStats] = useState(null);
  const [performanceScore, setPerformanceScore] = useState(0);
  const [performance, setPerformance] = useState(null);
  const [levelProgress, setLevelProgress] = useState(null);

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

    fetch(`http://localhost:5000/api/community/performance-summary/${user.id}`)
      .then(res => res.json())
      .then(data => setPerformance(data.data))
      .catch(err => console.error('Community performance summary error:', err));

    // Fetch level progress
    fetch(`http://localhost:5000/api/auth/profile/level-progress/${user.id}`)
      .then(res => res.json())
      .then(res => setLevelProgress(res.data))
      .catch(err => console.error('Failed to load level progress:', err));

    if (user?.id) fetchStatsAndScore();
  }, [user?.id]);

  return (
    <div className="flex flex-wrap justify-between gap-6 items-start w-full mb-6">
      {/* Left Label */}
      <div className="text-center lg:text-left">
        <div className="flex items-center justify-center lg:justify-start gap-2 text-[#B4DFA4]">
          <FaUsers className="text-6xl" />
          <h1 className="text-5xl font-light dark:text-white">Goals</h1>
        </div>
        <p className="text-lg text-gray-400 dark:text-gray-500 mt-1 max-w-xs mx-auto lg:mx-0">
          Set savings goals and milestones, monitor your progress, and earn XP as you achieve them.
        </p>
      </div>

      {/* Right Section (Performance Card + Stat Grid) */}
      <div className="flex flex-col gap-4 flex-1">
        {/* Center Performance Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-6 border border-gray-100 dark:border-gray-700">
          {/* Avatar + Info */}
          <div className="flex items-center gap-6">
            <img src={
                performance
                  ? `../../assets/Images/${performance.avatar_image_path}`
                  : avatar
              } className="w-16 h-16 rounded-full object-cover" alt="Avatar" />
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{performanceScore}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{scoreToLevelText(performanceScore)}</p>
              <p className="text-sm text-[#F97156] dark:text-[#E5794B] font-medium">Lv {levelProgress?.level_number ?? '—'}: {levelProgress?.tier_status ?? '—'}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full">
            <p className="text-sm font-medium text-[#7FBCE9] dark:text-[#5FBFFF] mb-1">Goals Performance</p>
            <div className="relative h-4 w-full rounded-full bg-[#f5f5f5] dark:bg-gray-700 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${performanceScore / 500 *100}%`,
                  background: 'linear-gradient(to right, #4FC3F7, #B3E5FC)'
                }}
              />
              <div
                className="absolute top-1/2 w-5 h-5 bg-[#B3E5FC] rounded-full border-2 border-white dark:border-gray-800 shadow-md"
                style={{
                  left: `calc(${performanceScore / 500 *100}% - 10px)`,
                  transform: 'translateY(-50%)'
                }}
              />
            </div>
          </div>
        </div>

        {/* Stat Blocks*/}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
          {[
            {
              label: 'Goals',
              value: goalStats?.total_goals,
              icon: <FaBolt />,
              color: '#B1E1FF',
              darkColor: '#1E40AF'
            },
            {
              label: 'Completed',
              value: `${Math.round(
                  (Number(goalStats?.completed_goals) / Math.max(1, Number(goalStats?.total_goals))) * 100
                )}%`,
              icon: <FaCheck />,
              color: '#7FDD53',
              darkColor: '#166534'
            },
            {
              label: 'Upcoming',
              value: goalStats?.upcoming_goals,
              icon: <FaHourglassHalf />,
              color: '#FFC541',
              darkColor: '#854D0E'
            },
            {
              label: 'In-Progress',
              value: goalStats?.in_progress_goals,
              icon: <FaChartBar />,
              color: '#5FBFFF',
              darkColor: '#1E40AF'
            },
            {
              label: 'Dormant',
              value: goalStats?.dormant_goals,
              icon: <FaTimes />,
              color: '#F68D2B',
              darkColor: '#9A3412'
            },
            {
              label: 'Failed',
              value: goalStats?.failed_goals,
              icon: <FaBan />,
              color: '#FF8A8A',
              darkColor: '#991B1B'
            }
          ].map(({ label, value, icon, color, darkColor }, index) => (
            <div key={index} className="relative bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between px-4 py-3">
                {/* Icon circle with soft background */}
                <div 
                  className="w-10 h-10 flex items-center justify-center rounded-full" 
                  style={{ 
                    backgroundColor: `${color}20`,
                    '@media (prefers-color-scheme: dark)': {
                      backgroundColor: `${darkColor}30`
                    }
                  }}
                >
                  <span className="text-xl" style={{ color }}>{icon}</span>
                </div>

                {/* Stat content */}
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{value}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
                </div>
              </div>

              {/* Bottom colored bar */}
              <div 
                className="absolute bottom-0 left-0 h-[5px] w-full rounded-b-xl" 
                style={{ 
                  backgroundColor: color,
                  '@media (prefers-color-scheme: dark)': {
                    backgroundColor: darkColor
                  }
                }} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountsPerformanceHeader;
import React, {useState, useEffect} from 'react';
import {
  FaUsers,
  FaBook,
  FaCheckCircle,
  FaStar,
  FaEye,
  FaClock,
  FaRedoAlt
} from 'react-icons/fa';
import avatar from '../../assets/Images/avatars/BeachShore.png';

const AccountsPerformanceHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const id = user ? user.id : null;
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  const [userPerformance, setPerformance] = useState(null);
  const [levelProgress, setLevelProgress] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/learning/summary/${id}`);
        const data = await response.json();
        if (data.status === 'success') {
          setSummary(data.data);
        } else {
          setError(data.message || 'Failed to load learning summary');
        }
      } catch (err) {
        setError(err.message);
      } finally {
      }
    };

    fetch(`http://localhost:5000/api/community/performance-summary/${id}`)
      .then(res => res.json())
      .then(data => setPerformance(data.data))
      .catch(err => console.error('Community performance summary error:', err));

    // Fetch level progress
    fetch(`http://localhost:5000/api/auth/profile/level-progress/${id}`)
      .then(res => res.json())
      .then(res => setLevelProgress(res.data))
      .catch(err => console.error('Failed to load level progress:', err));

    if (id) fetchData();
  }, [id]);

  // Determine performance level and color
  const getPerformanceLevel = (score) => {
    if (!score) return { level: 'Beginner', color: '#60A5FA', tier: 'Bronze' };
    if (score >= 800) return { level: 'Excellent', color: '#93C5FD', tier: 'Diamond' };
    if (score >= 600) return { level: 'Good', color: '#60A5FA', tier: 'Gold' };
    if (score >= 400) return { level: 'Average', color: '#60A5FA', tier: 'Silver' };
    return { level: 'Beginner', color: '#60A5FA', tier: 'Bronze' };
  };

  const performance = summary ? getPerformanceLevel(summary.score) : getPerformanceLevel(0);
  const normalizeScore = (score, min = 300, max = 850) => {
    const clamped = Math.min(max, Math.max(min, score));
    return ((clamped - min) / (max - min)) * 100;
  };
  const progressPercentage = summary ? normalizeScore(summary.score) : 0;

  const userAvatar = userPerformance ? userPerformance.avatar_image_path : avatar;
  return (
    <div className="flex flex-wrap justify-between gap-6 items-start w-full mb-6">
      {/* Left Label */}
      <div className="text-center lg:text-left">
        <div className="flex items-center justify-center lg:justify-start gap-2 text-[#B4DFA4]">
          <FaUsers className="text-6xl" />
          <h1 className="text-5xl font-light">Learn</h1>
        </div>
        <p className="text-lg text-gray-400 mt-1 max-w-xs mx-auto lg:mx-0 dark:text-gray-300">
          Boost your financial knowledge with interactive modules, lessons, and quizzes.
        </p>
      </div>

      {/* Right Section (Performance Card + Stat Grid) */}
      <div className="flex flex-col gap-4 flex-1">
        {/* Center Performance Card */}
        <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col sm:flex-row items-center justify-between gap-6 dark:bg-gray-800">
          {/* Avatar + Info */}
          <div className="flex items-center gap-6">
            <img src={
                `/assets/Images/${userPerformance?.avatar_image_path}`
              } className="w-16 h-16 rounded-full object-cover" alt="Avatar" />
            <div>
              <p className="text-sm text-gray-500">Score</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{summary ? summary.score : '--'}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{performance.label}</p>
              <p className="text-sm text-[#F97156] font-medium"> Lv {levelProgress?.level_number ?? '—'}: {levelProgress?.tier_status ?? '—'}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full">
            <p className="text-sm font-medium text-[#7FBCE9] mb-1">Learn Performance</p>
            <div className="relative h-4 w-full rounded-full bg-[#f5f5f5] dark:bg-gray-700 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progressPercentage}%`,
                  background: 'linear-gradient(to right, #4FC3F7, #B3E5FC)'
                }}
              />
              <div
                className="absolute top-1/2 w-5 h-5 bg-[#B3E5FC] rounded-full border-2 border-white shadow-md"
                style={{
                  left: `calc(${progressPercentage}% - 10px)`,
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
              label: 'Courses',
              value: summary ? summary.modules : '--',
              icon: <FaBook />,
              color: '#B1E1FF'
            },
            {
              label: 'Completed',
              value: summary ? summary.percent + "%" : '--',
              icon: <FaCheckCircle />,
              color: '#7FDD53'
            },
            {
              label: 'Points',
              value: summary ? summary.points  : '--', 
              icon: <FaStar />,
              color: '#FFC541'
            },
            {
              label: 'Viewed Lesson',
              value:summary ? summary.total_views : '--', 
              icon: <FaEye />,
              color: '#5FBFFF'
            },
            {
              label: 'Quizzes Left',
              value: summary ? summary.total_quizzes_left : '--', 
              icon: <FaClock />,
              color: '#F68D2B'
            },
            {
              label: 'Quiz Attempts',
              value: summary ? summary.total_attempts : '--', 
              icon: <FaRedoAlt />,
              color: '#FF8A8A'
            }
          ].map(({ label, value, icon, color }, index) => (
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
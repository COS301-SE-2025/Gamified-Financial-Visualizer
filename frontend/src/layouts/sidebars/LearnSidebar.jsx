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

const LearnSidebar = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const id = user ? user.id : null;
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
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
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  // Determine performance level and color
  const getPerformanceLevel = (score) => {
    if (!score) return { level: 'Beginner', color: '#60A5FA', tier: 'Bronze' };
    if (score >= 800) return { level: 'Excellent', color: '#93C5FD', tier: 'Diamond' };
    if (score >= 600) return { level: 'Good', color: '#60A5FA', tier: 'Gold' };
    if (score >= 400) return { level: 'Average', color: '#60A5FA', tier: 'Silver' }; // color must remain consistent
    return { level: 'Beginner', color: '#60A5FA', tier: 'Bronze' };
  };

  const performance = summary ? getPerformanceLevel(summary.score) : getPerformanceLevel(0);
  const normalizeScore = (score, min = 300, max = 850) => {
    const clamped = Math.min(max, Math.max(min, score));
    return ((clamped - min) / (max - min)) * 100;
  };
  const progressPercentage = summary ? normalizeScore(summary.score) : 0;
  const strokeDasharray = 2 * Math.PI * 45; // Circumference of circle
  const strokeDashoffset = strokeDasharray * (1 - (progressPercentage / 100));


  if (error) {
    return (
      <aside className="space-y-6 mt-0">
        <div className="bg-white rounded-2xl p-4 shadow text-center">
          <p className="text-sm font-semibold text-[#4A5568] bg-[#D6EAFE] px-3 py-1 rounded-full inline-block mb-2">
            Error loading data
          </p>
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="space-y-6 mt-0">
      {/* Performance Overview */}
      <div className="bg-white rounded-2xl p-4 shadow text-center">
        <p className="text-sm font-semibold text-[#4A5568] bg-[#D6EAFE] px-3 py-1 rounded-full inline-block mb-2">
          Learning Performance
        </p>

        {/* Progress Circle */}
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
              stroke={performance.color}
              strokeWidth="10"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[24px] font-bold text-[#2D3748]">
              {summary ? summary.score : '--'}
            </p>
            <p className="text-sm text-[#718096]">{performance.level}</p>
            <img
              src={avatar}
              alt="User Avatar"
              className="w-8 h-8 mt-1 rounded-full object-cover"
            />
          </div>

          {/* Top Indicator Dot */}
          <div className="absolute top-[6px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: performance.color }}
            />
          </div>
        </div>
        <p className="text-sm font-medium mt-2" style={{ color: performance.color }}>
          Lv {summary ? Math.floor(summary.score/20) + 1 : 1}: {performance.tier}
        </p>
      </div>

      {/* Learning Statistics */}
      <div className="bg-white rounded-2xl p-4 shadow text-center">
        <p className="text-sm font-semibold text-[#4A5568] bg-[#D6EAFE] px-4 py-1 rounded-full inline-block mb-4">
          Learning Statistics
        </p>

        <div className="grid grid-cols-2 gap-4">
          {[
            { 
              value: summary ? summary.modules : '--', 
              label: 'Modules', 
              icon: <FaBolt />, 
              color: '#FF8A8A' 
            },
            { 
              value: summary ? `${Math.round((summary.total_attempts / (summary.total_attempts + summary.total_quizzes_left)) * 100)}%` : '--', 
              label: 'Completed', 
              icon: <FaCheck />, 
              color: '#7FDD53' 
            },
            { 
              value: summary ? summary.points : '--', 
              label: 'Points', 
              icon: <FaChartBar />, 
              color: '#5FBFFF' 
            },
            { 
              value: summary ? summary.total_views : '--', 
              label: 'Lessons Viewed', 
              icon: <FaHourglassHalf />, 
              color: '#FFC541' 
            },
            { 
              value: summary ? summary.total_quizzes_left : '--', 
              label: 'Quizzes Left', 
              icon: <FaTimes />, 
              color: '#F68D2B' 
            },
            { 
              value: summary ? summary.total_attempts : '--', 
              label: 'Quiz Attempts', 
              icon: <FaBan />, 
              color: '#FF7F9E' 
            },
          ].map(({ value, label, icon, color }, i) => (
            <div key={i} className="relative bg-white rounded-xl shadow-md p-3 flex items-center justify-between">
              {/* Icon Bubble */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: color + '20' }} // Light version of color
              >
                <div style={{ color }}>
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

export default LearnSidebar;
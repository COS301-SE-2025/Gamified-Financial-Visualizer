import React from 'react';
import {
  FaUsers,
  FaBook,
  FaCheckCircle,
  FaStar,
  FaEye,
  FaClock,
  FaRedoAlt
} from 'react-icons/fa';
import avatar from '../../assets/Images/avatars/sharkAvatar.jpeg';

const performance = {
  score: 350,
  level: 'Lv 3: Silver',
  label: 'Excellent',
  progress: 70
};

const AccountsPerformanceHeader = () => {
  return (
    <div className="flex flex-wrap justify-between gap-6 items-start w-full mb-6">
      {/* Left Label */}
      <div className="text-center lg:text-left">
        <div className="flex items-center justify-center lg:justify-start gap-2 text-[#B4DFA4]">
          <FaUsers className="text-6xl" />
          <h1 className="text-5xl font-light">Learn</h1>
        </div>
        <p className="text-lg text-gray-400 mt-1 max-w-xs mx-auto lg:mx-0">
          Boost your financial knowledge with interactive modules, lessons, and quizzes.
        </p>
      </div>

      {/* Right Section (Performance Card + Stat Grid) */}
      <div className="flex flex-col gap-4 flex-1">
        {/* Center Performance Card */}
        <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Avatar + Info */}
          <div className="flex items-center gap-6">
            <img src={avatar} className="w-16 h-16 rounded-full object-cover" alt="Avatar" />
            <div>
              <p className="text-2xl font-bold text-gray-800">{performance.score}</p>
              <p className="text-sm text-gray-500">{performance.label}</p>
              <p className="text-sm text-[#F97156] font-medium">{performance.level}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full">
            <p className="text-sm font-medium text-[#7FBCE9] mb-1">Learn Performance</p>
            <div className="relative h-4 w-full rounded-full bg-[#f5f5f5] overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${performance.progress}%`,
                  background: 'linear-gradient(to right, #4FC3F7, #B3E5FC)'
                }}
              />
              <div
                className="absolute top-1/2 w-5 h-5 bg-[#B3E5FC] rounded-full border-2 border-white shadow-md"
                style={{
                  left: `calc(${performance.progress}% - 10px)`,
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
              value: 14,
              icon: <FaBook />,
              color: '#B1E1FF'
            },
            {
              label: 'Completed',
              value: '83%',
              icon: <FaCheckCircle />,
              color: '#7FDD53'
            },
            {
              label: 'Points',
              value: 14,
              icon: <FaStar />,
              color: '#FFC541'
            },
            {
              label: 'Viewed Lesson',
              value: 12,
              icon: <FaEye />,
              color: '#5FBFFF'
            },
            {
              label: 'Quizzes Left',
              value: 3,
              icon: <FaClock />,
              color: '#F68D2B'
            },
            {
              label: 'Quiz Attempts',
              value: 7,
              icon: <FaRedoAlt />,
              color: '#FF8A8A'
            }
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

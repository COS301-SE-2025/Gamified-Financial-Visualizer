// ✅ GoalCard.jsx
import React from 'react';
import avatar from '../../../assets/Images/pixelBar.jpeg';
import { useNavigate } from 'react-router-dom';

const GoalCard = ({ id = 1, title = 'Bali Trip', year = 2027, percent = 95, spent = 12000, remaining = 8000, daysLeft = 89 }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white px-4 py-6 rounded-xl shadow-md space-y-4 border">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">{year}</p>
        </div>
        <img
          src={avatar}
          alt={title}
          className="rounded-full w-12 h-12 object-cover"
        />
      </div>

      {/* Progress Ring + Stats */}
      <div className="flex items-center justify-between overflow-visible">
        {/* SVG Progress Ring */}
        <div className="relative w-28 h-28 flex-shrink-0">
          <svg
            viewBox="0 0 120 120"
            className="absolute top-0 left-0 w-full h-full transform -rotate-90"
          >
            <circle
              cx="60"
              cy="60"
              r="52"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="60"
              cy="60"
              r="52"
              stroke="url(#progressGradient)"
              strokeWidth="8"
              fill="none"
              strokeDasharray="326.56"
              strokeDashoffset={(1 - percent / 100) * 326.56}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="progressGradient" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#fb923c" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-orange-500">{percent}%</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 ml-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Spent</span>
            <span>R{spent.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Remaining</span>
            <span>R{remaining.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Days Left</span>
            <span>{daysLeft}</span>
          </div>
        </div>
      </div>

      {/* View button */}
      <div className="text-right">
        <button
          onClick={() => navigate(`/goals/${id}`)}
          className="text-sm px-4 py-1 rounded-full bg-gradient-to-r from-green-300 to-green-500 text-white shadow hover:from-green-400 hover:to-green-600"
        >
          View
        </button>
      </div>
    </div>
  );
};

export default GoalCard;

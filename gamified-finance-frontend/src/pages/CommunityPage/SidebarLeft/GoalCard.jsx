import React from 'react';
import avatar from '../../../assets/Images/pixelBar.jpeg';
import { useNavigate } from 'react-router-dom';

const GoalCard = () => {
  const navigate = useNavigate();
  const percent = 95; // or dynamically based on props later
  const gradient = `conic-gradient(from 0deg, #facc15 ${percent}%, #f1f5f9 ${percent}% 100%)`;
  return (
    <div className="bg-white p-4 rounded-xl shadow-md space-y-4 border">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Bali Trip</h3>
          <p className="text-sm text-gray-500">2027</p>
        </div>
        <img
          src={avatar}
          alt="Bali Trip"
          className="rounded-full w-12 h-12 object-cover"
        />
      </div>

      {/* Chart & Stats */}
      <div className="flex items-center justify-between">
        {/* Donut chart using conic gradient */}
        <div className="relative w-24 h-24 rounded-full" style={{ backgroundImage: gradient }}>
          {/* Inner white circle */}
          <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center shadow-inner">
            <span className="text-sm font-bold text-orange-500">{percent}%</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 ml-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Spent</span>
            <span>R12,000</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Remaining</span>
            <span>R8,000</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Days Left</span>
            <span>89</span>
          </div>
        </div>
      </div>

      {/* View button */}
      <div className="text-right">
        <button
          onClick={() => navigate('/manage-community/:id')}
          className="text-sm px-4 py-1 rounded-full bg-gradient-to-r from-green-300 to-green-500 text-white shadow hover:from-green-400 hover:to-green-600">
          View
        </button>
      </div>
    </div>
  );
};

export default GoalCard;

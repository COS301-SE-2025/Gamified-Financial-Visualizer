import React from 'react';
import goal1 from '../../assets/Images/pixelAllyway.jpeg';
import goal2 from '../../assets/Images/pixelMoonLight.jpeg';
import goal3 from '../../assets/Images/pixelPath.jpeg';
import goal4 from '../../assets/Images/pixelPath.jpeg';
import goal5 from '../../assets/Images/pixelStore.jpeg';
import reward1 from '../../assets/Images/highFiveIcon.png';
import reward2 from '../../assets/Images/awardIcon.png';
import reward3 from '../../assets/Images/mountainIcon.png';
import reward4 from '../../assets/Images/moneyGrowIcon.png';

import { useParams, useNavigate } from 'react-router-dom';

// Mock function to simulate goal retrieval (replace with API call)
const getGoalById = (id) => {
  const goals = [
    {
      id: 1,
      name: 'Buy a Car',
      image: goal1,
      current: 5200,
      target: 10000,
      category: 'Vehicle',
      recurring: true,
      frequency: 'Monthly',
      xpEarned: 260,
    },
    {
      id: 2,
      name: 'Trip to Japan',
      image: goal2,
      current: 2000,
      target: 8000,
      category: 'Travel',
      recurring: false,
      xpEarned: 100,
    },
    {
      id: 3,
      name: 'Trip to Japan',
      image: goal3,
      current: 8000,
      target: 85000,
      category: 'Travel',
      recurring: false,
      xpEarned: 100,
    },
    {
      id: 4,
      name: 'Bali Vacation',
      image: goal4,
      current: 5000,
      target: 65300,
      category: 'Travel',
      recurring: true,
      frequency: 'Monthly',
      xpEarned: 100,
    },
    {
      id: 5,
      name: 'Gaming Setup',
      image: goal5,
      current: 7000,
      target: 45200,
      category: 'Travel',
      recurring: true,
      frequency: 'Monthly',
      xpEarned: 100,
    },
  ];

  return goals.find((g) => g.id === Number(id));
};

const GoalsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const goal = getGoalById(id);

  if (!goal) {
    return <div className="p-6 text-red-500">Goal not found</div>;
  }

  const progress = Math.min((goal.current / goal.target) * 100, 100).toFixed(0);
  const remaining = goal.target - goal.current;

  return (
    <div className="p-6 max-w-4xl mx-auto text-center">
      {/* Pixel-style Banner */}
      <div className="relative w-full rounded-xl overflow-hidden shadow-lg mb-6">
        <img src={goal.image} alt={goal.name} className="w-full h-40 object-cover" />
        <div className="absolute bottom-3 left-4 text-white">
          <h1 className="text-2xl font-extrabold drop-shadow">{goal.name}</h1>
          <p className="text-sm text-gray-100 drop-shadow">{goal.category}</p>
        </div>
      </div>

      {/* XP Progress Ring */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-24 h-24">
          <svg className="absolute w-full h-full transform -rotate-90">
            <circle cx="48" cy="48" r="40" stroke="#eee" strokeWidth="6" fill="none" />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="url(#xpGradient)"
              strokeWidth="6"
              fill="none"
              strokeDasharray="251"
              strokeDashoffset={`${251 - (251 * progress) / 100}`}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="xpGradient" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#fb923c" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">
            {progress}%
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-500">XP Progress</p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-12">
        <div className="bg-white rounded-xl p-4 shadow text-center">
          <p className="text-xs text-gray-500 mb-1">XP Earned</p>
          <p className="text-green-600 font-bold text-lg">{goal.xpEarned} XP</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow text-center">
          <p className="text-xs text-gray-500 mb-1">Remaining</p>
          <p className="text-red-500 font-bold text-lg">R{remaining}</p>
        </div>
        {goal.recurring && (
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <p className="text-xs text-gray-500 mb-1">Recurring</p>
            <p className="text-blue-500 font-bold text-lg">{goal.frequency}</p>
          </div>
        )}
      </div>

      {/* Rewards Preview */}
      <div className="mb-8">
  <h3 className="text-md font-semibold mb-2">🎖️ Goal Rewards</h3>
  <div className="flex gap-4 justify-center">
    <img src={reward1} alt="XP Badge" className="w-20 h-20 rounded-full border border-gray-200 shadow-sm" />
    <img src={reward2} alt="Trophy" className="w-20 h-20 rounded-full border border-gray-200 shadow-sm" />
    <img src={reward3} alt="Coins" className="w-20 h-20 rounded-full border border-gray-200 shadow-sm" />
    <img src={reward4} alt="Coins" className="w-20 h-20 rounded-full border border-gray-200 shadow-sm" />
  </div>
</div>


      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          Back
        </button>
        <button className="px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500 shadow">
          Edit Goal
        </button>
        <button className="px-4 py-2 bg-red-300 text-red-600 rounded-md hover:bg-red-400 shadow">
          Delete Goal
        </button>
      </div>
    </div>
  );
};

export default GoalsDetail;
import React from 'react';
import goal1 from '../../assets/Images/pixelAllyway.jpeg';
import goal2 from '../../assets/Images/pixelMoonLight.jpeg';
import goal3 from '../../assets/Images/pixelPath.jpeg';
import goal4 from '../../assets/Images/pixelPath.jpeg';
import goal5 from '../../assets/Images/pixelStore.jpeg';
import { useNavigate } from 'react-router-dom';

const dummyGoals = [
  {
    id: 1,
    name: 'Buy a Car',
    current: 5200,
    target: 10000,
    category: 'Vehicle',
    image: goal1,
    status: 'ongoing',
  },
  {
    id: 2,
    name: 'Trip to Japan',
    current: 8000,
    target: 8000,
    category: 'Travel',
    image: goal2,
    status: 'completed',
  },
  {
    id: 3,
    name: 'Emergency Fund',
    current: 6000,
    target: 10000,
    category: 'Emergency',
    image: goal3,
    status: 'archived',
  },
  {
    id: 4,
    name: 'Bali Vacation',
    current: 1500,
    target: 4000,
    category: 'Travel',
    image: goal4,
    status: 'ongoing',
  },
  {
    id: 5,
    name: 'Gaming Setup',
    current: 3000,
    target: 5000,
    category: 'Hobby',
    image: goal5,
    status: 'ongoing',
  },
];

const GoalsList = ({ filter = 'ongoing' }) => {
  const navigate = useNavigate();
  const filteredGoals = dummyGoals.filter((g) => g.status === filter);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredGoals.map((goal) => {
        const progress = Math.min((goal.current / goal.target) * 100, 100).toFixed(0);

        return (
          <div
            key={goal.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col items-center p-4 transition hover:shadow-lg"
          >
            {/* Goal Image */}
            <img
              src={goal.image}
              alt={goal.name}
              className="w-full h-32 object-cover rounded-xl mb-3"
            />

            {/* Goal Name */}
            <div className="w-full text-center">
              <p className="text-sm font-medium text-gray-700">{goal.name}</p>

              {/* Overlapping Badge Icons */}
              <div className="flex justify-center mt-2 mb-3 -space-x-2">
                <span className="w-6 h-6 bg-blue-300 rounded-full border-2 border-white inline-block"></span>
                <span className="w-6 h-6 bg-gray-400 rounded-full border-2 border-white inline-block"></span>
                <span className="w-6 h-6 bg-green-600 rounded-full border-2 border-white inline-block"></span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-green-600"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {/* View Button */}
              <button
                onClick={() => navigate(`/goals/${goal.id}`)}
                className="px-4 py-1 text-sm bg-gradient-to-r from-green-400 to-green-500 text-white rounded-full shadow hover:scale-105 transition"
              >
                View
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GoalsList;

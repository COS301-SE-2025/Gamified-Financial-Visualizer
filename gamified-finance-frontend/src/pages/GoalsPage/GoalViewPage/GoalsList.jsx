import React from 'react';
import goal1 from '../../assets/Images/pixelAllyway.jpeg';
import goal2 from '../../assets/Images/pixelMoonLight.jpeg';
import goal3 from '../../assets/Images/pixelPath.jpeg';
import goal4 from '../../assets/Images/pixelPath.jpeg';
import goal5 from '../../assets/Images/pixelStore.jpeg';
import { useNavigate } from 'react-router-dom';

const dummyGoals = [
  { id: 1, name: 'Buy a Car', current: 5200, target: 10000, image: goal1, status: 'ongoing' },
  { id: 2, name: 'Bali Vacation', current: 1500, target: 4000, image: goal2, status: 'ongoing' },
  { id: 3, name: 'New Car-BMW', current: 2300, target: 7000, image: goal3, status: 'ongoing' },
  { id: 4, name: 'Bali Vacation', current: 7500, target: 1200, image: goal4, status: 'ongoing' },
  { id: 5, name: 'Gaming Setup', current: 3000, target: 5000, image: goal5, status: 'ongoing' },
];

const GoalsList = ({ filter = 'ongoing' }) => {
  const navigate = useNavigate();
  const filteredGoals = dummyGoals.filter((g) => g.status === filter);

  return (
    <div className="space-y-4">
      {filteredGoals.map((goal) => {
        const progress = Math.min((goal.current / goal.target) * 100, 100).toFixed(0);

        return (
          <div
            key={goal.id}
            className="bg-white rounded-lg shadow p-3 text-center border"
          >
            <img
              src={goal.image}
              alt={goal.name}
              className="w-full h-20 object-cover rounded-md mb-2"
            />
            <p className="text-sm font-medium text-gray-800 mb-1">{goal.name}</p>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-orange-600"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 my-1">{progress}% Complete</p>
            <button
              onClick={() => navigate(`/goals/${goal.id}`)}
              className="text-xs text-green-600 hover:underline"
            >
              View
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default GoalsList;

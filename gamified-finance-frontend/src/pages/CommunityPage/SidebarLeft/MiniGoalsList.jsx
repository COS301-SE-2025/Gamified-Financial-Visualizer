import React from 'react';

const miniGoals = [
  {
    name: 'Bali Trip',
    image: 'https://via.placeholder.com/40',
    progress: 75,
  },
  {
    name: 'GTA 6',
    image: 'https://via.placeholder.com/40',
    progress: 40,
  },
  {
    name: 'PC Build',
    image: 'https://via.placeholder.com/40',
    progress: 20,
  },
];

const MiniGoalsList = () => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md space-y-3">
      {miniGoals.map((goal, index) => (
        <div
          key={index}
          className="flex items-center justify-between space-x-3"
        >
          <div className="flex items-center space-x-2">
            <img
              src={goal.image}
              alt={goal.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h5 className="text-sm font-semibold text-gray-700">
                {goal.name}
              </h5>
              <div className="h-1 w-24 bg-gray-200 rounded-full">
                <div
                  className="h-1 bg-pink-400 rounded-full"
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
          <button className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
            View
          </button>
        </div>
      ))}
    </div>
  );
};

export default MiniGoalsList;

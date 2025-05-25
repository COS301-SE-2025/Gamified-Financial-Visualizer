// ✅ src/pages/GoalsPage/GoalsListPage/GoalsListPage.jsx
import React from 'react';
import GoalPage from '../GoalPage'; // master layout
import GoalsList from '../AllMyGoals/GoalsList';
import GoalsLevelCard from '../MainContent/GoalsLevelCard';
import GoalsHeader from '../MainContent/GoalsHeader';

const GoalsListPage = () => {
  return (
    <GoalPage>
      <GoalsHeader />
      <div className="mt-4">
        <GoalsLevelCard />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm mt-6">
        <h4 className="text-md font-semibold text-gray-700 mb-3">Your Goals</h4>
        <GoalsList filter="ongoing" />
      </div>
    </GoalPage>
  );
};

export default GoalsListPage;

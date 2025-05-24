// ✅ src/pages/GoalsPage/GoalsCreatePage/GoalsCreatePage.jsx
import React from 'react';
import GoalPage from '../GoalPage';
import GoalsHeader from '../MainContent/GoalsHeader';
import GoalsLevelCard from '../MainContent/GoalsLevelCard';
import GoalsCreateForm from './GoalsCreateForm';

const GoalsCreatePage = () => {
  return (
    <GoalPage>
      <GoalsHeader />

      <div className="mt-4">
        <GoalsLevelCard />
      </div>

      <div className="mt-6 bg-white p-6 rounded-xl shadow-sm">
        <h4 className="text-lg font-semibold text-gray-700 mb-4">🎯 Create a New Goal</h4>
        <GoalsCreateForm />
      </div>
    </GoalPage>
  );
};

export default GoalsCreatePage;

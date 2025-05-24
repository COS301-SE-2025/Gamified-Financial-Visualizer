import React from 'react';
import GoalsHeader from './GoalsHeader';
import GoalsLevelCard from './GoalsLevelCard';
import GoalsBadgesPanel from '../GoalBadges/GoalsBadgesPanel';
import GoalsCreateForm from '../GoalsCreatePage/GoalsCreateForm';
import GoalsList from '../AllMyGoals/GoalsList';

const MainContent = () => {
  return (
    <>
      <GoalsHeader />
      <div className="mt-4">
        <GoalsLevelCard />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GoalsBadgesPanel />
        <GoalsCreateForm />
      </div>

      <div className="mt-6">
        <GoalsList />
      </div>
    </>
  );
};

export default MainContent;

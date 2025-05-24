import React from 'react';
import GoalsBadgesPanel from './GoalBadges/GoalsBadgesPanel';
import GoalsCreateForm from './GoalsCreatePage/GoalsCreateForm';

const GoalsOverviewPage = () => {
  return (
    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <GoalsBadgesPanel />
      <GoalsCreateForm />
    </div>
  );
};

export default GoalsOverviewPage;
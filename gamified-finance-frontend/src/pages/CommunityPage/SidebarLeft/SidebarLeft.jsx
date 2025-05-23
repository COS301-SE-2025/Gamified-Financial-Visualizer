import React from 'react';
import GoalCard from './GoalCard';
import BadgesPanel from './BadgesPanel';
import MiniGoalsList from './MiniGoalsList';

const SidebarLeft = () => {
  return (
    <div className="space-y-4">
      <GoalCard />
      <BadgesPanel />
      <MiniGoalsList />
    </div>
  );
};

export default SidebarLeft;

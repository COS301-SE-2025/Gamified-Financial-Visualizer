import React from 'react';
import XPProgressRing from '../../components/cards/XPProgressRing';
import BadgeRow from '../../components/cards/BadgeRow';
import GoalStatsCard from '../../components/cards/GoalStatsCard';

const GoalsSidebar = () => {
  return (
    <div className="w-full space-y-4">
      <XPProgressRing level={3} xp={350} />
      <BadgeRow />
      <GoalStatsCard />
    </div>
  );
};

export default GoalsSidebar;

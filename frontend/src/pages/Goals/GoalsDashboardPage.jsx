import React from 'react';
import GoalsViewLayout from '../layouts/GoalsViewLayout';
import GoalStatsCard from '../components/GoalStatsCard';
import GoalCard from '../components/GoalCard';
import XPProgressRing from '../components/XPProgressRing';
import BarChart from '../components/BarChart';
import DonutChart from '../components/DonutChart';
import BadgeRow from '../components/BadgeRow';

const GoalsDashboardPage = () => {
  return (

      <div className="grid grid-cols-12 gap-4">
        {/* Left Stats Column */}
        <div className="col-span-3 space-y-4">
          <XPProgressRing level={3} xp={350} />
          <BadgeRow />
          <GoalStatsCard /> 
        </div>

        {/* Center Area */}
        <div className="col-span-6 space-y-4">
          <div className="flex justify-between items-center">
            <input
              type="text"
              placeholder="Search..."
              className="w-3/4 p-2 border rounded-full shadow-sm"
            />
          </div>
        </div>

        {/* Right Sidebar placeholder (Notifications already fixed) */}
        <div className="col-span-3"></div>
      </div>
  );
};

export default GoalsDashboardPage;

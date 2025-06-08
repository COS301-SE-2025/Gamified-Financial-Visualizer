import React from 'react';
import GoalsViewLayout from '../../pages/Goals/GoalsViewLayout';
import GoalStatsCard from '../../components/cards/GoalStatsCard';
import GoalCard from '../../components/cards/GoalCard';
import XPProgressRing from '../../components/cards/XPProgressRing';
import BarChart from '../../components/charts/BarChart';
import DonutChart from '../../components/charts/DonutChart';
import BadgeRow from '../../components/cards/BadgeRow';

// ✅ Logging *after* imports
console.log('GoalsViewLayout:', GoalsViewLayout);
console.log('GoalStatsCard:', GoalStatsCard);
console.log('GoalCard:', GoalCard);
console.log('XPProgressRing:', XPProgressRing);
console.log('BarChart:', BarChart);
console.log('DonutChart:', DonutChart);
console.log('BadgeRow:', BadgeRow);


const GoalsPage = () => {
  return (
    <GoalsViewLayout>
      <div className="grid grid-cols-12 gap-4">
        {/* Left Sidebar */}
        <div className="col-span-3 space-y-4">
          <XPProgressRing level={3} xp={350} />
          <BadgeRow />
          <GoalStatsCard />
        </div>

        {/* Main Content */}
        <div className="col-span-6 space-y-4">
          <div className="flex justify-between items-center">
            <input
              type="text"
              placeholder="Search..."
              className="w-3/4 p-2 border rounded-full shadow-sm"
            />
            <div className="space-x-2">
              <button className="btn-primary">Create Goal</button>
              <button className="btn-secondary">View All</button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <BarChart />
            <DonutChart />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <GoalCard />
            <GoalCard />
          </div>
        </div>

        {/* Right Empty (Notifications handled in layout) */}
        <div className="col-span-3"></div>
      </div>
    </GoalsViewLayout>
  );
};

// const GoalsPage = () => {
//   return (
//     <GoalsViewLayout>
//       <div>TEST</div>
//     </GoalsViewLayout>
//   );
// };


export default GoalsPage;

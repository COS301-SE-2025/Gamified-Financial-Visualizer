import React from 'react';
import GoalsViewLayout from '../../pages/Goals/GoalsViewLayout';
import GoalCard from '../../components/cards/GoalCard';
import BarChart from '../../components/charts/BarChart';
import DonutChart from '../../components/charts/DonutChart';

const GoalsPage = () => {
  return (
    <GoalsViewLayout>
      <div className="space-y-4">
        {/* Top: Search + Buttons */}
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

        {/* Charts */}
        <div className="grid grid-cols-2 gap-4">
          <BarChart />
          <DonutChart />
        </div>

        {/* Goal Cards */}
        <div className="grid grid-cols-2 gap-4">
          <GoalCard />
          <GoalCard />
        </div>
      </div>
    </GoalsViewLayout>
  );
};

export default GoalsPage;
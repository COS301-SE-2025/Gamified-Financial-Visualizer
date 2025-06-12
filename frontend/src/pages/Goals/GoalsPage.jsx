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
        </div>
      </div>
    </GoalsViewLayout>
  );
};

export default GoalsPage;
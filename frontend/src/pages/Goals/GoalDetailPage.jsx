import React from 'react';
import GoalsViewLayout from '../../pages/Goals/GoalsViewLayout';
import GoalDetailStats from '../../components/cards/GoalDetailStats';

const GoalsDetailPage = () => {
  return (
    <GoalsViewLayout>
      <div className="flex gap-6">
        <div className="w-full bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-6">
            <img src="/goals/vacation.jpg" className="rounded-xl w-1/3" alt="Goal" />
            <div>
              <h2 className="text-xl font-bold text-orange-600">Vacation - Bali</h2>
              <p className="text-sm">2000/4000 ZAR | <span className="text-blue-500">2000 ZAR Left</span></p>
              <p>Goal will be accomplished on <span className="text-green-700 font-semibold">21/07/2027</span></p>
              <div className="flex gap-2 mt-2">
                <span className="tag">In-Progress</span>
                <span className="tag">Vacation</span>
              </div>
            </div>
          </div>

          <GoalDetailStats />

          <div className="mt-4 text-right">
            <button className="btn-danger">Delete</button>
          </div>
        </div>
      </div>
    </GoalsViewLayout>
  );
};

export default GoalsDetailPage;

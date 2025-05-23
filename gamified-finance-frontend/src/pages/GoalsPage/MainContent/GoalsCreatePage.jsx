import React from 'react';
import GoalsHeader from './GoalsHeader';
import GoalsProfileCard from './GoalsProfileCard';
import GoalsLevelCard from './GoalsLevelCard';
import GoalsCreateForm from './GoalsCreateForm';

const GoalsCreatePage = () => {
  return (
    <div className="flex gap-6 p-6">
      {/* Left Sidebar */}
      <div className="w-1/4 space-y-4">
        <GoalsHeader />
        <GoalsProfileCard />
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-4">
        <GoalsLevelCard />

        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <h3 className="text-md font-semibold text-red-500 mb-2">Create Goal</h3>
          <GoalsCreateForm />
        </div>
      </div>
    </div>
  );
};

export default GoalsCreatePage;

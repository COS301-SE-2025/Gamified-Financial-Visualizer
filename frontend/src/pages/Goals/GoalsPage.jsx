import React, { useState } from 'react';
import GoalsViewLayout from './GoalsViewLayout';
import GoalOverviewCards from '../../components/cards/GoalOverviewCards';
import GoalCard from '../../components/cards/GoalCard';
import DonutChart from '../../components/charts/DonutChart';
import BarChart from '../../components/charts/BarChart';
import UpcomingDeadlinesCard from '../../components/cards/UpcomingDeadlinesCard';

import vacationImg from '../../assets/Images/banners/pixelStore.gif';
import pcImg from '../../assets/Images/banners/pixelHouse.gif';
import cameraImg from '../../assets/Images/banners/pixelStudents.jpeg';

const GoalsPage = () => {

  const goals = [
    { title: 'Vacation: Bali', image: vacationImg, progress: 80, target: 10000, dueDate: '20 Jul 2025' },
    { title: 'New PC', image: pcImg, progress: 55, target: 2500, dueDate: '5 Aug 2025' },
    { title: 'Camera Kit', image: cameraImg, progress: 30, target: 1500, dueDate: '15 Sept 2025' },
    { title: 'Vacation: Bali', image: vacationImg, progress: 80, target: 10000, dueDate: '20 Jul 2025' },
    { title: 'New PC', image: pcImg, progress: 55, target: 2500, dueDate: '5 Aug 2025' },
    { title: 'Camera Kit', image: cameraImg, progress: 30, target: 1500, dueDate: '15 Sept 2025' },
  ];

  return (
    <GoalsViewLayout>
      <div className="flex flex-col gap-6 px-6 py-6">
        {/* Top Charts and Overview */}
        <div className="w-4/4 overflow-hidden grid grid-cols-12 gap-4">
          <div className="col-span-3 flex flex-col gap-6">
            <GoalOverviewCards />
            <UpcomingDeadlinesCard />
          </div>
          <div className="col-span-5">
            <BarChart />
          </div>
          <div className="col-span-4">
            <DonutChart />
          </div>
        </div>

        {/* Goal Cards */}
        <div className="grid grid-cols-3 gap-6">
          {goals.map((goal, idx) => (
            <GoalCard key={idx} {...goal} />
          ))}
        </div>
      </div>
    </GoalsViewLayout>
  );
};


export default GoalsPage;
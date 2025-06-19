import React, { useEffect, useState } from 'react';
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
  const user = JSON.parse(localStorage.getItem('user'));
  const [goals, setGoals] = useState([]);

  const bannerImages = [vacationImg, pcImg, cameraImg];

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/goal/user/${user.id}`);
        const data = await res.json();
        setGoals(data.data || []); // assuming response format { status, message, data: [] }
      } catch (error) {
        console.error('Failed to fetch goals:', error);
      }
    };

    if (user?.id) {
      fetchGoals();
    }
  }, [user?.id]);

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
          {goals.map((goal, idx) => {
            const randomImage = bannerImages[Math.floor(Math.random() * bannerImages.length)];
            return <GoalCard key={idx} {...goal} image={randomImage} />;
          })}
        </div>
      </div>
    </GoalsViewLayout>
  );
};

export default GoalsPage;
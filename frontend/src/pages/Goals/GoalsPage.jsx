// pages/GoalsPage.tsx
import React, { useEffect, useState } from 'react';
import GoalsViewLayout from './GoalsViewLayout';

import { FaSearch } from 'react-icons/fa';

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
        setGoals(data.data || []);
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
          <div className="col-span-3 flex flex-col gap-8">
            <GoalOverviewCards />
            <UpcomingDeadlinesCard />
          </div>
          <div className="col-span-4">
            <BarChart />
          </div>
          <div className="col-span-3">
            <DonutChart />
          </div>
        </div>

        {/*Search Input */}
        <div className="flex items-center w-full max-w-3xl -ml-[8px] px-4 py-2 rounded-3xl border-2 border-[#E5794B] bg-white shadow-sm">
          <FaSearch className="text-[#E5794B] mr-2" />
          <input
            type="text"
            placeholder="Search your goals..."
            className="w-full outline-none bg-transparent text-sm text-[#E5794B] placeholder-[#E5794B]/70"
          />
        </div>

        {/* Goal Cards */}
        <div className="grid grid-cols-3 gap-6">
          {goals.map((goal) => {
            const randomImage = bannerImages[goal.banner_id % bannerImages.length];
            const progress = Math.min(
              Math.round((Number(goal.current_amount) / Number(goal.target_amount)) * 100),
              100
            );
            const formattedTargetDate = new Date(goal.target_date).toLocaleDateString('en-ZA', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            });

            return (
              <GoalCard
                key={goal.goal_id}
                goalId={goal.goal_id}  // Pass goal_id as goalId prop
                title={goal.goal_name}
                image={randomImage}
                progress={progress}
                target={goal.target_amount}
                dueDate={formattedTargetDate}
              />
            );
          })}
        </div>
      </div>
    </GoalsViewLayout>
  );
};

export default GoalsPage;
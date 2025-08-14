import React, { useEffect, useState, useMemo } from 'react';
import GoalsViewLayout from './GoalsViewLayout';
import { FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import GoalOverviewCards from '../../components/cards/GoalOverviewCards';
import GoalCard from '../../components/cards/GoalCard';
import DonutChart from '../../components/charts/DonutChart';
import BarChart from '../../components/charts/BarChart';

import goal1 from '../../assets/Images/banners/pixelApartment.gif';
import goal2 from '../../assets/Images/banners/pixelHouse.gif';
import goal3 from '../../assets/Images/banners/pixelOffice1.gif';

const PAGE_SIZE = 3;

const GoalsPage = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [goals, setGoals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [latestGoal, setLatestGoal] = useState(null);
  const [page, setPage] = useState(1);

  const bannerImages = [goal1, goal2, goal3];

  // Fetch goals
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/goal/user/${user.id}`);
        const data = await res.json();
        setGoals(data.data || []);
      } catch (e) {
        console.error('Failed to fetch goals', e);
      }
    };
    if (user?.id) fetchGoals();
  }, [user?.id]);

  // Latest accomplished goal
  useEffect(() => {
    const fetchLatestGoal = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/goal/latest-completed/${user.id}`);
        const data = await res.json();
        setLatestGoal(data.data || null);
      } catch (e) {
        console.error('Failed to fetch latest goal', e);
      }
    };
    if (user?.id) fetchLatestGoal();
  }, [user?.id]);

  // Filter + pagination
  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return term
      ? goals.filter(g => g.goal_name?.toLowerCase().includes(term))
      : goals;
  }, [goals, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const clampedPage = Math.min(page, totalPages);
  useEffect(() => {
    if (page !== clampedPage) setPage(clampedPage);
  }, [clampedPage, page]);

  const sliceStart = (clampedPage - 1) * PAGE_SIZE;
  const visibleGoals = filtered.slice(sliceStart, sliceStart + PAGE_SIZE);

  const renderGoalCard = (g) => {
    const img = bannerImages[(g.banner_id) % bannerImages.length];
    const progress = Math.min(
      Math.round((Number(g.current_amount) / Number(g.target_amount)) * 100),
      100
    );
    const due = new Date(g.target_date).toLocaleDateString('en-ZA', {
      day: '2-digit', month: 'short', year: 'numeric'
    });

    return (
      <GoalCard
        key={g.goal_id}
        goalId={g.goal_id}
        title={g.goal_name}
        image={img}
        progress={progress}
        target={g.target_amount}
        dueDate={due}
      />
    );
  };

  return (
    <GoalsViewLayout>
      <div className="flex flex-col gap-6 px-4 sm:px-6 py-6 w-full max-w-screen-2xl mx-auto">

        {/* Search bar (top) */}
        <div className="w-full">
          <div className="flex items-center w-full px-4 py-2 border border-[#76B947] rounded-full bg-white shadow-sm dark:bg-gray-800">
            <FaSearch className="text-[#76B947] mr-2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              placeholder="Search your goals..."
              className="w-full outline-none bg-transparent text-sm text-[#76B947] placeholder-[#76B947]/70"
            />
          </div>
        </div>

        {/* Main content: left 2x2 grid, right 1x3 paginated list */}
        <div className="grid grid-cols-12 gap-6">

          {/* LEFT: 2x2 grid */}
          <div className="col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="bg-white rounded-2xl shadow-md p-4 min-h-[280px] dark:bg-gray-800">
              <BarChart />
            </div>
            {/* Donut Chart */}
            <div className="bg-white rounded-2xl shadow-md p-4 min-h-[280px] overflow-hidden dark:bg-gray-800">
              <DonutChart />
            </div>
            {/* Latest Accomplished Goal */}
            <div className="bg-white rounded-2xl shadow-md p-4 min-h-[280px] dark:bg-gray-800">
              {latestGoal ? (
                <GoalCard
                  goalId={latestGoal.goal_id}
                  title={latestGoal.goal_name}
                  image={bannerImages[(latestGoal.banner_id) % bannerImages.length]}
                  progress={100}
                  target={latestGoal.target_amount}
                  dueDate={new Date(latestGoal.completed_date).toLocaleDateString('en-ZA', {
                    day: '2-digit', month: 'short', year: 'numeric'
                  })}
                />
              ) : (
                <div className="text-gray-400 text-sm h-full flex items-center justify-center">
                  No completed goals yet
                </div>
              )}
            </div>
            {/* Goal Totals */}
            <div className="bg-white rounded-2xl shadow-md p-4 min-h-[280px] dark:bg-gray-800">
              <GoalOverviewCards />
            </div>
          </div>

          {/* RIGHT: 1x3 list with pagination */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-md p-4 dark:bg-gray-800">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 dark:text-gray-200">
                Your Goals
              </h3>

              <div className="grid grid-cols-1 gap-6">
                {visibleGoals.map(renderGoalCard)}
                {visibleGoals.length === 0 && (
                  <div className="text-center text-gray-500 text-sm py-10">
                    {searchTerm ? 'No matching goals.' : 'No goals yet.'}
                  </div>
                )}
              </div>

              {/* Pagination */}
              {filtered.length > PAGE_SIZE && (
                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={clampedPage === 1}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm border
                      ${clampedPage === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}
                      dark:border-gray-600`}
                  >
                    <FaChevronLeft /> Prev
                  </button>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Page {clampedPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={clampedPage === totalPages}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm border
                      ${clampedPage === totalPages ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}
                      dark:border-gray-600`}
                  >
                    Next <FaChevronRight />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </GoalsViewLayout>
  );
};

export default GoalsPage;

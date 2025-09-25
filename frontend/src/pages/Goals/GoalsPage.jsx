// GoalsPage.jsx
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

const PAGE_SIZE = 6;

const GoalsPage = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [goals, setGoals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [latestGoal, setLatestGoal] = useState(null);
  const [page, setPage] = useState(1);

  const bannerImages = [goal1, goal2, goal3];

  const getBanner = (id) => {
    const n = bannerImages.length;
    const idx = ((Number(id) || 1) - 1 + n) % n;
    return bannerImages[idx];
  };

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

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return term ? goals.filter((g) => g.goal_name?.toLowerCase().includes(term)) : goals;
  }, [goals, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const clampedPage = Math.min(page, totalPages);
  useEffect(() => {
    if (page !== clampedPage) setPage(clampedPage);
  }, [clampedPage, page]);

  const sliceStart = (clampedPage - 1) * PAGE_SIZE;
  const visibleGoals = filtered.slice(sliceStart, sliceStart + PAGE_SIZE);

  const latestCompletedLocal = useMemo(() => {
    if (!goals?.length) return null;
    const completed = goals.filter((g) => {
      const status = String(g.goal_status || '').toLowerCase();
      const reachedTarget = Number(g.current_amount) >= Number(g.target_amount);
      return status === 'completed' || reachedTarget || Boolean(g.completed_date);
    });
    if (!completed.length) return null;
    completed.sort((a, b) => {
      const da = new Date(a.completed_date || a.updated_at || a.target_date || a.created_at || 0);
      const db = new Date(b.completed_date || b.updated_at || b.target_date || b.created_at || 0);
      return db - da;
    });
    return completed[0];
  }, [goals]);

  const latest = latestGoal ?? latestCompletedLocal;

  const renderGoalCard = (g) => {
    const img = getBanner(g.banner_id);
    const progress = Math.min(
      Math.round((Number(g.current_amount) / Number(g.target_amount)) * 100),
      100
    );
    const due = new Date(g.target_date).toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
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
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Goals</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Set savings goals and milestones, monitor your progress, and earn XP as you achieve them.
          </p>
        </div>

        {/* Search bar */}
        <div className="w-full max-w-md mx-auto">
          <div className="flex items-center w-full px-4 py-3 border border-[#76B947] dark:border-[#AAD977] rounded-full bg-white shadow-sm dark:bg-gray-800">
            <FaSearch className="text-[#76B947] mr-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Search your goals..."
              className="w-full outline-none bg-transparent text-[#76B947] dark:text-[#AAD977] placeholder-[#76B947]/70"
            />
          </div>
        </div>

        {/* Main Grid - 2x2 layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left Column - Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Weekly Goal Completion */}
            <div className="bg-white rounded-xl shadow-sm p-4 dark:bg-gray-800">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 dark:text-gray-200">
                Weekly Goal Completion
              </h3>
              <div className="h-40">
                <BarChart />
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-xl shadow-sm p-4 dark:bg-gray-800">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 dark:text-gray-200">
                Category Breakdown
              </h3>
              <div className="h-40">
                <DonutChart />
              </div>
            </div>

            {/* Goal Overview - Spans both columns on mobile, single column on desktop */}
            <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-4 dark:bg-gray-800">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 dark:text-gray-200">
                Goal Overview
              </h3>
              <GoalOverviewCards />
            </div>
          </div>

          {/* Right Column - Stats and Latest Accomplishment */}
          <div className="grid grid-cols-1 gap-4">
            {/* Latest Accomplishment */}
            <div className="bg-white rounded-xl shadow-sm p-4 dark:bg-gray-800">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 dark:text-gray-200">
                Latest Accomplishment
              </h3>
              {latest ? (
                <div className="text-center p-4">
                  <div className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">
                    {latest.goal_name}
                  </div>
                  <div className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    {latest.target_amount} ZAR
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Completed on {new Date(latest.completed_date || latest.target_date).toLocaleDateString()}
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 text-sm h-32 flex items-center justify-center">
                  No completed goals yet
                </div>
              )}
            </div>

            {/* Additional Stats Card (optional) */}
            <div className="bg-white rounded-xl shadow-sm p-4 dark:bg-gray-800">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 dark:text-gray-200">
                Progress Summary
              </h3>
              <div className="text-center p-4">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {goals.filter(g => g.goal_status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Goals Completed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Goals Grid Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 dark:bg-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 sm:mb-0">
              Your Goals {filtered.length > 0 && `(${filtered.length})`}
            </h3>
            
            {filtered.length > PAGE_SIZE && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Page {clampedPage} of {totalPages}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={clampedPage === 1}
                    className={`flex items-center gap-1 px-3 py-1 rounded text-sm border
                      ${clampedPage === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}
                      dark:border-gray-600`}
                  >
                    <FaChevronLeft className="text-xs" /> 
                    Prev
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={clampedPage === totalPages}
                    className={`flex items-center gap-1 px-3 py-1 rounded text-sm border
                      ${clampedPage === totalPages ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}
                      dark:border-gray-600`}
                  >
                    Next
                    <FaChevronRight className="text-xs" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {visibleGoals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleGoals.map(renderGoalCard)}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">
                {searchTerm ? 'No matching goals found' : 'No goals yet'}
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {searchTerm ? 'Try adjusting your search terms' : 'Create your first goal to get started!'}
              </p>
            </div>
          )}

          {filtered.length > PAGE_SIZE && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Showing {sliceStart + 1}-{Math.min(sliceStart + PAGE_SIZE, filtered.length)} of {filtered.length} goals
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={clampedPage === 1}
                  className={`flex items-center gap-2 px-4 py-2 rounded text-sm border
                    ${clampedPage === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}
                    dark:border-gray-600`}
                >
                  <FaChevronLeft className="text-xs" /> 
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={clampedPage === totalPages}
                  className={`flex items-center gap-2 px-4 py-2 rounded text-sm border
                    ${clampedPage === totalPages ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}
                    dark:border-gray-600`}
                >
                  Next
                  <FaChevronRight className="text-xs" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </GoalsViewLayout>
  );
};

export default GoalsPage;
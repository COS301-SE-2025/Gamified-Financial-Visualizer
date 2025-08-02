import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaUmbrellaBeach } from 'react-icons/fa';
import GoalsViewLayout from '../../pages/Goals/GoalsViewLayout';
import goal1 from '../../assets/Images/banners/pixelApartment.gif';
import goal2 from '../../assets/Images/banners/pixelHouse.gif';
import goal3 from '../../assets/Images/banners/pixelOffice1.gif';

const GoalsDetailPage = () => {
  const { goalId } = useParams();
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const bannerImages = [goal1, goal2, goal3];

  useEffect(() => {
    const fetchGoalDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/goal/${goalId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch goal details');
        }
        const data = await response.json();
        setGoal(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (goalId) {
      fetchGoalDetails();
    }
  }, [goalId]);

  if (loading) return <div className="flex justify-center mt-6 dark:text-gray-300">Loading...</div>;
  if (error) return <div className="flex justify-center mt-6 text-red-500 dark:text-red-400">Error: {error}</div>;
  if (!goal) return <div className="flex justify-center mt-6 dark:text-gray-300">Goal not found</div>;

  // Calculate progress percentage
  let percentage = Math.round((goal.current_amount / goal.target_amount) * 100);
  if (percentage > 100) percentage = 100;
  let amountLeft = goal.target_amount - goal.current_amount;
  if (amountLeft < 0) amountLeft = 0;

  // Format dates
  const startDate = new Date(goal.start_date).toLocaleDateString('en-GB');
  const targetDate = new Date(goal.target_date).toLocaleDateString('en-GB');

  return (
    <GoalsViewLayout>
      <div className="flex gap-6 justify-center mt-6">
        <div className="w-full max-w-4xl bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md dark:shadow-lg border border-gray-100 dark:border-gray-700">
          {/* Back Button */}
          <div className="max-w-4xl mx-auto mb-4">
            <button
              onClick={() => navigate(-1)}
              className="text-sm text-white hover:bg-[#88BC46] flex items-center gap-1 border-[#AAD977] rounded-full border w-28 h-8 justify-center bg-[#AAD977] dark:bg-[#7FDD53] dark:border-[#7FDD53] dark:hover:bg-[#6BC026] transition-colors"
            >
              Back to Goals
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Goal Image */}
            <img 
              src={bannerImages[goal.banner_id-1]} 
              alt="Goal" 
              className="rounded-xl w-full md:w-1/3 object-cover shadow dark:shadow-md" 
            />

            {/* Goal Info */}
            <div className="flex-1 space-y-2">
              {/* Progress Ring */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-24 h-24">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#F3F4F6"
                      strokeWidth="10"
                      className="dark:stroke-gray-700"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="url(#grad1)"
                      strokeWidth="10"
                      strokeDasharray="282"
                      strokeDashoffset={282 - (282 * percentage) / 100}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                    <defs>
                      <linearGradient id="grad1" x1="1" y1="0" x2="0" y2="1">
                        <stop offset="40%" stopColor="#FF4C28" />
                        <stop offset="100%" stopColor="#FFCE51" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-orange-500 dark:text-orange-400 font-bold text-lg">{percentage}%</span>
                  </div>
                </div>

                {/* Title + Progress Info */}
                <div>
                  <h2 className="text-2xl font-medium text-gray-800 dark:text-white flex items-center gap-2">
                    {goal.goal_name} <FaUmbrellaBeach className="text-[#AAD977] dark:text-[#7FDD53]" />
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-[#ED5E52] dark:text-[#F87171] font-medium">{goal.current_amount} ZAR</span>/
                    <span className="text-gray-800 dark:text-gray-200 font-normal">{goal.target_amount} ZAR</span> |
                    <span className="text-[#5FBFFF] dark:text-[#93C5FD] font-semibold ml-1">{amountLeft} ZAR Left</span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Goal will be accomplished on{' '}
                    <span className="text-[#E6904E] dark:text-[#F59E0B] font-semibold">{targetDate}</span>
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-[#4B82A2] dark:text-blue-300 text-xs rounded-full shadow-sm capitalize">
                      {goal.goal_status.replace('-', ' ')}
                    </span>
                    <span className="px-3 py-1 border border-orange-400 dark:border-orange-500 text-orange-500 dark:text-orange-400 text-xs rounded-full shadow-sm capitalize">
                      {goal.goal_type}
                    </span>
                    <span className="px-3 py-1 border border-[#E6904E] dark:border-[#F59E0B] text-[#E6904E] dark:text-[#F59E0B] text-xs rounded-full shadow-sm">
                      Started: {startDate}
                    </span>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs rounded-full shadow-sm">
                      20 XP Reward
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Delete Button */}
          <div className="mt-8 text-right">
            <button
              onClick={() => setShowConfirm(true)}
              disabled={isDeleting}
              className={`px-5 py-2 bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40 rounded-full flex items-center gap-2 text-sm font-medium transition-colors ${
                isDeleting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <FaTrashAlt />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-xl p-6 w-full max-w-sm space-y-4 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-red-500 dark:text-red-400">Confirm Goal Deletion</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Are you sure you want to delete this goal? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setIsDeleting(true);
                  try {
                    const response = await fetch(`http://localhost:5000/api/goal/${goalId}`, {
                      method: 'DELETE',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                      }
                    });

                    if (!response.ok) {
                      throw new Error('Failed to delete goal');
                    }

                    navigate('/goals', { state: { message: 'Goal deleted successfully' } });
                  } catch (err) {
                    setError(err.message);
                  } finally {
                    setIsDeleting(false);
                    setShowConfirm(false);
                  }
                }}
                className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </GoalsViewLayout>
  );
};

export default GoalsDetailPage;
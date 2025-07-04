
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


import { FaTrashAlt, FaUmbrellaBeach } from 'react-icons/fa';
import GoalsViewLayout from '../../pages/Goals/GoalsViewLayout';
import image from '../../assets/Images/banners/pixelAllyway.jpeg';
const GoalsDetailPage = () => {

  const { goalId } = useParams();
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);


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

  if (loading) return <div className="flex justify-center mt-6">Loading...</div>;
  if (error) return <div className="flex justify-center mt-6 text-red-500">Error: {error}</div>;
  if (!goal) return <div className="flex justify-center mt-6">Goal not found</div>;

  // Calculate progress percentage
  const percentage = Math.round((goal.current_amount / goal.target_amount) * 100);
  const amountLeft = goal.target_amount - goal.current_amount;

  // Format dates
  const startDate = new Date(goal.start_date).toLocaleDateString('en-GB');
  const targetDate = new Date(goal.target_date).toLocaleDateString('en-GB');

  return (
    <GoalsViewLayout>
      <div className="flex gap-6 justify-center mt-6">
        <div className="w-full max-w-4xl bg-white p-6 rounded-2xl shadow-md">
          {/* Back Button */}
          <div className="max-w-4xl mx-auto mb-4">
            <button
              onClick={() => navigate(-1)}
              className="text-sm text-white hover:[#88BC46] flex items-center gap-1 border-[#AAD977] rounded-full border w-28 h-8 justify-center bg-[#AAD977] "
            >
              Back to Goals
            </button>
          </div>

          <div className="flex items-start gap-6">
            {/* Goal Image */}
            <img src={image} alt="Goal" className="rounded-xl w-1/3 object-cover shadow" />

            {/* Goal Info */}
            <div className="flex-1 space-y-2">
              {/* Progress Ring */}
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#F3F4F6"
                      strokeWidth="10"
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
                    <span className="text-orange-500 font-bold text-lg">{percentage}%</span>
                  </div>
                </div>

                {/* Title + Progress Info */}
                <div>
                  <h2 className="text-2xl font-medium text-gray-800 flex items-center gap-2">
                    {goal.goal_name} <FaUmbrellaBeach className="text-[#AAD977]" />
                  </h2>
                  <p className="text-sm text-gray-600">
                    <span className="text-[#ED5E52] font-medium">{goal.current_amount} ZAR</span>/
                    <span className="text-gray-800 font-normal">{goal.target_amount} ZAR</span> |
                    <span className="text-[#5FBFFF] font-semibold ml-1">{amountLeft} ZAR Left</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Goal will be accomplished on{' '}
                    <span className="text-[#E6904E] font-semibold">{targetDate}</span>
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-3 py-1 bg-blue-100 text-[#4B82A2] text-xs rounded-full shadow-sm capitalize">
                      {goal.goal_status.replace('-', ' ')}
                    </span>
                    <span className="px-3 py-1 border border-orange-400 text-orange-500 text-xs rounded-full shadow-sm capitalize">
                      {goal.goal_type}
                    </span>
                    <span className="px-3 py-1 border border-[#E6904E] text-[#E6904E] text-xs rounded-full shadow-sm">
                      Started: {startDate}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-600 text-xs rounded-full shadow-sm">
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
              className={`px-5 py-2 bg-red-100 text-red-500 hover:bg-red-200 rounded-full flex items-center gap-2 text-sm font-medium ${isDeleting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
            >
              <FaTrashAlt />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
          
        </div>
      </div>
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm space-y-4">
            <h2 className="text-lg font-semibold text-red-500">Confirm Goal Deletion</h2>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete this goal? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
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
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
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
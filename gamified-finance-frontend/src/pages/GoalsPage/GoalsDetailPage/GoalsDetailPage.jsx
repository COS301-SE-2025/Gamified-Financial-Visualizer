import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GoalPage from '../GoalPage';
import GoalsHeader from '../MainContent/GoalsHeader';
import GoalsLevelCard from '../MainContent/GoalsLevelCard';

import goal1 from '../../../assets/Images/pixelAllyway.jpeg';
import goal2 from '../../../assets/Images/pixelMoonLight.jpeg';
import goal3 from '../../../assets/Images/pixelPath.jpeg';
import goal4 from '../../../assets/Images/pixelStore.jpeg';

import reward1 from '../../../assets/Images/highFiveIcon.png';
import reward2 from '../../../assets/Images/awardIcon.png';
import reward3 from '../../../assets/Images/mountainIcon.png';
import reward4 from '../../../assets/Images/moneyGrowIcon.png';

const defaultImages = [goal1, goal2, goal3, goal4];

const GoalsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGoal();
  }, [id]);

  const fetchGoal = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`http://localhost:5002/api/goal/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success' && data.data) {
          setGoal(data.data);
        } else {
          setError('Goal not found');
        }
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        setError(errorData.message || 'Failed to fetch goal');
      }
    } catch (err) {
      console.error('Error fetching goal:', err);
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGoal = async () => {
    if (!window.confirm('Are you sure you want to delete this goal?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5002/api/goal/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        navigate('/goals');
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        alert('Failed to delete goal: ' + (errorData.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error deleting goal:', err);
      alert('Network error occurred while deleting goal');
    }
  };

  const getGoalImage = (index = 0) => {
    return defaultImages[index % defaultImages.length];
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <span className="ml-2 text-gray-600">Loading goal...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">❌ {error}</p>
        <button 
          onClick={() => navigate('/goals')}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 mr-2"
        >
          Back to Goals
        </button>
        <button 
          onClick={fetchGoal}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!goal) {
    return <div className="p-6 text-red-500">Goal not found</div>;
  }

  const progress = Math.min(((goal.current_amount || 0) / goal.target_amount) * 100, 100).toFixed(0);
  const remaining = goal.target_amount - (goal.current_amount || 0);
  const goalImage = getGoalImage(goal.goal_id);

  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-6 mt-6">
        {/* Banner */}
        <div className="relative w-full rounded-lg overflow-hidden shadow-sm mb-6">
          <img src={goalImage} alt={goal.goal_name} className="w-full h-40 object-cover" />
          <div className="absolute bottom-3 left-4 text-white">
            <h1 className="text-2xl font-extrabold drop-shadow">{goal.goal_name}</h1>
            <p className="text-sm text-gray-100 drop-shadow capitalize">{goal.goal_type}</p>
          </div>
          <div className="absolute top-3 right-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              goal.goal_status === 'in-progress' ? 'bg-green-100 text-green-700' :
              goal.goal_status === 'completed' ? 'bg-blue-100 text-blue-700' :
              goal.goal_status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
              goal.goal_status === 'cancelled' ? 'bg-gray-100 text-gray-700' :
              'bg-red-100 text-red-700'
            }`}>
              {goal.goal_status}
            </span>
          </div>
        </div>

        {/* Progress Ring */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-28 h-28">
            <svg viewBox="0 0 120 120" className="absolute top-0 left-0 w-full h-full transform -rotate-90">
              <circle cx="60" cy="60" r="52" stroke="#e5e7eb" strokeWidth="8" fill="none" />
              <circle
                cx="60"
                cy="60"
                r="52"
                stroke="url(#progressGradient)"
                strokeWidth="8"
                fill="none"
                strokeDasharray="326.56"
                strokeDashoffset={(1 - progress / 100) * 326.56}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="progressGradient" x1="1" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-bold text-green-600 text-lg">
              {progress}%
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">Goal Progress</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-8">
          <div className="bg-gray-50 rounded-xl p-4 shadow text-center">
            <p className="text-xs text-gray-500 mb-1">Current Amount</p>
            <p className="text-green-600 font-bold text-lg">{formatCurrency(goal.current_amount)}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 shadow text-center">
            <p className="text-xs text-gray-500 mb-1">Target Amount</p>
            <p className="text-blue-600 font-bold text-lg">{formatCurrency(goal.target_amount)}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 shadow text-center">
            <p className="text-xs text-gray-500 mb-1">Remaining</p>
            <p className="text-red-500 font-bold text-lg">{formatCurrency(remaining)}</p>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-8">
          {goal.created_at && (
            <div className="bg-gray-50 rounded-xl p-4 shadow text-center">
              <p className="text-xs text-gray-500 mb-1">Created</p>
              <p className="text-gray-700 font-medium">
                {new Date(goal.created_at).toLocaleDateString()}
              </p>
            </div>
          )}
          {goal.target_date && (
            <div className="bg-gray-50 rounded-xl p-4 shadow text-center">
              <p className="text-xs text-gray-500 mb-1">Target Date</p>
              <p className="text-gray-700 font-medium">
                {new Date(goal.target_date).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Rewards */}
        <div className="mb-8">
          <h3 className="text-md font-semibold mb-2">🎖️ Goal Rewards</h3>
          <div className="flex gap-4 justify-center flex-wrap">
            {[reward1, reward2, reward3, reward4].map((r, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <img 
                  src={r} 
                  alt="Reward" 
                  className={`w-16 h-16 rounded-full border border-gray-300 shadow-sm ${
                    progress >= (i + 1) * 25 ? 'opacity-100' : 'opacity-30'
                  }`} 
                />
                <span className="text-xs text-gray-500">
                  {progress >= (i + 1) * 25 ? '✅' : `${(i + 1) * 25}%`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            ⬅️ Back
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 shadow">
            ✏️ Edit Goal
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 shadow">
            🗑️ Delete Goal
          </button>
        </div>
      </div>
    </>
  );
};

export default GoalsDetailPage;

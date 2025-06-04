import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import goal1 from '../../../assets/Images/pixelAllyway.jpeg';
import goal2 from '../../../assets/Images/pixelMoonLight.jpeg';
import goal3 from '../../../assets/Images/pixelPath.jpeg';
import goal4 from '../../../assets/Images/pixelStore.jpeg';

const defaultImages = [goal1, goal2, goal3, goal4];

const GoalsList = ({ filter = 'ongoing' }) => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        setError('');

        // Get user from localStorage
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          setError('Please log in to view your goals');
          setLoading(false);
          return;
        }

        const user = JSON.parse(storedUser);
        const userId = user.id;

        const response = await fetch(`http://localhost:5000/api/goal/user/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.status === 'success' && data.data) {
            setGoals(data.data);
          } else {
            setGoals([]);
            setError('No goals found');
          }
        } else {
          const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
          setError(errorData.message || 'Failed to fetch goals');
        }
      } catch (err) {
        console.error('Error fetching goals:', err);
        setError('Network error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  // Map UI filter to API goal_status
  const statusMap = {
    ongoing: 'in-progress',
    completed: 'completed',
    archived: ['paused', 'cancelled', 'failed'],
  };

  const filteredGoals = goals.filter((goal) => {
    const apiStatus = statusMap[filter];
    if (Array.isArray(apiStatus)) {
      return apiStatus.includes(goal.goal_status);
    }
    return goal.goal_status === apiStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <span className="ml-2 text-gray-600">Loading goals...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">❌ {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (filteredGoals.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">Ready to set your first goal...??</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {filteredGoals.map((goal, index) => {
        const progress = Math.min(
          (parseFloat(goal.current_amount) / parseFloat(goal.target_amount)) * 100,
          100
        ).toFixed(0);
        const image = defaultImages[index % defaultImages.length];

        return (
          <div
            key={goal.goal_id}
            className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col items-center p-4 transition hover:shadow-lg"
          >
            {/* Goal Image */}
            <img
              src={image}
              alt={goal.goal_name}
              className="w-full h-32 object-cover rounded-xl mb-3"
            />

            {/* Goal Name */}
            <div className="w-full text-center">
              <p className="text-sm font-medium text-gray-700">{goal.goal_name}</p>

              {/* Overlapping Badge Icons */}
              <div className="flex justify-center mt-2 mb-2 -space-x-2">
                <span className="w-6 h-6 bg-cyan-600 rounded-full border-2 border-white inline-block"></span>
                <span className="w-6 h-6 bg-cyan-500 rounded-full border-2 border-white inline-block"></span>
                <span className="w-6 h-6 bg-cyan-400 rounded-full border-2 border-white inline-block"></span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-orange-400 to-orange-600"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mb-3">{progress}% Complete</p>

              {/* View Button */}
              <button
                onClick={() => navigate(`/goals/${goal.goal_id}`)}
                className="px-4 py-1 text-sm bg-gradient-to-r from-green-300 to-green-500 text-white rounded-full shadow hover:scale-105 transition"
              >
                View
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GoalsList;
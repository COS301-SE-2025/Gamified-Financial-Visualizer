import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import your default images
import goal1 from '../../../assets/Images/pixelAllyway.jpeg';
import goal2 from '../../../assets/Images/pixelMoonLight.jpeg';
import goal3 from '../../../assets/Images/pixelPath.jpeg';
import goal4 from '../../../assets/Images/pixelStore.jpeg';

const defaultImages = [goal1, goal2, goal3, goal4];

const GoalsList = ({ filter = 'ongoing' }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const userId = 1;

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch goals for the user
      const response = await fetch(`http://localhost:5002/api/goal/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Fetch response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Fetch response data:', data);
        
        if (data.status === 'success' && data.data) {
          setGoals(data.data);
        } else {
          setGoals([]);
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

  const getRandomImage = (index) => {
    return defaultImages[index % defaultImages.length];
  };

  const calculateProgress = (current, target) => {
    if (!current || !target) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredGoals = goals.filter(goal => {
    if (filter === 'ongoing') return goal.goal_status === 'in-progress';
    if (filter === 'completed') return goal.goal_status === 'completed';
    if (filter === 'failed') return goal.goal_status === 'failed';
    if (filter === 'paused') return goal.goal_status === 'paused';
    if (filter === 'cancelled') return goal.goal_status === 'cancelled';
    return true;
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
          onClick={fetchGoals}
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
        <p className="text-gray-500 mb-4">No goals found for this filter.</p>
        <button 
          onClick={() => navigate('/goals/create')}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Create Your First Goal
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredGoals.map((goal, index) => {
        const progress = calculateProgress(goal.current_amount || 0, goal.target_amount);
        const image = getRandomImage(index);
        
        return (
          <div 
            key={goal.goal_id} 
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/goals/${goal.goal_id}`)}
          >
            <div className="flex items-center gap-4">
              {/* Goal Image */}
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={image} 
                  alt={goal.goal_name} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Goal Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-800 truncate">
                      {goal.goal_name}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize">
                      {goal.goal_type}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    goal.goal_status === 'in-progress' ? 'bg-green-100 text-green-700' :
                    goal.goal_status === 'completed' ? 'bg-blue-100 text-blue-700' :
                    goal.goal_status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                    goal.goal_status === 'cancelled' ? 'bg-gray-100 text-gray-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {goal.goal_status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{formatCurrency(goal.current_amount || 0)}</span>
                    <span>{formatCurrency(goal.target_amount)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {progress.toFixed(1)}% complete
                  </div>
                </div>

                {/* Target Date */}
                {goal.target_date && (
                  <p className="text-xs text-gray-500">
                    Target: {new Date(goal.target_date).toLocaleDateString()}
                  </p>
                )}

                {/* Created Date */}
                {goal.created_at && (
                  <p className="text-xs text-gray-400">
                    Created: {new Date(goal.created_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GoalsList;
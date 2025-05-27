import React, { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { BsRepeat } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const goalImages = [
  { id: 1, name: 'Pixel Path', src: require('../../../assets/Images/pixelPath.jpeg') },
  { id: 2, name: 'Pixel Shop', src: require('../../../assets/Images/pixelShop.gif') },
  { id: 3, name: 'Pixel Moonlight', src: require('../../../assets/Images/pixelMoonLight.jpeg') },
];

const GoalsCreateForm = () => {
  const navigate = useNavigate();
  const [goal, setGoal] = useState({
    name: '',
    category: '',
    targetAmount: '',
    startDate: '',
    recurring: false,
    image: null,
  });

  const [xpReward, setXpReward] = useState(200);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGoal((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageSelect = (src) => {
    setGoal((prev) => ({ ...prev, image: src }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      setSubmitMessage('❌ Please log in to create a goal.');
      setIsSubmitting(false);
      return;
    }

    let userId;
    try {
      const user = JSON.parse(storedUser);
      userId = user.id;
      if (!userId) {
        throw new Error('User ID not found');
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      setSubmitMessage('❌ Invalid user data. Please log in again.');
      setIsSubmitting(false);
      return;
    }

    // Basic validation
    if (!goal.name || !goal.targetAmount || !goal.startDate) {
      setSubmitMessage('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare the request body
      const requestBody = {
        user_id: userId, // Dynamic user ID from localStorage
        community_id: null,
        goal_name: goal.name.trim(),
        goal_type: goal.category || 'savings',
        target_amount: Number(goal.targetAmount),
        target_date: goal.startDate,
        goal_status: 'in-progress',
      };

      console.log('Sending request body:', requestBody);

      const response = await fetch('http://localhost:5002/api/goal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        credentials: 'include', // Support session-based auth
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      let data;
      try {
        data = await response.json();
        console.log('Response data:', data);
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        const textResponse = await response.text();
        console.log('Raw response:', textResponse);
        throw new Error(`Server returned invalid JSON. Status: ${response.status}`);
      }

      if (response.ok && data && data.status === 'success') {
        setSubmitMessage('✅ Goal created successfully!');
        setGoal({
          name: '',
          category: '',
          targetAmount: '',
          startDate: '',
          recurring: false,
          image: null,
        });
        setTimeout(() => {
          navigate('/goals');
        }, 5000);
      } else {
        let errorMessage = 'Failed to create goal';
        if (data && data.message) {
          errorMessage = data.message;
        } else if (!response.ok) {
          errorMessage = `Server error (${response.status}): ${response.statusText}`;
        }
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          data,
        });
        setSubmitMessage(`❌ Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      setSubmitMessage('❌ Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="goalName" className="block text-sm font-medium text-gray-700">
            Goal Name *
          </label>
          <input
            type="text"
            name="name"
            value={goal.name}
            onChange={handleChange}
            className="w-full mt-1 rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="e.g. Buy a Car"
            required
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category/Goal Type
          </label>
          <select
            name="category"
            value={goal.category}
            onChange={handleChange}
            className="w-full mt-1 rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Select category</option>
            <option value="savings">Savings</option>
            <option value="investment">Investment</option>
            <option value="debt">Debt</option>
            <option value="spending limit">Spending Limit</option>
            <option value="donation">Donation</option>
          </select>
        </div>
        <div>
          <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700">
            Target Amount (R) *
          </label>
          <input
            type="number"
            name="targetAmount"
            value={goal.targetAmount}
            onChange={handleChange}
            className="w-full mt-1 rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="10000"
            min="1"
            required
          />
        </div>
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Target Date *
          </label>
          <input
            id="startDate"
            type="date"
            name="startDate"
            value={goal.startDate}
            onChange={handleChange}
            className="w-full mt-1 rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <label htmlFor="recurring" className="flex items-center gap-2 text-sm text-gray-700">
          <input
            id="recurring"
            type="checkbox"
            name="recurring"
            checked={goal.recurring}
            onChange={handleChange}
            className="accent-green-600"
          />
          <BsRepeat className="text-lg" />
          Make this goal recurring
        </label>

        <div className="flex items-center text-sm text-yellow-600 font-semibold">
          🏆 XP Reward: <span className="ml-2">{xpReward} XP</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Select a Goal Image</label>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {goalImages.map((img) => (
            <div
              key={img.id}
              onClick={() => handleImageSelect(img.src)}
              className={`rounded-xl border-2 cursor-pointer transition hover:scale-105 ${goal.image === img.src ? 'border-blue-500' : 'border-transparent'
                }`}
            >
              <img
                src={img.src}
                alt={img.name}
                className="w-24 h-20 object-cover rounded-xl"
                title={img.name}
              />
            </div>
          ))}
        </div>
      </div>

      {submitMessage && (
        <div
          className={`p-3 rounded-md text-sm ${submitMessage.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
        >
          {submitMessage}
        </div>
      )}

      <div className="text-right">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-5 py-2 rounded-full shadow transition ${isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700'
            } text-white`}
        >
          {isSubmitting ? 'Creating Goal...' : 'Create Goal'}
        </button>
      </div>
    </form>
  );
};

export default GoalsCreateForm;
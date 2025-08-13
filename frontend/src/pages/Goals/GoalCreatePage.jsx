import React, { useState, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import goal1 from '../../assets/Images/banners/pixelApartment.gif';
import goal2 from '../../assets/Images/banners/pixelHouse.gif';
import goal3 from '../../assets/Images/banners/pixelOffice1.gif';
import GoalsViewLayout from './GoalsViewLayout';

const GoalCreatePage = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    amount: '',
    startDate: '',
    endDate: '',
    type: '',
    category: '',
    image: goal1,
  });

  const user = JSON.parse(localStorage.getItem('user'));
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/transactions/categories');
        const data = await res.json();
        setCategories(data.data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e?.preventDefault();

    const bannerIdMap = {
      [goal1]: 1,
      [goal2]: 2,
      [goal3]: 3
    };

    const goalPayload = {
      user_id: user?.id,
      goal_name: form.name,
      target_amount: parseFloat(form.amount),
      goal_type: form.type, 
      start_date: form.startDate,
      target_date: form.endDate,
      banner_id: bannerIdMap[form.image],
      goal_status: 'in-progress',
      category_id: Number(form.category)
    };

    try {
      const res = await fetch('http://localhost:5000/api/goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goalPayload)
      });

      const data = await res.json();
      if (res.ok) {
        window.location.href = '/goals';
      } else {
        console.error(`Failed to create goal: ${data.message}`);
      }
    } catch (err) {
      console.error('Error submitting goal:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageSelect = (img) => {
    setForm((prev) => ({ ...prev, image: img }));
  };

  return (
    <GoalsViewLayout>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-2xl shadow dark:shadow-lg space-y-6 border border-gray-100 dark:border-gray-700">
        {/* Basic Information Section */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Create a Goal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Goal Name</label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Vacation Fund"
                value={form.name}
                onChange={handleChange}
                className="rounded-xl px-4 py-2 border dark:border-gray-600 shadow dark:shadow-none focus:outline-none w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Amount (R)</label>
              <input
                type="number"
                name="amount"
                placeholder="e.g. 15000"
                value={form.amount}
                onChange={handleChange}
                min="0"
                className="rounded-xl px-4 py-2 border dark:border-gray-600 shadow dark:shadow-none w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Timeframe Section */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Timeframe</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="rounded-xl px-4 py-2 border dark:border-gray-600 shadow dark:shadow-none w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="rounded-xl px-4 py-2 border dark:border-gray-600 shadow dark:shadow-none w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Goal Type</label>
              <div className="relative">
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="rounded-xl px-4 py-2 border dark:border-gray-600 shadow dark:shadow-none w-full appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select goal type</option>
                  <option value="savings">Savings</option>
                  <option value="debt">Debt</option>
                  <option value="investment">Investment</option>
                  <option value="spending limit">Spending limit</option>
                  <option value="donation">Donation</option>
                </select>
                <FaChevronDown className="absolute right-4 top-3 text-gray-400 dark:text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Category Section */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Goal Category</label>
              <div className="relative">
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="rounded-xl px-4 py-2 border dark:border-gray-600 shadow dark:shadow-none w-full appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.category_name}
                    </option>
                  ))} 
                </select>
                <FaChevronDown className="absolute right-4 top-3 text-gray-400 dark:text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div className="flex items-end">
              <span className="text-sm font-medium text-green-500 dark:text-green-400">
                XP Reward: 20 XP
              </span>
            </div>
          </div>
        </div>

        {/* Visual Representation Section */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Visual Representation</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Choose an image to represent your goal</p>
          <div className="flex gap-4">
            {[goal1, goal2, goal3].map((img, i) => (
              <div key={i} className="flex flex-col items-center">
                <img
                  src={img}
                  alt={`Goal option ${i}`}
                  onClick={() => handleImageSelect(img)}
                  className={`w-36 h-20 rounded-xl cursor-pointer object-cover border-2 ${
                    form.image === img 
                      ? 'border-green-400 dark:border-green-500' 
                      : 'border-transparent'
                  }`}
                />
                <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                  {i === 0 ? 'Apartment' : i === 1 ? 'House' : 'Office'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 text-right">
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="px-8 py-3 bg-gradient-to-r from-[#B4CB98] to-[#AAD977] dark:from-[#7FDD53] dark:to-[#86EFAC] text-white rounded-full shadow-lg hover:from-[#AAD977] hover:to-[#B4CB98] dark:hover:from-[#86EFAC] dark:hover:to-[#7FDD53] transition-all font-medium"
          >
            Create Goal
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg dark:shadow-xl w-[90%] max-w-md text-center space-y-4 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Confirm Goal Creation</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Are you sure you want to create this goal?</p>
            <div className="flex justify-center gap-4 pt-2">
              <button
                onClick={handleSubmit}
                className="px-5 py-2 bg-[#AAD977] dark:bg-[#7FDD53] text-white rounded-full hover:bg-[#B4CB98] dark:hover:bg-[#86EFAC]"
              >
                Yes, Create
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-5 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </GoalsViewLayout>
  );
};

export default GoalCreatePage;
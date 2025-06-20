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
      const res = await fetch('http://localhost:5000/api/transaction/categories');
      const data = await res.json();
      setCategories(data.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  fetchCategories();
}, []);
const handleSubmit = async (e) => {
  e.preventDefault();

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
    ...(form.customCategory
    ? { custom_category_id: form.customCategory }
    : { category_id: Number(form.category) })
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
      alert(`Failed to create goal: ${data.message}`);
    }
  } catch (err) {
    console.error('Error submitting goal:', err);
    alert('An error occurred while creating the goal.');
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


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted goal:', form);
    setShowConfirm(false); // close modal
  };

  return (
    <GoalsViewLayout>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow space-y-6">
        {/* Basic Information Section */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Vacation Fund"
                value={form.name}
                onChange={handleChange}
                className="rounded-xl px-4 py-2 border shadow focus:outline-none w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Amount (R)</label>
              <input
                type="number"
                name="amount"
                placeholder="e.g. 15000"
                value={form.amount}
                onChange={handleChange}
                className="rounded-xl px-4 py-2 border shadow w-full"
              />
            </div>
          </div>
        </div>

        {/* Timeframe Section */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">Timeframe</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="rounded-xl px-4 py-2 border shadow w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="rounded-xl px-4 py-2 border shadow w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Goal Type</label>
              <div className="relative">
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="rounded-xl px-4 py-2 border shadow w-full appearance-none"
                >
                  <option value="">Select goal type</option>
                  <option value="savings">Savings</option>
                  <option value="debt">Debt</option>
                  <option value="investment">Investment</option>
                  <option value="spending limit">Spending limit</option>
                  <option value="donation">Donation</option>
                </select>
                <FaChevronDown className="absolute right-4 top-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Category Section */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Goal Category</label>
              <div className="relative">
                <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="rounded-xl px-4 py-2 border shadow w-full appearance-none"
                 >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                  </option>
                ))} 

                </select>
                <FaChevronDown className="absolute right-4 top-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex items-end">
              <span className="text-sm font-medium text-green-500">
                XP Reward: 20 XP
              </span>
            </div>
          </div>
        </div>

        {/* Visual Representation Section */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">Visual Representation</h3>
          <p className="text-sm text-gray-600 mb-2">Choose an image to represent your goal</p>
          <div className="flex gap-4">
            {[goal1, goal2, goal3].map((img, i) => (
              <div key={i} className="flex flex-col items-center">
                <img
                  src={img}
                  alt={`Goal option ${i}`}
                  onClick={() => handleImageSelect(img)}
                  className={`w-36 h-20 rounded-xl cursor-pointer object-cover border-2 ${form.image === img ? 'border-green-400' : 'border-transparent'
                    }`}
                />
                <span className="text-xs mt-1 text-gray-500">
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
            className="px-8 py-3 bg-gradient-to-r from-[#B4CB98] to-[#AAD977] text-white rounded-full shadow-lg hover:from-[#AAD977] hover:to-[#B4CB98] transition-all font-medium"
          >
            Create Goal
          </button>

        </div>
      </form>
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-[90%] max-w-md text-center space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Confirm Goal Creation</h2>
            <p className="text-sm text-gray-600">Are you sure you want to create this goal?</p>
            <div className="flex justify-center gap-4 pt-2">
              <button
                onClick={handleSubmit}
                className="px-5 py-2 bg-[#AAD977] text-white rounded-full hover:bg-[#B4CB98]"
              >
                Yes, Create
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-5 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300"
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
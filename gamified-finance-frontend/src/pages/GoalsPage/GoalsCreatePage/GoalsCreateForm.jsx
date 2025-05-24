import React, { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { BsRepeat } from 'react-icons/bs';

const goalImages = [
  { id: 1, name: 'Pixel Path', src: require('../../../assets/Images/pixelPath.jpeg') },
  { id: 2, name: 'Pixel Shop', src: require('../../../assets/Images/pixelShop.gif') },
  { id: 3, name: 'Pixel Moonlight', src: require('../../../assets/Images/pixelMoonLight.jpeg') },
];

const GoalsCreateForm = () => {
  const [goal, setGoal] = useState({
    name: '',
    category: '',
    targetAmount: '',
    startDate: '',
    recurring: false,
    image: null,
  });

  const [xpReward, setXpReward] = useState(200);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Goal submitted (mock)');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Goal Name</label>
          <input
            type="text"
            name="name"
            value={goal.name}
            onChange={handleChange}
            className="w-full mt-1 rounded-md border border-gray-300 p-2 text-sm"
            placeholder="e.g. Buy a Car"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            name="category"
            value={goal.category}
            onChange={handleChange}
            className="w-full mt-1 rounded-md border border-gray-300 p-2 text-sm"
            placeholder="e.g. Vehicle"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Target Amount (R)</label>
          <input
            type="number"
            name="targetAmount"
            value={goal.targetAmount}
            onChange={handleChange}
            className="w-full mt-1 rounded-md border border-gray-300 p-2 text-sm"
            placeholder="10000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={goal.startDate}
            onChange={handleChange}
            className="w-full mt-1 rounded-md border border-gray-300 p-2 text-sm"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
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
              className={`rounded-xl border-2 cursor-pointer transition hover:scale-105 ${
                goal.image === img.src ? 'border-blue-500' : 'border-transparent'
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

      <div className="text-right">
        <button
          type="submit"
          className="bg-gradient-to-r from-green-400 to-green-600 text-white px-5 py-2 rounded-full shadow hover:from-green-500 hover:to-green-700 transition"
        >
          Create Goal
        </button>
      </div>
    </form>
  );
};

export default GoalsCreateForm;

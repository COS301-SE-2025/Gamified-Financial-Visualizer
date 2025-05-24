import React, { useState } from 'react';
import goal1 from '../../assets/Images/pixelNintendo.jpeg';
import goal2 from '../../assets/Images/pixelRiver.gif';
import goal3 from '../../assets/Images/pixelStreet.gif';
import goal4 from '../../assets/Images/pixelMoonLight.jpeg';

const goalImages = [
  { id: 1, src: goal1, name: 'Forest Town' },
  { id: 2, src: goal2, name: 'Magic Market' },
  { id: 3, src: goal3, name: 'Poké Track' },
  { id: 4, src: goal4, name: 'Blue Sector' },
];

const GoalsCreateForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    targetDate: '',
    category: '',
    recurring: false,
    frequency: '',
    image: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleImageSelect = (img) => {
    setFormData((prev) => ({ ...prev, image: img }));
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      amount: '',
      targetDate: '',
      category: '',
      recurring: false,
      frequency: '',
      image: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Creating goal:', formData);
    // TODO: Hook to backend API
  };

  const calculateXP = (amount) => {
    const val = parseInt(amount || '0', 10);
    return val > 0 ? Math.floor(val * 0.05) : 0; // 5% of value as XP
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold mb-4">Create New Goal</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Goal Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Goal Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Buy a car"
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="e.g., 10000"
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
          <p className="text-xs mt-1 text-green-600">
            🎮 XP Reward: <strong>{calculateXP(formData.amount)} XP</strong>
          </p>
        </div>

        {/* Target Date */}
        <div>
          <label className="block text-sm font-medium mb-1">Target Date</label>
          <input
            type="date"
            name="targetDate"
            value={formData.targetDate}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Select a category</option>
            <option value="travel">Travel</option>
            <option value="vehicle">Vehicle</option>
            <option value="education">Education</option>
            <option value="emergency">Emergency</option>
            <option value="investment">Investment</option>
          </select>
        </div>

        {/* Recurring Goal */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="recurring"
              checked={formData.recurring}
              onChange={handleChange}
              className="w-4 h-4"
            />
            Recurring Goal
          </label>
          {formData.recurring && (
            <select
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              className="border rounded-lg px-2 py-1 text-sm"
            >
              <option value="">Frequency</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          )}
        </div>

        {/* Image Selector */}
        <div>
          <label className="block text-sm font-medium mb-2">Select a Goal Image</label>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {goalImages.map((img) => (
              <div
                key={img.id}
                onClick={() => handleImageSelect(img.src)}
                className={`rounded-xl border-2 cursor-pointer transition hover:scale-105 ${
                  formData.image === img.src ? 'border-blue-500' : 'border-transparent'
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

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoalsCreateForm;

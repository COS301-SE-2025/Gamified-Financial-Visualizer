import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import goal1 from '../../assets/Images/banners/pixelApartment.gif';
import goal2 from '../../assets/Images/banners/pixelHouse.gif';
import goal3 from '../../assets/Images/banners/pixelOffice1.gif';
import GoalsViewLayout from './GoalsViewLayout';

const GoalCreatePage = () => {
  const [form, setForm] = useState({
    name: '',
    amount: '',
    startDate: '',
    endDate: '',
    type: '',
    category: '',
    recurring: false,
    image: goal1,
  });

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : value,
    }));
  };

  const handleImageSelect = (img) => {
    setForm((prev) => ({ ...prev, image: img }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted goal:', form);
  };

  return (
    <GoalsViewLayout>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow space-y-6">
        {/* Inputs */}
        <div className="grid grid-cols-3 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Goal Name"
            value={form.name}
            onChange={handleChange}
            className="rounded-xl px-4 py-2 border shadow focus:outline-none"
          />
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className="rounded-xl px-4 py-2 border shadow"
          />
          <div className="relative">
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="rounded-xl px-4 py-2 border shadow w-full appearance-none"
            >
              <option>Select</option>
              <option>Short-Term</option>
              <option>Long-Term</option>
            </select>
            <FaChevronDown className="absolute right-4 top-3 text-gray-400 pointer-events-none" />
          </div>
          <input
            type="number"
            name="amount"
            placeholder="Target Amount (R)"
            value={form.amount}
            onChange={handleChange}
            className="rounded-xl px-4 py-2 border shadow"
          />
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            className="rounded-xl px-4 py-2 border shadow"
          />
          <div className="relative">
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="rounded-xl px-4 py-2 border shadow w-full appearance-none"
            >
              <option>Select</option>
              <option>Savings</option>
              <option>Health</option>
              <option>Travel</option>
            </select>
            <FaChevronDown className="absolute right-4 top-3 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Recurring + XP */}
        <div className="flex justify-between items-center px-1">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              name="recurring"
              checked={form.recurring}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600"
            />
            Make this goal recurring
          </label>
          <span className="text-sm text-red-400 font-medium">XP Reward: 200 XP</span>
        </div>

        {/* Image Picker */}
        <div className="flex gap-4">
          {[goal1, goal2, goal3].map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Goal option ${i}`}
              onClick={() => handleImageSelect(img)}
              className={`w-36 h-20 rounded-xl cursor-pointer object-cover border-2 ${
                form.image === img ? 'border-green-400' : 'border-transparent'
              }`}
            />
          ))}
        </div>

        {/* Submit Button */}
        <div className="text-right">
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-green-400 to-lime-500 text-white rounded-full shadow hover:from-green-500"
          >
            Create Goal
          </button>
        </div>
      </form>
    </GoalsViewLayout>
  );
};

export default GoalCreatePage ;

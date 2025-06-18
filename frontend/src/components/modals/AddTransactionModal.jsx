import React, { useState } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';

const AddTransactionModal = ({ isOpen, onClose, onAdd }) => {
  const [form, setForm] = useState({
    type: '',
    name: '',
    date: '',
    categories: '',
    newCategories: '',
    amount: '',
    goals: '',
    challenges: '',
    recurring: '',
    budget: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // Validation: allow only one category method
    if (form.categories && form.newCategories) {
      alert("Please select a category OR type a new one — not both.");
      return;
    }

    const finalCategory = form.categories || form.newCategories || 'Uncategorized';

    const newTransaction = {
      name: form.name,
      type: form.type,
      date: form.date,
      category: finalCategory, // ✅ unified field name
      amount: `R${form.amount}`,
      recurring: form.recurring,
      goals: form.goals,
      challenges: form.challenges,
      budget: form.budget,
    };

    onAdd(newTransaction);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[500px] relative">
        <h3 className="text-lg font-bold mb-4 text-center">Add New Transaction</h3>

        <div className="grid grid-cols-2 gap-4 text-sm">
          {/* Transaction Type */}
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1">Transaction type</label>
            <select name="type" value={form.type} onChange={handleChange} className="border p-2 rounded">
              <option value="">Select type</option>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          {/* Recurring */}
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1">Recurring</label>
            <select name="recurring" value={form.recurring} onChange={handleChange} className="border p-2 rounded">
              <option value="">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Biweekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

        {/* Transaction Name */}
            <div className="flex flex-col">
              <label className="text-gray-600 mb-1">Transaction name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>

            {/* Amount */}
            <div className="flex flex-col">
              <label className="text-gray-600 mb-1">Amount</label>
              <input
                name="amount"
                type="number"
                min="0"
                value={form.amount}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>

            {/* Date */}
            <div className="flex flex-col">
              <label className="text-gray-600 mb-1">Date</label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>

            {/* Budget */}
            <div className="flex flex-col">
              <label className="text-gray-600 mb-1">Budget</label>
              <select
                name="budget"
                value={form.budget}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value="">Select budget</option>
                <option value="budget1">Budget 1</option>
                <option value="budget2">Budget 2</option>
              </select>
            </div>

          {/* Categories (dropdown) */}
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1">Categories</label>
            <select name="categories" value={form.categories} onChange={handleChange} className="border p-2 rounded">
              <option value="">Select category</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Fuel">Fuel</option>
              <option value="Health">Health</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Personal">Personal</option>
            </select>
          </div>

          {/* New Category (alternative input) */}
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1">New Category</label>
            <input name="newCategories" value={form.newCategories} onChange={handleChange} className="border p-2 rounded" />
          </div>

          {/* Goals Dropdown */}
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1">Goals</label>
            <select name="goals" value={form.goals} onChange={handleChange} className="border p-2 rounded">
              <option value="">Select goal</option>
              <option value="goal1">Goal 1</option>
              <option value="goal2">Goal 2</option>
            </select>
          </div>

          {/* Challenges Dropdown */}
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1">Challenges</label>
            <select name="challenges" value={form.challenges} onChange={handleChange} className="border p-2 rounded">
              <option value="">Select challenge</option>
              <option value="challenge1">Challenge 1</option>
              <option value="challenge2">Challenge 2</option>
            </select>
          </div>
         
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-6 gap-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 bg-red-200 text-red-600 px-4 py-2 rounded-full"
          >
            <FaTimes /> Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-green-200 text-green-700 px-4 py-2 rounded-full"
          >
            <FaSave /> Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionModal;

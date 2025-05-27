import React, { useState } from 'react';

// 🔁 Simple inline map for category name to ID
const mapCategoryToId = (name) => {
  const mapping = {
    Groceries: 1,
    Transport: 2,
    Health: 3, 
    Education: 4,
    Entertainment: 5,
    Utilities: 6,
    // Add more as needed
  };
  return mapping[name] || null;
};

const SetBudgetModal = ({ onClose, onBudgetSet, userId }) => {
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      user_id: userId,
      period_start: "2024-05-01", // or dynamically generate
      period_end: "2024-05-31",
      category_id: mapCategoryToId(category), // you must implement this mapping
      custom_category_id: null,
      target_amount: Number(limit)
    };

    try {
      const res = await fetch('/api/budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.status === 'success') {
        onBudgetSet(); // callback to refresh parent data
        onClose();
      } else {
        alert('Failed to save budget.');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred while setting budget.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white w-[400px] rounded-xl shadow-lg border-t-4 border-green-500 relative p-6">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-red-500 text-lg font-bold"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold text-green-600 mb-4">Set New Budget</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium">Category</label>
            <select
              className="w-full mt-1 border px-3 py-2 rounded"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              <option>Groceries</option>
              <option>Transport</option>
              <option>Health</option>
              <option>Education</option>
              {/* Add all used categories */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Limit Amount</label>
            <input
              type="number"
              className="w-full mt-1 border px-3 py-2 rounded"
              placeholder="e.g. 9000"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-all"
          >
            Save Budget
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetBudgetModal;

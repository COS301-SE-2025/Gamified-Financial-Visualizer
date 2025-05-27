import React, { useEffect, useState } from 'react';

const SetBudgetModal = ({ onClose, onBudgetSet, userId }) => {
  const [categoryId, setCategoryId] = useState('');
  const [limit, setLimit] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/transactions/categories');
        const data = await res.json();
        if (data.status === 'success') {
          setCategories(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedCategory = categories.find(cat => cat.category_id === Number(categoryId));
    const budget_name = selectedCategory?.category_name;

    const target_amount = Number(limit);
    if (!categoryId || isNaN(target_amount) || target_amount <= 0) {
      alert('Please select a valid category and enter a valid amount.');
      return;
    }


    console.log()
    const payload = {
      user_id: userId,
      budget_name,/////
      period_start: "2024-05-01",
      period_end: "2024-05-31",
      allocations: [
        {
          category_id: Number(categoryId),
          target_amount
        }
      ]
    };

    console.log("🟢 Payload:", payload);
    console.log("🔎 Selected ID:", categoryId);
    console.log("📦 Categories:", categories);
    console.log("🎯 Selected category:", selectedCategory);


    try {
      const res = await fetch('http://localhost:5001/api/budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.status === 'success') {
        onBudgetSet();
        onClose();
      } else {
        alert('Failed to save budget.');
      }
    } catch (err) {
      console.error('Budget POST failed:', err.message);
      alert('Error occurred while setting budget.');
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white w-[400px] rounded-2xl shadow-2xl border-t-4 border-lime-500 relative p-10">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-red-500 text-lg font-bold"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold text-lime-600 mb-4">Set New Budget</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium">Category</label>
            <select
              className="w-full mt-1 border px-3 py-2 rounded"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.category_name}
                </option>
              ))}
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
            className="w-full bg-lime-500 hover:bg-lime-600 text-white py-2 rounded-lg transition-all"
          >
            Save Budget
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetBudgetModal;

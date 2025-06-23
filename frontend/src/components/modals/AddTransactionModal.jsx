import React, { useState, useEffect } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';

const AddTransactionModal = ({ isOpen, onClose, onAdd, activeAccount }) => {
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
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch categories from API
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/transactions/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Fallback to hardcoded categories if API fails
      setCategories([
        { category_id: 1, category_name: 'Food' },
        { category_id: 2, category_name: 'Transport' },
        { category_id: 3, category_name: 'Fuel' },
        { category_id: 4, category_name: 'Health' },
        { category_id: 5, category_name: 'Entertainment' },
        { category_id: 6, category_name: 'Personal' }
      ]);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // Validation: allow only one category method
      if (form.categories && form.newCategories) {
        setError("Please select a category OR type a new one — not both.");
        setLoading(false);
        return;
      }

      // Validate required fields
      if (!form.name || !form.amount || !form.type) {
        setError("Please fill in all required fields (name, amount, type).");
        setLoading(false);
        return;
      }

      if (!activeAccount?.account_id) {
        setError("No active account selected.");
        setLoading(false);
        return;
      }

      // Prepare transaction data for API
      const transactionData = {
        account_id: activeAccount.account_id,
        transaction_name: form.name,
        transaction_amount: parseFloat(form.amount),
        transaction_type: form.type,
        transaction_date: form.date || new Date().toISOString().split('T')[0],
        category_id: form.categories ? parseInt(form.categories) : null,
        custom_category_id: null, // You'll need to handle custom categories separately
        budget_id: form.budget ? parseInt(form.budget) : null,
        is_recurring: form.recurring ? true : false,
        linked_goal_id: form.goals ? parseInt(form.goals) : null,
        linked_challenge_id: form.challenges ? parseInt(form.challenges) : null,
        points_awarded: 0 // Default value
      };

      // If user entered a new category, we need to handle it
      if (form.newCategories && !form.categories) {
        // For now, we'll pass it as transaction_name with a note
        // You might want to create a custom category endpoint
        transactionData.transaction_name = `${form.name} (${form.newCategories})`;
      }

      // Make API call
      const response = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create transaction');
      }

      const result = await response.json();

      // Create the transaction object in the format your UI expects
      const newTransaction = {
        name: form.name,
        type: form.type,
        date: form.date || new Date().toISOString().split('T')[0],
        category: form.categories ? 
          categories.find(cat => cat.category_id === parseInt(form.categories))?.category_name || 'Unknown' :
          form.newCategories || 'Uncategorized',
        amount: `${activeAccount.currency || 'ZAR'}${form.amount}`,
        recurring: form.recurring,
        goals: form.goals,
        challenges: form.challenges,
        budget: form.budget,
        account_id: activeAccount.account_id,
        transaction_id: result.data.transaction_id,
      };

      // Call the parent's onAdd function
      onAdd(newTransaction);
      
      // Reset form and close modal
      setForm({
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
      onClose();

    } catch (err) {
      console.error('Error creating transaction:', err);
      setError(err.message || 'Failed to create transaction');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-[500px] relative">
        <h3 className="text-lg font-bold mb-4 text-center">Add New Transaction</h3>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3 mb-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          {/* Transaction Type */}
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1">Transaction type </label>
            <select name="type" value={form.type} onChange={handleChange} className="border p-2 rounded">
              <option value="">Select type</option>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
              <option value="transfer">Transfer</option>
              <option value="fee">Fee</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="deposit">Deposit</option>
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
            <label className="text-gray-600 mb-1">Transaction name </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border p-2 rounded"
              placeholder="Enter transaction name"
            />
          </div>

          {/* Amount */}
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1">Amount </label>
            <input
              name="amount"
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={handleChange}
              className="border p-2 rounded"
              placeholder="0.00"
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
              <option value="1">Budget 1</option>
              <option value="2">Budget 2</option>
            </select>
          </div>

          {/* Categories (dropdown) */}
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1">Categories</label>
            <select name="categories" value={form.categories} onChange={handleChange} className="border p-2 rounded">
              <option value="">Select category</option>
              {categories.map(category => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>

          {/* New Category (alternative input) */}
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1">New Category</label>
            <input 
              name="newCategories" 
              value={form.newCategories} 
              onChange={handleChange} 
              className="border p-2 rounded" 
              placeholder="Enter new category"
            />
          </div>

          {/* Goals Dropdown */}
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1">Goals</label>
            <select name="goals" value={form.goals} onChange={handleChange} className="border p-2 rounded">
              <option value="">Select goal</option>
              <option value="1">Goal 1</option>
              <option value="2">Goal 2</option>
            </select>
          </div>

          {/* Challenges Dropdown */}
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1">Challenges</label>
            <select name="challenges" value={form.challenges} onChange={handleChange} className="border p-2 rounded">
              <option value="">Select challenge</option>
              <option value="1">Challenge 1</option>
              <option value="2">Challenge 2</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center mt-6 gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex items-center gap-2 bg-red-200 text-red-600 px-4 py-2 rounded-full disabled:opacity-50"
          >
            <FaTimes /> Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 bg-green-200 text-green-700 px-4 py-2 rounded-full disabled:opacity-50"
          >
            <FaSave /> {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionModal;
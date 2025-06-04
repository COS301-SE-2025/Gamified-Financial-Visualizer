import React, { useState, useEffect } from 'react';

const AddTransactionModal = ({ onClose, onTransactionAdded, userId }) => {
  const [type, setType] = useState('expense');
  const [name, setName] = useState('');
  const [accountId, setAccountId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/transaction/categories');
      const data = await res.json();
      if (data.status === 'success') {
        console.log("Categories fetched:", data.data); 
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

    const payload = {
      account_id: Number(accountId),
      category_id: Number(categoryId),
      custom_category_id: null,
      transaction_amount: Number(amount),
      transaction_type: type,
      transaction_date: date,
      description: name,
      note,
      is_recurring: false
    };

    try {
      const res = await fetch('http://localhost:5000/api/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.status === 'success') {
        onTransactionAdded();
        onClose();
      } else {
        setError(data.message || 'Failed to add transaction.');
      }
    } catch (err) {
      console.error('Transaction creation error:', err);
      setError('Server error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-96 p-6 rounded-lg shadow-lg relative border-t-4 border-green-500">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-red-500 text-lg font-bold"
        >
          ×
        </button>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex justify-around mb-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="type"
                value="expense"
                checked={type === 'expense'}
                onChange={() => setType('expense')}
                className="accent-green-500"
              /> Expense
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="type"
                value="income"
                checked={type === 'income'}
                onChange={() => setType('income')}
                className="accent-green-500"
              /> Income
            </label>
          </div>

          <div>
            <label className="text-sm font-semibold block mb-1">Transaction Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder="e.g. Groceries"
              required
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-sm font-semibold block mb-1">Account</label>
              <input
                type="number"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                placeholder="Account ID"
                required
              />
            </div>

            <div className="flex-1">
              <label className="text-sm font-semibold block mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-sm font-semibold block mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="">Select</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-semibold block mb-1">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                placeholder="R0.00"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold block mb-1">Note</label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              placeholder="Optional note"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full"
          >
            Add Transaction
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;

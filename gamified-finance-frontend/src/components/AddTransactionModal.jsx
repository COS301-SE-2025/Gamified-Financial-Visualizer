import React from 'react';

const AddTransactionModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-96 p-6 rounded-lg shadow-lg relative border-t-4 border-green-500">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-red-500 text-lg font-bold"
        >
          ×
        </button>

        <div className="flex justify-around mb-4">
          <label className="flex items-center gap-2">
            <input type="radio" name="type" defaultChecked className="accent-green-500" /> Expense
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="type" className="accent-green-500" /> Income
          </label>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-semibold block mb-1">Transaction Name</label>
            <input className="w-full border px-3 py-2 rounded" placeholder="e.g. Groceries" />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-sm font-semibold block mb-1">Account</label>
              <select className="w-full border px-3 py-2 rounded">
                <option value="">Select</option>
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-semibold block mb-1">Date</label>
              <input type="date" className="w-full border px-3 py-2 rounded" />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-sm font-semibold block mb-1">Categories</label>
              <select className="w-full border px-3 py-2 rounded">
                <option value="">Select</option>
                <option value="food">Food</option>
                <option value="travel">Travel</option>
                <option value="bills">Bills</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-semibold block mb-1">Amount</label>
              <input className="w-full border px-3 py-2 rounded" placeholder="R0.00" />
            </div>

            
            <div className="flex-1">
              <label className="text-sm font-semibold block mb-1">Status</label>
              <select className="w-full border px-3 py-2 rounded">
                <option value="">Select</option>
                <option value="checking">Pending</option>
                <option value="savings">Failed</option>
                <option value="savings">Completed</option>
              </select>
            </div>

            
          </div>
        </div>

        <button className="mt-6 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full">
          Add Transaction
        </button>
      </div>
    </div>
  );
};

export default AddTransactionModal;

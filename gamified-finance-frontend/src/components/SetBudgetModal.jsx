import React from 'react';

const SetBudgetModal = ({ onClose }) => {
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

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Category</label>
            <select className="w-full mt-1 border px-3 py-2 rounded">
              <option value="">Select Category</option>
              <option>Groceries</option>
              <option>Transport</option>
              <option>Health</option>
              <option>Education</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Limit Amount</label>
            <input
              type="number"
              className="w-full mt-1 border px-3 py-2 rounded"
              placeholder="e.g. 9000"
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

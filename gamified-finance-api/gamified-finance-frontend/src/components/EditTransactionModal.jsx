import React, { useState } from 'react';

const EditTransactionModal = ({ transaction, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...transaction });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-96 p-6 rounded-lg shadow-lg relative border-t-4 border-yellow-400">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-red-500 text-lg font-bold"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold text-yellow-600 mb-4">Edit Transaction</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Transaction Name"
          />

          <input
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Category"
          />

          <input
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Amount"
          />

          <input
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            type="date"
            className="w-full border px-3 py-2 rounded"
          />

          <select
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTransactionModal;

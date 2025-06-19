import React, { useState, useEffect } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';

const EditTransactionModal = ({ isOpen, transaction, onClose, onSave }) => {
  const [formData, setFormData] = useState(transaction || {});

  useEffect(() => {
    if (transaction) setFormData(transaction);
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-30">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Edit Transaction</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                placeholder="Transaction Name"
                required
            />
            </div>
          
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
             <input
            type="date"
            name="date"
            value={formData.date || ''}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />
          </div>
          
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
             <input
            type="text"
            name="category"
            value={formData.category || ''}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            placeholder="Category"
          />
          </div>
          
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input
            type="text"
            name="amount"
            value={formData.amount || ''}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            placeholder="Amount (e.g. R500)"
          />
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
        </form>
      </div>
    </div>
  );
};

export default EditTransactionModal;

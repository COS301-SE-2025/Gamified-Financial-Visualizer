import React, { useState, useEffect } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';

const EditTransactionModal = ({ isOpen, transaction, onClose, onSave }) => {
  const [formData, setFormData] = useState(transaction || {});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (transaction) {
      setFormData({
        ...transaction,
        // Parse amount to remove currency symbol for editing
        amount: transaction.amount ? transaction.amount.replace(/[^\d.-]/g, '') : ''
      });
    }
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.name || !formData.amount) {
        setError("Please fill in all required fields.");
        setLoading(false);
        return;
      }

      if (!transaction.transaction_id) {
        setError("Cannot update transaction: missing transaction ID.");
        setLoading(false);
        return;
      }

      // Prepare update data - you'll need to implement PUT endpoint in your backend
      const updateData = {
        transaction_name: formData.name,
        transaction_amount: parseFloat(formData.amount),
        transaction_date: formData.date,
        // Add other fields as needed based on your backend update endpoint
      };

      // Make API call to update transaction
      const response = await fetch(`http://localhost:5000/api/transactions/${transaction.transaction_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update transaction');
      }

      // Update the transaction in the UI format
      const updatedTransaction = {
        ...transaction,
        name: formData.name,
        date: formData.date,
        category: formData.category,
        amount: formData.amount.includes(transaction.amount?.charAt(0)) ? 
          formData.amount : 
          `${transaction.amount?.charAt(0) || ''}${formData.amount}`,
      };

      onSave(updatedTransaction);
      onClose();

    } catch (err) {
      console.error('Error updating transaction:', err);
      setError(err.message || 'Failed to update transaction');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-30">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Edit Transaction</h3>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3 mb-4 text-red-700 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
            <input
              type="number"
              name="amount"
              step="0.01"
              min="0"
              value={formData.amount || ''}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              placeholder="0.00"
              required
            />
          </div>   

          {/* Buttons */}
          <div className="flex justify-end mt-6 gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex items-center gap-2 bg-red-200 text-red-600 px-4 py-2 rounded-full disabled:opacity-50"
            >
              <FaTimes /> Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-green-200 text-green-700 px-4 py-2 rounded-full disabled:opacity-50"
            >
              <FaSave /> {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTransactionModal;
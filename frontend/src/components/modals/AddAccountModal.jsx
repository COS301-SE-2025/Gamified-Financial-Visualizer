import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const AddAccountModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    bankName: '',
    accountName: '',
    accountType: '',
    balance: '',
    available: '',
    currency: 'ZAR',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    const letterOnlyFields = ['bankName', 'accountName', 'accountType'];
    if (letterOnlyFields.includes(name)) {
      const lettersOnly = /^[A-Za-z\s]*$/;
      if (!lettersOnly.test(value)) return;
    }

    const numberOnlyFields = ['balance', 'available'];
    if (numberOnlyFields.includes(name)) {
      const numbersOnly = /^\d*\.?\d*$/;
      if (!numbersOnly.test(value)) return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onAdd(formData);
    onClose();
    setFormData({
      bankName: '',
      accountName: '',
      accountType: '',
      balance: '',
      currency: 'ZAR',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl relative">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <FaTimes size={18} />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Account</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Bank Name', name: 'bankName', placeholder: 'FNB' },
            { label: 'Account Name', name: 'accountName', placeholder: 'Private Account' },
            { label: 'Account Type', name: 'accountType', placeholder: 'Savings' },
            { label: 'Available Amount', name: 'available', placeholder: '10000' },
            //{ label: 'Balance', name: 'balance', placeholder: '500' },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
              <input
                type="text"
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
          ))}

          {/* Currency Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md text-sm"
            >
              <option value="ZAR">ZAR (R)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleSubmit}
            className="flex items-center gap-3 px-6 py-2 bg-[#D8F5C5] text-[#467D35] text-sm font-semibold rounded-full hover:bg-[#c8ecb4] transition shadow-md"
          >
            Add Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAccountModal;

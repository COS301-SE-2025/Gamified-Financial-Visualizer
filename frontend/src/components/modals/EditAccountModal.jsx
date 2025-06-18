import React, { useState, useEffect } from 'react';

const EditAccountModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [accountName, setAccountName] = useState('');

  useEffect(() => {
    if (initialData) {
      setAccountName(initialData.accountName || '');
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!initialData) return; // safeguard

    const updatedData = {
      ...initialData,
      accountName: accountName
    };
    onSave(updatedData);
    onClose();
  };

  if (!isOpen || !initialData) return null; // safe guard render

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl space-y-6 relative overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-gray-800">Edit Account</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Account Name</label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring focus:ring-green-200"
              placeholder="e.g. Private Account"
            />
          </div>
  
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-[#D8F5C5] text-[#467D35] rounded-full font-semibold hover:bg-[#c8ecb4] shadow-md transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAccountModal;

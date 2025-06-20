import React from 'react';
import { FaTrashAlt, FaTimes } from 'react-icons/fa';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-3xl shadow-lg p-6 w-full max-w-sm text-center space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-800">Confirm Deletion</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-red-400">
            <FaTimes />
          </button>
        </div>

        <p className="text-sm text-gray-600">
          Are you sure you want to delete <span className="font-semibold text-red-500">{itemName}</span>?
        </p>

        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-[#FE9B90] hover:bg-[#ED5E52] text-white rounded-full flex items-center gap-2"
          >
            <FaTrashAlt /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;

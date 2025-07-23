import React from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';

const AccountCard = ({
  bank,
  accountName,
  type,
  // available,
  balance,
  currency,
  bg = 'bg-pink-300',
  overlay = 'bg-pink-400',
  onClick = () => {},
  onEdit = () => {},
  onDelete = () => {},
}) => {
  const currencySymbols = {
    ZAR: 'R',
    USD: '$',
    EUR: '€',
    GBP: '£',
  };

  const symbol = currencySymbols[currency] || '';

  return (
    <div
      className="w-[350px] bg-white flex flex-col p-5 rounded-2xl shadow-md border border-gray-200 cursor-pointer transition hover:shadow-lg"
      onClick={onClick}
    >
      {/* Top Row */}
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-sm font-semibold text-gray-900">{bank}</h4>
          <p className="text-xs text-gray-500">{accountName}</p>

          <p className="text-xl font-bold text-gray-800 mt-2">
            {symbol}
            {typeof balance === 'number' ? balance.toFixed(2) : parseFloat(balance || 0).toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">Balance</p>

          {/* <p className="text-sm text-gray-700 mt-1">
            {symbol}
            {balance}
          </p>
          <p className="text-xs text-gray-400">Balance</p> */}
        </div>

        <div className="flex flex-col items-end ml-4">
          <p className="text-xs text-gray-700">{type}</p>

          {/* Card Visual */}
          <div
            className={`mt-3 w-[130px] h-[80px] ${bg} rounded-xl relative overflow-hidden`}
          >
            <div className="absolute top-2 left-3 text-xs font-bold text-white">
              VISA
            </div>
            <div className="absolute bottom-2 right-3 text-sm font-semibold text-white tracking-widest">
              •••• 5678
            </div>
            <div
              className={`absolute top-0 right-0 w-1/2 h-full ${overlay} opacity-60 rounded-r-xl`}
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="flex items-center gap-1 px-4 py-[6px] text-sm text-red-500 bg-red-50 border border-red-300 rounded-full hover:bg-red-100 transition"
        >
          <FaTrash className="text-sm" /> Delete
        </button>
       <button
          onClick={onEdit}
          className="flex items-center gap-1 px-4 py-[6px] text-sm text-blue-500 bg-blue-50 border border-blue-300 rounded-full hover:bg-blue-100 transition"
        >
          <FaEdit className="text-sm" /> Edit
        </button>
      </div>
    </div>
  );
};

export default AccountCard;

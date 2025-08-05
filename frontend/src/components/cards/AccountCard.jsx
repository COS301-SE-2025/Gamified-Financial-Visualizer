import React from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';



const AccountCard = ({
  bank,
  accountName,
  type,
  available,
  balance,
  currency,
  bg = 'bg-blue-300',
  overlay = 'bg-blue-500',
  isActive = false, // Add this prop
  onClick = () => {},
  onEdit = () => {},
  onDelete = () => {},
}) => {
  const currencySymbols = { // fetch currency symbols dynamically if needed
    ZAR: 'R',
    USD: '$',
    EUR: '€',
    GBP: '£',
    BTC: '₿',
    ETH: 'Ξ',
    USDT: '₮',
    LTC: 'Ł',
    XRP: '✕',
    SOL: '◎',
    ADA: '₳',
    DOGE: 'Ð',
    USDC: '∩',
  };

  const symbol = currencySymbols[currency] || '';

  return (
    <div
      onClick={onClick}
      className={`w-full bg-white dark:bg-gray-800 flex flex-col rounded-2xl shadow-md border-2 dark:border-gray-700 p-5 transition-all cursor-pointer ${
        isActive 
          ? 'border-[#7FBCE9] ring-2 ring-white bg-[#eef6f7]' 
          : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
      }`}
    >
      {/* Top row */}
      <div className="flex justify-between items-start w-full">
        {/* Left info block */}
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-semibold text-gray-900 dark:text-white">{bank}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">{accountName}</p>

          <div className="mt-2">
            <p className="text-xl font-bold text-gray-800 dark:text-white">
              {symbol}{parseFloat(available).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Available</p>
            <p className="text-md text-gray-700 dark:text-gray-300 mt-1">
              {symbol}{parseFloat(balance).toFixed(2)}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Balance</p>
          </div>
        </div>

        {/* Right type and card */}
        <div className="flex flex-col items-end ml-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-black dark:text-white">{type}</p>
            <p className={`text-sm ${
              isActive ? 'text-[#76B947] font-bold' : 'text-gray-500 dark:text-green-400'
            }`}>
              {isActive ? 'Active (Viewing)' : 'Active'}
            </p>
          </div>

          <div className={`mt-3 w-[160px] h-[90px] ${bg} rounded-xl relative overflow-hidden shadow`}>
            <div className="absolute top-2 left-3 text-xs font-bold text-white">VISA</div>
            <div className="absolute bottom-2 right-3 text-sm font-semibold text-white tracking-widest">•••• 5678</div>
            <div className={`absolute top-0 right-0 w-1/2 h-full ${overlay} opacity-50 rounded-r-xl`} />
          </div>
        </div>
      </div>

      {/* Action buttons - Colors remain unchanged as requested */}
      <div className="flex justify-start gap-2 mt-5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="flex items-center gap-2 px-4 py-1.5 bg-red-100 text-red-600 text-sm font-medium rounded-full hover:bg-red-200 dark:bg-[#FF7768] dark:text-white"
        >
          <FaTrash className="text-sm" /> Delete
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="flex items-center gap-2 px-4 py-1.5 bg-blue-100 text-blue-600 text-sm font-medium rounded-full hover:bg-blue-200 dark:bg-[#88D1FF] dark:text-white"
        >
          <FaEdit className="text-sm" /> Edit
        </button>
      </div>
    </div>
  );
};

export default AccountCard;
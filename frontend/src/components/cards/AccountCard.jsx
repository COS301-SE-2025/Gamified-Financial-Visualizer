import React, { useMemo, useState, useEffect } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';

const COLOR_COMBOS = [
  { bg: 'bg-blue-300', overlay: 'bg-blue-500' },
  { bg: 'bg-green-300', overlay: 'bg-green-500' },
  { bg: 'bg-purple-300', overlay: 'bg-purple-500' },
  { bg: 'bg-pink-300', overlay: 'bg-pink-500' },
  { bg: 'bg-yellow-300', overlay: 'bg-yellow-500' },
  { bg: 'bg-red-300', overlay: 'bg-red-500' },
  { bg: 'bg-indigo-300', overlay: 'bg-indigo-500' },
  { bg: 'bg-teal-300', overlay: 'bg-teal-500' },
];

// Simple deterministic string hash (djb2-ish)
function hashString(str = '') {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  // Force positive 32-bit
  return (hash >>> 0);
}

const AccountCard = ({
  accountId,          // <-- NEW (recommended to pass)
  bank,
  accountName,
  type,
  available,
  balance,
  currency,
  bg,                 
  overlay,             
  isActive = false,
  onDelete = () => {},
  onClick = () => {},
  onEdit = () => {},
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  // Close on ESC
  useEffect(() => {
    if (!confirmOpen) return;
    const onKey = (e) => e.key === 'Escape' && setConfirmOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [confirmOpen]);

  const currencySymbols = {
    ZAR: 'R', USD: '$', EUR: '€', GBP: '£',
    BTC: '₿', ETH: 'Ξ', USDT: '₮', LTC: 'Ł',
    XRP: '✕', SOL: '◎', ADA: '₳', DOGE: 'Ð',
    USDC: '∩',
  };
  const symbol = currencySymbols[currency] || '';

  
  const { chosenBg, chosenOverlay, storageKey } = useMemo(() => {
    
    if (bg && overlay) {
      return { chosenBg: bg, chosenOverlay: overlay, storageKey: null };
    }

    const keyBase = accountId != null ? String(accountId) : `${accountName || ''}::${bank || ''}`;
    const key = `account-color:${keyBase}`;

    
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.bg && parsed?.overlay) {
          return { chosenBg: parsed.bg, chosenOverlay: parsed.overlay, storageKey: key };
        }
      }
    } catch {
      
    }

    // 3) Deterministic pick via hashing and persist
    const idx = hashString(keyBase) % COLOR_COMBOS.length;
    const combo = COLOR_COMBOS[idx];

    try {
      localStorage.setItem(key, JSON.stringify(combo));
    } catch {
     
    }

    return { chosenBg: combo.bg, chosenOverlay: combo.overlay, storageKey: key };
  }, [accountId, accountName, bank, bg, overlay]);

  const openConfirm = (e) => {
    e.stopPropagation();
    setConfirmOpen(true);
  };

  const closeConfirm = (e) => {
    e?.stopPropagation?.();
    setConfirmOpen(false);
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    setIsDeleting(true);
    try {
      await onDelete();
      
      if (storageKey) {
        try { localStorage.removeItem(storageKey); } catch {}
      }
      setIsDeleted(true);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsDeleting(false);
      setConfirmOpen(false);
    }
  };

  if (isDeleted) return null;

  return (
    <>
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
                {symbol}{Number(available ?? 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Available</p>
              <p className="text-md text-gray-700 dark:text-gray-300 mt-1">
                {symbol}{Number(balance ?? 0).toFixed(2)}
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Balance</p>
            </div>
          </div>

          {/* Right type and card */}
          <div className="flex flex-col items-end ml-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-black dark:text-white">{type}</p>
              <p className={`text-sm ${isActive ? 'text-[#76B947] font-bold' : 'text-gray-500 dark:text-[#A1E358]'}`}>
                {isActive ? 'Active (Viewing)' : 'Active'}
              </p>
            </div>

            <div className={`mt-3 w-[160px] h-[90px] ${chosenBg} rounded-xl relative overflow-hidden shadow`}>
              <div className="absolute top-2 left-3 text-xs font-bold text-white">VISA</div>
              <div className="absolute bottom-2 right-3 text-sm font-semibold text-white tracking-widest">•••• 5678</div>
              <div className={`absolute top-0 right-0 w-1/2 h-full ${chosenOverlay} opacity-50 rounded-r-xl`} />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-start gap-2 mt-5">
          <button
            onClick={openConfirm}
            disabled={isDeleting}
            className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-full ${
              isDeleting 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                : 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-[#FF7768] dark:text-white'
            }`}
          >
            <FaTrash className="text-sm" /> 
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            disabled={isDeleting}
            className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-full ${
              isDeleting 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-[#88D1FF] dark:text-white'
            }`}
          >
            <FaEdit className="text-sm" /> Edit
          </button>
        </div>
      </div>

      {/* Confirm Delete Modal */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={closeConfirm}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Dialog */}
          <div
            className="relative z-10 w-[92%] max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                <FaTrash />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Delete account?
              </h3>
            </div>

            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
              You're about to delete <span className="font-semibold">{accountName}</span>. This action can't be undone.
              Are you sure you want to continue?
            </p>

            <div className="mt-6 flex flex-wrap gap-3 justify-end">
              <button
                onClick={closeConfirm}
                className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`px-4 py-2 rounded-full text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-red-400
                  ${isDeleting ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
              >
                {isDeleting ? 'Deleting...' : 'Yes, delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountCard;

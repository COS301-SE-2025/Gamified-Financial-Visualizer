import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { FaTimes, FaChevronDown } from 'react-icons/fa';

/* ───────── Shared UI to match Transactions filters ───────── */

const FilterDropdown = ({
  name,
  value,
  onChange,
  options,
  placeholder = 'Select…',
  offsetY = 12,
  placement = 'auto',
  containerClassName = 'w-full',
  disabled = false,
  loading = false,
}) => {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const wrapRef = useRef(null);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const [menuStyle, setMenuStyle] = useState({});

  const selectedIndex = options.findIndex(o => String(o.value) === String(value));
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null;

  useEffect(() => {
    const onPointerDown = (e) => {
      const inButton = wrapRef.current?.contains(e.target);
      const inMenu = menuRef.current?.contains(e.target);
      if (inButton || inMenu) return;
      setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, []);

  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;

    const GAP = 8;
    const viewportH = window.innerHeight;
    const MAX_MENU_WIDTH = Math.min(560, window.innerWidth - GAP * 2);

    const calc = () => {
      const rect = btnRef.current.getBoundingClientRect();

      const itemH = 36, chrome = 8;
      const wantedH = chrome + (options?.length || 0) * itemH;
      const maxH = Math.min(320, Math.floor(viewportH * 0.5));
      const menuH = Math.min(wantedH, maxH);

      const availBelow = viewportH - rect.bottom - GAP;
      const availAbove = rect.top - GAP;
      let placeBelow;
      if (placement === 'bottom') placeBelow = true;
      else if (placement === 'top') placeBelow = false;
      else placeBelow = availBelow >= Math.min(menuH, 160) || availBelow >= availAbove;

      const top = placeBelow ? rect.bottom + offsetY : Math.max(GAP, rect.top - offsetY - menuH);

      setMenuStyle({
        position: 'fixed',
        top,
        left: rect.left,
        minWidth: rect.width,
        width: 'max-content',
        maxWidth: MAX_MENU_WIDTH,
        maxHeight: maxH,
        zIndex: 9999,
      });

      requestAnimationFrame(() => {
        const m = menuRef.current?.getBoundingClientRect();
        if (!m) return;
        let left = rect.left;
        if (left + m.width + GAP > window.innerWidth) {
          left = Math.max(GAP, window.innerWidth - m.width - GAP);
        }
        setMenuStyle((s) => ({ ...s, left }));
      });
    };

    calc();
    const onScrollOrResize = () => calc();
    window.addEventListener('resize', onScrollOrResize);
    window.addEventListener('scroll', onScrollOrResize, true);
    return () => {
      window.removeEventListener('resize', onScrollOrResize);
      window.removeEventListener('scroll', onScrollOrResize, true);
    };
  }, [open, offsetY, placement, options?.length]);

  useEffect(() => setHighlight(selectedIndex >= 0 ? selectedIndex : 0), [open, selectedIndex]);

  const commit = (idx) => {
    const opt = options[idx];
    if (!opt) return;
    onChange(opt.value);
    setOpen(false);
  };

  const onKey = (e) => {
    if (disabled || loading) return;
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); setOpen(true); return; }
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight(h => Math.min(options.length - 1, h + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight(h => Math.max(0, h - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); commit(highlight); }
    else if (e.key === 'Escape') { e.preventDefault(); setOpen(false); }
  };

  return (
    <div className={containerClassName} ref={wrapRef}>
      <button
        type="button"
        ref={btnRef}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => !disabled && !loading && setOpen(o => !o)}
        onKeyDown={onKey}
        disabled={disabled || loading}
        className={`h-10 w-full rounded-xl px-4 border dark:border-gray-600 shadow dark:shadow-none
                    bg-white dark:bg-gray-800 text-left text-gray-900 dark:text-white flex items-center justify-between
                    focus:outline-none focus:ring-2 focus:ring-[#AAD977] focus:border-[#AAD977]
                    ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        <span className={`truncate ${selected ? '' : 'text-gray-400 dark:text-gray-400'}`}>
          {loading ? 'Loading…' : (selected ? selected.label : placeholder)}
        </span>
        <FaChevronDown className="ml-3 text-gray-400 dark:text-gray-500 shrink-0" />
      </button>

      {open && (
        <ul
          ref={menuRef}
          role="listbox"
          tabIndex={-1}
          style={menuStyle}
          onKeyDown={onKey}
          onWheel={(e) => e.stopPropagation()}
          className="rounded-xl border border-gray-200 dark:border-gray-600
                     bg-white dark:bg-gray-800 shadow-lg overflow-y-auto"
        >
          <style>{`.dropdown-overscroll{overscroll-behavior:contain}`}</style>
          <div className="dropdown-overscroll">
            {options.length === 0 && (
              <li className="px-3 h-8 flex items-center text-sm text-gray-500 dark:text-gray-300">No options</li>
            )}
            {options.map((opt, idx) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={String(opt.value) === String(value)}
                onMouseEnter={() => setHighlight(idx)}
                onClick={() => commit(idx)}
                className={`px-3 pr-6 h-8 flex items-center text-sm cursor-pointer whitespace-nowrap
                            ${idx === highlight ? 'bg-gray-100 dark:bg-gray-700' : ''}
                            ${String(opt.value) === String(value) ? 'font-medium text-[#1b5e20]' : 'text-gray-800 dark:text-gray-100'}`}
              >
                {opt.label}
              </li>
            ))}
          </div>
        </ul>
      )}

      <input type="hidden" name={name} value={value ?? ''} />
    </div>
  );
};

const TextField = ({
  name,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  disabled = false,
  containerClassName = 'w-full',
  inputProps = {},
}) => (
  <div className={containerClassName}>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      autoComplete="off"
      className={`h-10 w-full rounded-xl px-4 border dark:border-gray-600 shadow dark:shadow-none
                  bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-[#AAD977] focus:border-[#AAD977]
                  [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                  [appearance:textfield]`}
      {...inputProps}
    />
  </div>
);

/* ─────────────── AddAccountModal (styled) ─────────────── */

const AddAccountModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    bankName: '',
    accountName: '',
    accountType: '',
    balance: '',
    available: '',
    currency: 'ZAR',
  });

  // input guards (keep your original behavior)
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (['bankName', 'accountName'].includes(name)) {
      // letters + spaces only
      if (!/^[A-Za-z\s]*$/.test(value)) return;
    }

    if (name === 'balance') {
      // allow digits + single dot
      if (!/^\d*\.?\d*$/.test(value)) return;
    }

    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.bankName || !formData.accountName || !formData.accountType || !formData.balance) {
      // simple guard; add your preferred toasts if needed
      return;
    }
    onAdd({
      ...formData,
      bankName: formData.bankName.trim(),
      accountName: formData.accountName.trim(),
      accountType: formData.accountType,
      balance: parseFloat(formData.balance || '0') || 0,
      currency: (formData.currency || 'ZAR').toUpperCase(),
    });
    onClose();
    setFormData({ bankName: '', accountName: '', accountType: '', balance: '', currency: 'ZAR' });
  };

  if (!isOpen) return null;

  const currencyOptions = [
    'ZAR','USD','EUR','GBP','BTC','ETH','USDT','LTC','XRP','SOL','ADA','DOGE','USDC'
  ].map(c => ({ value: c, label: c }));

  const accountTypeOptions = [
    { value: '', label: 'Select type' },
    { value: 'current', label: 'Current' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'savings', label: 'Savings' },
    { value: 'investment', label: 'Investment' },
    { value: 'credit', label: 'Credit' },
    { value: 'fixed deposit', label: 'Fixed Deposit' },
    { value: 'business', label: 'Business' },
    { value: 'transmission', label: 'Transmission' },
    { value: 'tax-free savings', label: 'Tax-Free Savings' },
    { value: 'trust', label: 'Trust' },
    { value: 'corporate trading', label: 'Corporate Trading' },
    { value: 'crypto', label: 'Crypto' },
    { value: 'forex', label: 'Forex' },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
          aria-label="Close add account modal"
        >
          <FaTimes size={18} />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Account</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {/* Bank Name */}
          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-300 mb-1">Bank Name</label>
            <TextField
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              placeholder="FNB"
            />
          </div>

          {/* Account Name */}
          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-300 mb-1">Account Name</label>
            <TextField
              name="accountName"
              value={formData.accountName}
              onChange={handleChange}
              placeholder="Private Account"
            />
          </div>

          {/* Balance */}
          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-300 mb-1">Balance</label>
            <TextField
              name="balance"
              type="number"
              value={formData.balance}
              onChange={handleChange}
              placeholder="10000"
              inputProps={{ inputMode: 'decimal', step: '0.01', min: '0' }}
            />
          </div>

          {/* Currency */}
          <div className="flex flex-col">
            <label className="text-gray-700 dark:text-gray-300 mb-1">Currency</label>
            <FilterDropdown
              name="currency"
              value={formData.currency}
              onChange={(v) => setFormData(s => ({ ...s, currency: v }))}
              options={currencyOptions}
              placeholder="Select currency"
            />
          </div>

          {/* Account Type */}
          <div className="flex flex-col sm:col-span-2">
            <label className="text-gray-700 dark:text-gray-300 mb-1">Account Type</label>
            <FilterDropdown
              name="accountType"
              value={formData.accountType}
              onChange={(v) => setFormData(s => ({ ...s, accountType: v }))}
              options={accountTypeOptions}
              placeholder="Select type"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-[#D8F5C5] dark:bg-green-700 text-[#467D35] dark:text-green-100 text-sm font-semibold rounded-full hover:bg-[#c8ecb4] dark:hover:bg-green-600 transition shadow-md"
          >
            Add Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAccountModal;


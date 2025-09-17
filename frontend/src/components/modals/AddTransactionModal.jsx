import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { FaSave, FaTimes, FaChevronDown } from 'react-icons/fa';

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";


/* ───────────────────────── Shared Helpers ───────────────────────── */

const getTodayLocal = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const toISODate = (yyyyMmDd) => {
  // Post as ISO at 00:00 local to keep backend happy with timestamp types
  try {
    if (!yyyyMmDd) return new Date().toISOString();
    const [y, m, d] = yyyyMmDd.split('-').map((x) => parseInt(x, 10));
    const dt = new Date(y, (m || 1) - 1, d || 1, 0, 0, 0, 0);
    return dt.toISOString();
  } catch {
    return new Date().toISOString();
  }
};

/** Same look/feel as the Transactions page filter dropdown */
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

/** Input styled to exactly match the dropdown’s size/border/focus */
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
                  [&::-webkit-calendar-picker-indicator]:opacity-70
                  [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                  [appearance:textfield]`}
      {...inputProps}
    />
  </div>
);

/* ───────────────────────── Modal ───────────────────────── */

const AddTransactionModal = ({ isOpen, onClose, onAdd, activeAccount }) => {
  const [form, setForm] = useState({
    type: '',
    name: '',
    date: '',
    categories: '',
    newCategories: '',
    amount: '',
    goals: '',
    challenges: '',
    recurring: '',   // UI string; we still post boolean is_recurring
    budget: '',
  });

  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [challenges, setChallenges] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [loadingCats, setLoadingCats] = useState(false);
  const [loadingBudgets, setLoadingBudgets] = useState(false);
  const [loadingGoals, setLoadingGoals] = useState(false);
  const [loadingChallenges, setLoadingChallenges] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const user = (() => { try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; } })();
    const uid = user?.id;

    const fetchCategories = async () => {
      setLoadingCats(true);
      try {
        const res = await fetch(`${BASE_URL}/api/transactions/categories`);
        const data = await res.json();
        setCategories(Array.isArray(data?.data) ? data.data : []);
      } catch { setCategories([]); } finally { setLoadingCats(false); }
    };

    const fetchBudgets = async () => {
      if (!uid) return setBudgets([]);
      setLoadingBudgets(true);
      try {
        const res = await fetch(`${BASE_URL}/api/budget/user/${uid}`);
        const data = await res.json();
        setBudgets(Array.isArray(data?.data) ? data.data : []);
      } catch { setBudgets([]); } finally { setLoadingBudgets(false); }
    };

    const fetchGoals = async () => {
      if (!uid) return setGoals([]);
      setLoadingGoals(true);
      try {
        const res = await fetch(`${BASE_URL}/api/goal/user/${uid}`);
        const data = await res.json();
        setGoals(Array.isArray(data?.data) ? data.data : []);
      } catch { setGoals([]); } finally { setLoadingGoals(false); }
    };

    const fetchChallenges = async () => {
      if (!uid) return setChallenges([]);
      setLoadingChallenges(true);
      try {
        const res = await fetch(`${BASE_URL}/api/community/challenges/user/${uid}`);
        const data = await res.json();
        setChallenges(Array.isArray(data?.data?.active) ? data.data.active : []);
      } catch { setChallenges([]); } finally { setLoadingChallenges(false); }
    };

    fetchCategories();
    fetchBudgets();
    fetchGoals();
    fetchChallenges();
  }, [isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const submit = async () => {
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      // Guard rails
      if (form.categories && form.newCategories) {
        throw new Error('Please select a category OR type a new one — not both.');
      }
      if (!form.name?.trim() || !form.type) {
        throw new Error('Please fill in all required fields (name, type).');
      }

      const amt = typeof form.amount === 'string' ? parseFloat(form.amount.replace(/\s/g, '')) : Number(form.amount);
      if (!Number.isFinite(amt) || amt <= 0) {
        throw new Error('Please enter a valid amount greater than 0.');
      }

      if (!activeAccount?.account_id) {
        throw new Error('No active account selected.');
      }

      // Normalize date (no future)
      const today = getTodayLocal();
      const chosen = form.date ? form.date : today;
      const safeDateYmd = chosen > today ? today : chosen;
      const safeDateISO = toISODate(safeDateYmd);

      // Build payload for your backend
      const payload = {
        account_id: activeAccount.account_id,
        transaction_name: form.newCategories && !form.categories
          ? `${form.name} (${form.newCategories})`
          : form.name,
        transaction_amount: amt,
        transaction_type: form.type,
        transaction_date: safeDateISO,
        category_id: form.categories ? parseInt(form.categories, 10) : null,
        custom_category_id: null, // keep null unless your POST supports creating custom categories
        budget_id: form.budget ? parseInt(form.budget, 10) : null,
        is_recurring: !!form.recurring, // boolean for DB
        linked_goal_id: form.goals ? parseInt(form.goals, 10) : null,
        linked_challenge_id: form.challenges ? parseInt(form.challenges, 10) : null,
        points_awarded: 0,
      };

      const resp = await fetch(`${BASE_URL}/api/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // Try to parse even for non-2xx to surface server error message
      let json;
      try { json = await resp.json(); } catch { json = null; }

      if (!resp.ok) {
        const msg = json?.message || json?.error || `Failed to create transaction (${resp.status})`;
        throw new Error(msg);
      }

      // Tolerate different response shapes
      const created =
        json?.data?.transaction ??
        json?.data ??
        json?.transaction ??
        json;

      const newId =
        created?.transaction_id ??
        created?.id ??
        json?.data?.transaction_id ??
        json?.transaction_id ??
        null;

      // Update parent immediately with a clean shape
      onAdd?.({
        transaction_id: newId,
        account_id: activeAccount.account_id,
        transaction_name: payload.transaction_name,
        transaction_amount: amt,        // numeric for parent calc/format
        transaction_type: form.type,
        transaction_date: safeDateYmd,  // keep YYYY-MM-DD for UI
        category: form.categories
          ? (categories.find(c => c.category_id === parseInt(form.categories, 10))?.category_name || 'Unknown')
          : (form.newCategories || 'Uncategorized'),
        is_recurring: !!form.recurring,
        linked_goal_id: payload.linked_goal_id,
        linked_challenge_id: payload.linked_challenge_id,
        budget_id: payload.budget_id,
        currency: activeAccount.currency || 'ZAR',
      });

      // Reset & close
      setForm({
        type: '',
        name: '',
        date: '',
        categories: '',
        newCategories: '',
        amount: '',
        goals: '',
        challenges: '',
        recurring: '',
        budget: '',
      });
      onClose?.();
    } catch (err) {
      console.error('Error creating transaction:', err);
      setError(err.message || 'Failed to create transaction');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  /* Options */
  const typeOptions = [
    { value: '', label: 'Select type' },
    { value: 'expense', label: 'Expense' },
    { value: 'income', label: 'Income' },
    { value: 'transfer', label: 'Transfer' },
    { value: 'fee', label: 'Fee' },
    { value: 'withdrawal', label: 'Withdrawal' },
    { value: 'deposit', label: 'Deposit' },
  ];
  const recurringOptions = [
    { value: '', label: 'None' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Biweekly' },
    { value: 'monthly', label: 'Monthly' },
  ];
  const budgetOptions = [{ value: '', label: 'Select budget' }].concat(
    budgets.map(b => ({ value: String(b.budget_id), label: b.budget_name }))
  );
  const categoryOptions = [{ value: '', label: 'Select category' }].concat(
    categories.map(c => ({ value: String(c.category_id), label: c.category_name }))
  );
  const goalOptions = [{ value: '', label: 'Select goal' }].concat(
    goals.map(g => ({ value: String(g.goal_id), label: g.goal_name }))
  );
  const challengeOptions = [{ value: '', label: 'Select challenge' }].concat(
    challenges.map(c => ({ value: String(c.id), label: c.title }))
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-[500px] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <FaTimes size={18} />
        </button>

        <h3 className="text-lg font-bold mb-4 text-center text-gray-800 dark:text-gray-200">
          Add New Transaction
        </h3>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded p-3 mb-4 text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          {/* Transaction Type */}
          <div className="flex flex-col">
            <label className="text-gray-600 dark:text-gray-300 mb-1">Transaction type</label>
            <FilterDropdown
              name="type"
              value={form.type}
              onChange={(v) => handleChange({ target: { name: 'type', value: v } })}
              options={typeOptions}
              placeholder="Select type"
            />
          </div>

          {/* Recurring */}
          <div className="flex flex-col">
            <label className="text-gray-600 dark:text-gray-300 mb-1">Recurring</label>
            <FilterDropdown
              name="recurring"
              value={form.recurring}
              onChange={(v) => handleChange({ target: { name: 'recurring', value: v } })}
              options={recurringOptions}
              placeholder="None"
            />
          </div>

          {/* Transaction Name */}
          <div className="flex flex-col">
            <label className="text-gray-600 dark:text-gray-300 mb-1">Transaction name</label>
            <TextField
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter transaction name"
            />
          </div>

          {/* Amount */}
          <div className="flex flex-col">
            <label className="text-gray-600 dark:text-gray-300 mb-1">Amount</label>
            <TextField
              name="amount"
              type="number"
              value={form.amount}
              onChange={handleChange}
              placeholder="0.00"
              inputProps={{ step: '0.01', min: '0', inputMode: 'decimal' }}
            />
          </div>

          {/* Date */}
          <div className="flex flex-col">
            <label className="text-gray-600 dark:text-gray-300 mb-1">Date</label>
            <TextField
              name="date"
              type="date"
              value={form.date}
              onChange={(e) => {
                const today = getTodayLocal();
                const v = e.target.value;
                const clamped = v && v > today ? today : v;
                setForm((prev) => ({ ...prev, date: clamped }));
                setError('');
              }}
              inputProps={{ max: getTodayLocal() }}
            />
          </div>

          {/* Budget */}
          <div className="flex flex-col">
            <label className="text-gray-600 dark:text-gray-300 mb-1">Budget</label>
            <FilterDropdown
              name="budget"
              value={form.budget}
              onChange={(v) => handleChange({ target: { name: 'budget', value: v } })}
              options={budgetOptions}
              placeholder="Select budget"
              disabled={loadingBudgets}
              loading={loadingBudgets}
            />
          </div>

          {/* Categories */}
          <div className="flex flex-col">
            <label className="text-gray-600 dark:text-gray-300 mb-1">Categories</label>
            <FilterDropdown
              name="categories"
              value={form.categories}
              onChange={(v) => handleChange({ target: { name: 'categories', value: v } })}
              options={categoryOptions}
              placeholder="Select category"
              disabled={loadingCats}
              loading={loadingCats}
              containerClassName="w-44 sm:w-52"
            />
          </div>

          {/* New Category */}
          <div className="flex flex-col">
            <label className="text-gray-600 dark:text-gray-300 mb-1">New Category</label>
            <TextField
              name="newCategories"
              value={form.newCategories}
              onChange={handleChange}
              placeholder="Enter new category"
            />
          </div>

          {/* Goals */}
          <div className="flex flex-col">
            <label className="text-gray-600 dark:text-gray-300 mb-1">Goals</label>
            <FilterDropdown
              name="goals"
              value={form.goals}
              onChange={(v) => handleChange({ target: { name: 'goals', value: v } })}
              options={goalOptions}
              placeholder="Select goal"
              disabled={loadingGoals}
              loading={loadingGoals}
            />
          </div>

          {/* Challenges */}
          <div className="flex flex-col">
            <label className="text-gray-600 dark:text-gray-300 mb-1">Challenges</label>
            <FilterDropdown
              name="challenges"
              value={form.challenges}
              onChange={(v) => handleChange({ target: { name: 'challenges', value: v } })}
              options={challengeOptions}
              placeholder="Select challenge"
              disabled={loadingChallenges}
              loading={loadingChallenges}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center mt-6 gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex items-center gap-2 bg-red-100 dark:bg-red-800 text-red-500 dark:text-red-200 px-4 py-2 rounded-full disabled:opacity-50 hover:bg-red-300 dark:hover:bg-red-700 transition"
          >
            <FaTimes /> Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="flex items-center gap-2 bg-lime-100 dark:bg-green-700 text-lime-600 dark:text-green-100 px-4 py-2 rounded-full disabled:opacity-50 hover:bg-green-300 dark:hover:bg-green-600 transition"
          >
            <FaSave /> {loading ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionModal;

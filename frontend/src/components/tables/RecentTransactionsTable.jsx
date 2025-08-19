import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaTrash, FaEdit, FaPlus, FaChevronDown } from 'react-icons/fa';
import AddTransactionModal from '../modals/AddTransactionModal';

/* -------------------------- Helpers / Normalizers -------------------------- */

const toTitleCase = (str = '') =>
  String(str).trim().toLowerCase().split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

const parseDate = (input) => {
  if (!input) return null;
  if (input instanceof Date) return isNaN(input.getTime()) ? null : input;

  const s = String(input).trim();
  const d1 = new Date(s);
  if (!isNaN(d1.getTime())) return d1;

  if (s.includes('/')) {
    const parts = s.split('/').map(v => parseInt(v, 10));
    if (parts.length === 3 && parts.every(n => Number.isFinite(n))) {
      const [a, b, c] = parts;
      const dayFirst = a > 12;
      const day = dayFirst ? a : b;
      const month = dayFirst ? b : a;
      const year = c;
      const d = new Date(year, month - 1, day);
      if (!isNaN(d.getTime())) return d;
    }
  }

  if (s.includes('-')) {
    const [y, m, d] = s.split('-').map(v => parseInt(v, 10));
    if ([y, m, d].every(n => Number.isFinite(n))) {
      const dt = new Date(y, m - 1, d);
      if (!isNaN(dt.getTime())) return dt;
    }
  }

  return null;
};

const ymd = (date) => {
  const d = parseDate(date);
  if (!d) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const todayYMD = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const clampYMD = (valueYMD, { minYMD, maxYMD }) => {
  if (!valueYMD) return valueYMD;
  const v = valueYMD;
  if (minYMD && v < minYMD) return minYMD;
  if (maxYMD && v > maxYMD) return maxYMD;
  return v;
};

// amounts
const parseAmount = (val) => {
  if (val == null) return 0;
  if (typeof val === 'number') return val;
  const s = String(val);
  const sign = s.trim().startsWith('-') ? -1 : 1;
  const num = parseFloat(s.replace(/[^\d.]/g, ''));
  return Number.isFinite(num) ? sign * num : 0;
};

// Normalize to a consistent shape for rendering/filtering
const normalizeTxn = (t) => {
  const categoryRaw = (t.category ?? t.category_name ?? '').toString().trim();
  const typeRaw = (t.transaction_type ?? t.type ?? '').toString().trim();
  return {
    ...t,
    _name: (t.name ?? t.transaction_name ?? '').toString(),
    _category: categoryRaw.toLowerCase(),
    _categoryLabel: toTitleCase(categoryRaw),
    _type: typeRaw.toLowerCase(),
    _date: parseDate(t.date ?? t.transaction_date),
    _amount: parseAmount(t.amount ?? t.transaction_amount),
    _isExpense: ['expense', 'withdrawal', 'fee'].includes(typeRaw.toLowerCase()),
    _isIncome: ['income', 'deposit'].includes(typeRaw.toLowerCase()),
    _isTransfer: typeRaw.toLowerCase() === 'transfer',
  };
};

/* --------------------------- SortDropdown --------------------------- */

const SortDropdown = ({
  name,
  value,
  onChange,
  options,
  placeholder = 'Select...',
  offsetY = 12,
  placement = 'auto',
}) => {
  const [open, setOpen] = React.useState(false);
  const [highlight, setHighlight] = React.useState(0);
  const wrapRef = React.useRef(null);
  const btnRef = React.useRef(null);
  const menuRef = React.useRef(null);
  const [menuStyle, setMenuStyle] = React.useState({});

  const selectedIndex = options.findIndex(o => String(o.value) === String(value));
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null;

  React.useEffect(() => {
    const onPointerDown = (e) => {
      const inButton = wrapRef.current?.contains(e.target);
      const inMenu = menuRef.current?.contains(e.target);
      if (inButton || inMenu) return;
      setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, []);

  React.useLayoutEffect(() => {
    if (!open || !btnRef.current) return;

    const GAP = 8;
    const MAX_MENU_WIDTH = Math.min(560, window.innerWidth - GAP * 2);
    const viewportH = window.innerHeight;

    const calcBase = () => {
      const rect = btnRef.current.getBoundingClientRect();

      const itemH = 36;
      const chrome = 8;
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
        const menuRect = menuRef.current?.getBoundingClientRect();
        if (!menuRect) return;
        let left = rect.left;
        if (left + menuRect.width + GAP > window.innerWidth) {
          left = Math.max(GAP, window.innerWidth - menuRect.width - GAP);
        }
        setMenuStyle((s) => ({ ...s, left }));
      });
    };

    calcBase();
    const onScrollOrResize = () => calcBase();
    window.addEventListener('resize', onScrollOrResize);
    window.addEventListener('scroll', onScrollOrResize, true);
    return () => {
      window.removeEventListener('resize', onScrollOrResize);
      window.removeEventListener('scroll', onScrollOrResize, true);
    };
  }, [open, offsetY, placement, options?.length]);

  React.useEffect(() => {
    setHighlight(selectedIndex >= 0 ? selectedIndex : 0);
  }, [open, selectedIndex]);

  const commit = (idx) => {
    const opt = options[idx];
    if (!opt) return;
    onChange(opt.value);
    setOpen(false);
  };

  const onKey = (e) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); setOpen(true); return; }
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight(h => Math.min(options.length - 1, h + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight(h => Math.max(0, h - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); commit(highlight); }
    else if (e.key === 'Escape') { e.preventDefault(); setOpen(false); }
  };
  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        ref={btnRef}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        onKeyDown={onKey}
        className="w-full rounded-xl px-4 py-2 border dark:border-gray-600 shadow dark:shadow-none
                   bg-white dark:bg-gray-800 text-left text-gray-900 dark:text-white flex items-center justify-between"
      >
        <span className={`${selected ? '' : 'text-gray-400 dark:text-gray-400'}`}>
          {selected ? selected.label : placeholder}
        </span>
        <FaChevronDown className="ml-3 text-gray-400 dark:text-gray-500" />
      </button>

      {open && createPortal(
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
          <style>{`.dropdown-overscroll { overscroll-behavior: contain; }`}</style>
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
                className={`px-3 h-8 flex items-center text-sm cursor-pointer
                            ${idx === highlight ? 'bg-gray-100 dark:bg-gray-700' : ''}
                            ${String(opt.value) === String(value) ? 'font-medium text-[#1b5e20]' : 'text-gray-800 dark:text-gray-100'}`}
              >
                {opt.label}
              </li>
            ))}
          </div>
        </ul>,
        document.body
      )}

      <input type="hidden" name={name} value={value ?? ''} />
    </div>
  );
};

/* ----------------------------- Main Component ------------------------------ */

const RecentTransactionsTable = ({
  account,
  transactions = [],
  heading,
  onAdd,       // optional: still called
  onEdit,      // optional: now called with (id, updated)
  onDelete,    // optional: now called with (id)
  onRefresh,   // optional
}) => {
  const isAccountView = Boolean(account);

  // Keep a local, UI-controlled copy to allow instant updates
  const [clientTxns, setClientTxns] = useState(transactions);
  useEffect(() => setClientTxns(transactions), [transactions]);

  // Controls
  const [sortBy, setSortBy] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // UI state
  const [showAddModal, setShowAddModal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Categories
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  // Edit row state
  const [editTransactionId, setEditTransactionId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, transactionId: null });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/transactions/categories');
        const data = await response.json().catch(() => ({}));
        const list = Array.isArray(data?.data) ? data.data : [];
        setCategories(list);
      } catch {
        // fallback
        setCategories([
          { category_id: 1, category_name: 'Food' },
          { category_id: 2, category_name: 'Transport' },
          { category_id: 3, category_name: 'Fuel' },
          { category_id: 4, category_name: 'Entertainment' },
          { category_id: 5, category_name: 'Health' },
          { category_id: 6, category_name: 'Personal' }
        ]);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Normalize from local list
  const normalizedTxns = useMemo(() => (clientTxns || []).map(normalizeTxn), [clientTxns]);

  // Filtering + sorting
  const filteredSortedTransactions = useMemo(() => {
    let rows = [...normalizedTxns];

    if (categoryFilter) rows = rows.filter(txn => txn._category === categoryFilter);
    if (typeFilter) rows = rows.filter(txn => txn._type === typeFilter);

    if (dateFilter) {
      const today = new Date();
      rows = rows.filter(txn => {
        if (!txn._date) return false;
        if (dateFilter === '7d')  return (today - txn._date) / 86400000 <= 7;
        if (dateFilter === '10d') return (today - txn._date) / 86400000 <= 10;
        if (dateFilter === 'last_month') {
          const last = new Date(today.getFullYear(), today.getMonth() - 1, 1);
          const lastEnd = new Date(today.getFullYear(), today.getMonth(), 0);
          return txn._date >= last && txn._date <= lastEnd;
        }
        return true;
      });
    }

    switch (sortBy) {
      case 'name':        rows.sort((a, b) => a._name.localeCompare(b._name)); break;
      case 'amount_asc':  rows.sort((a, b) => a._amount - b._amount); break;
      case 'amount_desc': rows.sort((a, b) => b._amount - a._amount); break;
      case 'date_desc':   rows.sort((a, b) => (b._date?.getTime() || 0) - (a._date?.getTime() || 0)); break;
      default: break;
    }
    return rows;
  }, [normalizedTxns, sortBy, categoryFilter, dateFilter, typeFilter]);

  /* ------------------------------- Handlers ------------------------------- */

  // ADD — update UI immediately
  const handleAddTransaction = async (newTransaction) => {
    try {
      setError('');
      setClientTxns(prev => [newTransaction, ...prev]); // optimistic
      onAdd?.(newTransaction);
      if (onRefresh) await onRefresh(account?.account_id);
    } catch (err) {
      setError('Failed to add transaction');
      console.error('Error adding transaction:', err);
    }
  };

  // EDIT — PUT by id, clamp date >= original_date and <= today, update local list by id
  const saveEdit = async (originalTxn) => {
    const id = originalTxn.transaction_id;
    if (!id) { setError('Missing transaction ID for edit'); return; }

    // Derive chosen values
    const chosenName = editValues.name ?? originalTxn._name;
    const chosenAmount = editValues.amount != null ? parseAmount(editValues.amount) : originalTxn._amount;

    // Category – store category_id during edit
    const chosenCategoryId = editValues.category_id != null
      ? parseInt(editValues.category_id, 10)
      : (originalTxn.category_id ?? null);

    // Date rule: can only change to same or later than the original date, and not in the future
    const origY = ymd(originalTxn._date || originalTxn.transaction_date || originalTxn.date);
    const pickedY = editValues.date || origY;
    const safeDate = clampYMD(pickedY, { minYMD: origY, maxYMD: todayYMD() });

    const payload = {
      transaction_name: chosenName,
      transaction_amount: chosenAmount,
      transaction_date: safeDate,
      category_id: chosenCategoryId,
      // keep original type/budget/links unless you also edit those
      transaction_type: originalTxn.transaction_type ?? originalTxn._type,
      budget_id: originalTxn.budget_id ?? null,
      linked_goal_id: originalTxn.linked_goal_id ?? null,
      linked_challenge_id: originalTxn.linked_challenge_id ?? null,
      is_recurring: !!originalTxn.is_recurring,
      points_awarded: originalTxn.points_awarded ?? 0,
      account_id: originalTxn.account_id,
    };

    try {
      setBusy(true);
      setError('');
      const resp = await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      let json = null;
      try { json = await resp.json(); } catch {}

      if (!resp.ok) {
        const msg = json?.message || json?.error || `Failed to update transaction (${resp.status})`;
        throw new Error(msg);
      }

      // Update local list immediately by id
      setClientTxns(prev =>
        prev.map(t => (t.transaction_id === id
          ? {
              ...t,
              name: chosenName,
              transaction_name: chosenName,
              amount: chosenAmount,
              transaction_amount: chosenAmount,
              date: safeDate,
              transaction_date: safeDate,
              category_id: chosenCategoryId,
              category: categories.find(c => c.category_id === chosenCategoryId)?.category_name ?? t.category,
              category_name: categories.find(c => c.category_id === chosenCategoryId)?.category_name ?? t.category_name,
            }
          : t))
      );

      onEdit?.(id, payload);
      if (onRefresh) await onRefresh(account?.account_id);
      setEditTransactionId(null);
    } catch (err) {
      setError(err.message || 'Failed to update transaction');
      console.error('Error updating transaction:', err);
    } finally {
      setBusy(false);
    }
  };

  // DELETE — delete by id, remove from local list
  const handleDeleteById = async (transactionId) => {
    if (!transactionId) return;
    try {
      setBusy(true);
      setError('');
      const response = await fetch(`http://localhost:5000/api/transactions/${transactionId}`, { method: 'DELETE' });
      let json = null;
      try { json = await response.json(); } catch {}
      if (!response.ok) {
        const msg = json?.message || json?.error || 'Failed to delete transaction';
        throw new Error(msg);
      }
      setClientTxns(prev => prev.filter(t => t.transaction_id !== transactionId)); // instant UI update
      onDelete?.(transactionId);
      if (onRefresh) await onRefresh(account?.account_id);
    } catch (err) {
      setError(err.message || 'Failed to delete transaction');
      console.error('Error deleting transaction:', err);
    } finally {
      setBusy(false);
      setDeleteConfirmation({ show: false, transactionId: null });
    }
  };

  const showDelete = (transactionId) =>
    setDeleteConfirmation({ show: true, transactionId });

  const hideDelete = () =>
    setDeleteConfirmation({ show: false, transactionId: null });

  /* --------------------------------- UI ---------------------------------- */

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md px-6 py-6">
      {/* Delete confirmation */}
      {deleteConfirmation.show && (() => {
        const txn = normalizedTxns.find(t => t.transaction_id === deleteConfirmation.transactionId);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={hideDelete} />
            <div className="relative z-10 w-[92%] max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <FaTrash />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Delete transaction?</h3>
              </div>

              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                You&apos;re about to delete a transaction of{' '}
                <span className="font-semibold">
                  {txn?._isTransfer
                    ? 'transfer'
                    : (Math.abs(txn?._amount ?? 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>{' '}
                for <span className="font-semibold">{txn?._name}</span>. This action cannot be undone.
              </p>

              <div className="mt-6 flex flex-wrap gap-3 justify-end">
                <button
                  onClick={hideDelete}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  disabled={busy}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteById(deleteConfirmation.transactionId)}
                  disabled={busy}
                  className={`px-4 py-2 rounded-full text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-red-400
                    ${busy ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  {busy ? 'Deleting...' : 'Yes, delete'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Header + Controls */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#336699]">{heading}</h2>

        <div className="flex gap-2 items-center">
          <SortDropdown
            name="sortBy"
            value={sortBy}
            onChange={setSortBy}
            options={[
              { value: '', label: 'Sort by' },
              { value: 'name', label: 'Name (A–Z)' },
              { value: 'amount_asc', label: 'Amount ↑' },
              { value: 'amount_desc', label: 'Amount ↓' },
              { value: 'date_desc', label: 'Date (Newest)' },
            ]}
            placeholder="Sort by"
          />

          <SortDropdown
            name="categoryFilter"
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={[
              { value: '', label: 'Filter by categories' },
              ...categories.map(cat => {
                const val = String(cat.category_name || '').trim().toLowerCase();
                return { value: val, label: toTitleCase(val) };
              }),
            ]}
            placeholder="Filter by categories"
          />

          <SortDropdown
            name="dateFilter"
            value={dateFilter}
            onChange={setDateFilter}
            options={[
              { value: '', label: 'Filter by date' },
              { value: '7d', label: 'Last 7 Days' },
              { value: '10d', label: 'Last 10 Days' },
              { value: 'last_month', label: 'Last Month' },
            ]}
            placeholder="Filter by date"
          />

          <SortDropdown
            name="typeFilter"
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              { value: '', label: 'Filter by type' },
              { value: 'income', label: 'Income' },
              { value: 'expense', label: 'Expense' },
              { value: 'deposit', label: 'Deposit' },
              { value: 'withdrawal', label: 'Withdrawal' },
              { value: 'fee', label: 'Fee' },
              { value: 'transfer', label: 'Transfer' },
            ]}
            placeholder="Filter by type"
          />

          {isAccountView && (
            <button
              onClick={() => setShowAddModal(true)}
              disabled={!account || busy}
              className="flex items-center gap-2 px-4 py-1 bg-[#D8F5C5] dark:bg-[#AAD977] dark:text-white text-[#76B947] text-sm font-medium rounded-full hover:bg-[#c8ecb4] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaPlus /> Add
            </button>
          )}
        </div>
      </div>

      {/* Errors */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded p-3 mb-4 text-red-700 dark:text-red-300 text-sm">
          {error}
          <button onClick={() => setError('')} className="ml-2 text-red-500 dark:text-red-300 hover:text-red-700 dark:hover:text-red-400">×</button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead className="border-b dark:border-gray-700">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSortedTransactions.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  {isAccountView ? (account ? 'No transactions found for this account' : 'Select an account to view transactions') : 'No transactions available'}
                </td>
              </tr>
            ) : (
              filteredSortedTransactions.map((txn) => {
                const isEditing = editTransactionId === txn.transaction_id;
                const isExpense = ['expense', 'withdrawal', 'fee'].includes(txn.transaction_type);
                const isIncome = ['income', 'deposit'].includes(txn.transaction_type);
                const isTransfer = ['transfer'].includes(txn.transaction_type);

                const amountColor = isExpense ? 'text-red-500'
                  : isIncome ? 'text-lime-600'
                    : isTransfer ? 'text-sky-500'
                      : '';

                const amountSign = txn._isExpense ? '-' : txn._isIncome ? '+' : txn._isTransfer ? '→' : '';

                const originalYMD = ymd(txn._date || txn.transaction_date || txn.date);

                return (
                  <tr key={txn.transaction_id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-4 py-2">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValues.name ?? txn._name}
                          onChange={(e) => setEditValues(v => ({ ...v, name: e.target.value }))}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : txn._name}
                    </td>
                    <td className="px-4 py-2">
                      {isEditing ? (
                        <input
                          type="date"
                          value={editValues.date ?? originalYMD}
                          min={originalYMD}                 // only allow same day or later
                          max={todayYMD()}                  // not in the future
                          onChange={(e) => {
                            const clamped = clampYMD(e.target.value, { minYMD: originalYMD, maxYMD: todayYMD() });
                            setEditValues(v => ({ ...v, date: clamped }));
                          }}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : (txn._date ? txn._date.toLocaleDateString() : (txn.date ?? ''))}
                    </td>
                    <td className="px-4 py-2">
                      {isEditing ? (
                        <select
                          value={editValues.category_id ?? txn.category_id ?? ''}
                          onChange={(e) => setEditValues(v => ({ ...v, category_id: e.target.value }))}
                          className="border rounded px-2 py-1 w-full"
                        >
                          <option value="">Uncategorized</option>
                          {categories.map((cat) => (
                            <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                          ))}
                        </select>
                      ) : txn._categoryLabel || 'Uncategorized'}
                    </td>
                    <td className={`px-4 py-2 font-semibold ${amountColor}`}>
                      {isEditing ? (
                        <input
                          type="number"
                          value={String(editValues.amount ?? txn._amount)}
                          onChange={(e) => setEditValues(v => ({ ...v, amount: e.target.value }))}
                          className="border rounded px-2 py-1 w-full"
                          step="0.01"
                          min="0"
                          inputMode="decimal"
                        />
                      ) : (
                        <>
                          {amountSign} {txn.amount.replace(/[+-]/g, '')}
                        </>
                      )}
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      {isEditing ? (
                        <>
                          <button
                            className="text-green-600 hover:underline text-sm"
                            onClick={() => saveEdit(txn)}
                            disabled={busy}
                          >Save</button>
                          <button
                            className="text-gray-500 hover:underline text-sm"
                            onClick={() => { setEditTransactionId(null); setEditValues({}); }}
                            disabled={busy}
                          >Cancel</button>
                        </>
                      ) : (
                        <>
                          <button
                            className="text-blue-500 hover:text-blue-600 text-sm"
                            onClick={() => {
                              setEditTransactionId(txn.transaction_id);
                              setEditValues({
                                name: txn._name,
                                date: originalYMD,
                                category_id: txn.category_id ?? '',
                                amount: String(txn._amount),
                              });
                            }}
                          ><FaEdit /></button>
                          <button
                            className="text-red-500 hover:text-red-600 text-sm"
                            onClick={() => showDelete(txn.transaction_id)}
                          ><FaTrash /></button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add modal */}
      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddTransaction}
        activeAccount={account}
      />
    </div>
  );
};

export default RecentTransactionsTable;

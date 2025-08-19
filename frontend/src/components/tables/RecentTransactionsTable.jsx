import React, { useState, useEffect, useRef, useLayoutEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { FaTrash, FaEdit, FaPlus, FaChevronDown } from 'react-icons/fa';
import AddTransactionModal from '../modals/AddTransactionModal';

const CustomDropdown = ({ 
  value, 
  onChange, 
  options, 
  placeholder = 'Select',
  disabled = false,
  loading = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [menuStyle, setMenuStyle] = useState({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useLayoutEffect(() => {
    if (!isOpen || !buttonRef.current) return;

    const calculatePosition = () => {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const maxHeight = Math.min(320, window.innerHeight - buttonRect.bottom - 16);
      
      setMenuStyle({
        position: 'fixed',
        top: buttonRect.bottom + 4,
        left: buttonRect.left,
        width: buttonRect.width,
        maxHeight: `${maxHeight}px`,
        zIndex: 1000,
      });
    };

    calculatePosition();
    window.addEventListener('resize', calculatePosition);
    window.addEventListener('scroll', calculatePosition, true);

    return () => {
      window.removeEventListener('resize', calculatePosition);
      window.removeEventListener('scroll', calculatePosition, true);
    };
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => Math.min(prev + 1, options.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (options[highlightedIndex]) {
          onChange(options[highlightedIndex].value);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const handleOptionClick = (value) => {
    onChange(value);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        className={`flex items-center justify-between w-full px-4 py-1 rounded-full text-sm border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled || loading}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate">
          {loading ? 'Loading...' : (selectedOption?.label || placeholder)}
        </span>
        {!disabled && !loading && (
          <FaChevronDown className={`ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      {isOpen && createPortal(
        <div
          className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg overflow-y-auto"
          style={menuStyle}
          role="listbox"
          onWheel={(e) => e.stopPropagation()}
        >
          <div style={{ overscrollBehavior: 'contain' }}>
            {options.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                No options available
              </div>
            ) : (
              options.map((option, index) => (
                <div
                  key={option.value}
                  className={`px-4 py-2 text-sm cursor-pointer ${highlightedIndex === index ? 'bg-gray-100 dark:bg-gray-700' : ''} ${value === option.value ? 'font-medium text-[#1b5e20] dark:text-green-300' : 'text-gray-800 dark:text-gray-200'}`}
                  onClick={() => handleOptionClick(option.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  role="option"
                  aria-selected={value === option.value}
                >
                  {option.label}
                </div>
              ))
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

const RecentTransactionsTable = ({ account, transactions = [], heading, onAdd, onEdit, onDelete, onRefresh }) => {
  const isAccountView = Boolean(account);
  const [sortBy, setSortBy] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [editTransactionId, setEditTransactionId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    index: null,
    transaction: null
  });

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/transactions/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        if (data.status === 'success') setCategories(data.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
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

  const toTitleCase = (str) => str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const filteredSortedTransactions = useMemo(() => {
    let filtered = [...transactions];
    if (categoryFilter) filtered = filtered.filter(txn => txn.category === categoryFilter);
    if (typeFilter) filtered = filtered.filter(txn => txn.transaction_type === typeFilter);
    if (dateFilter) {
      const today = new Date();
      filtered = filtered.filter(txn => {
        const txnDate = new Date(txn.date);
        const diffInDays = (today - txnDate) / (1000 * 60 * 60 * 24);
        if (dateFilter === '7 Days') return diffInDays <= 7;
        if (dateFilter === '10 Days') return diffInDays <= 10;
        if (dateFilter === 'Last Month') {
          const txnMonth = txnDate.getMonth();
          const txnYear = txnDate.getFullYear();
          const lastMonth = new Date();
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          return txnMonth === lastMonth.getMonth() && txnYear === lastMonth.getFullYear();
        }
        return true;
      });
    }
    if (sortBy === 'Name') filtered.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'AmountAsc') filtered.sort((a, b) => parseFloat(a.amount.replace(/[^\d.-]/g, '')) - parseFloat(b.amount.replace(/[^\d.-]/g, '')));
    else if (sortBy === 'AmountDsc') filtered.sort((a, b) => parseFloat(b.amount.replace(/[^\d.-]/g, '')) - parseFloat(a.amount.replace(/[^\d.-]/g, '')));
    else if (sortBy === 'Date') filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    return filtered;
  }, [transactions, sortBy, categoryFilter, dateFilter, typeFilter]);
  
  const handleAddTransaction = async (newTransaction) => {
    try {
      setError('');
      await onAdd(newTransaction);
      if (onRefresh) await onRefresh(account?.account_id);
    } catch (err) {
      setError('Failed to add transaction');
      console.error('Error adding transaction:', err);
    }
  };

  const handleEditTransaction = async (index, updatedTransaction) => {
    try {
      setError('');
      await onEdit(index, updatedTransaction);
      if (onRefresh) await onRefresh(account?.account_id);
    } catch (err) {
      setError('Failed to update transaction');
      console.error('Error updating transaction:', err);
    }
  };

  const showDeleteConfirmation = (index) => {
    setDeleteConfirmation({
      show: true,
      index,
      transaction: transactions[index]
    });
  };

  const hideDeleteConfirmation = () => {
    setDeleteConfirmation({
      show: false,
      index: null,
      transaction: null
    });
  };

  const handleDeleteTransaction = async () => {
    const { index, transaction } = deleteConfirmation;
    
    if (!transaction.transaction_id) {
      setError('Cannot delete transaction: missing transaction ID');
      hideDeleteConfirmation();
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:5000/api/transactions/${transaction.transaction_id}`, { 
        method: 'DELETE' 
      });
      if (!response.ok) throw new Error((await response.json()).message || 'Failed to delete transaction');
      onDelete(index);
      if (onRefresh) await onRefresh(account?.account_id);
    } catch (err) {
      setError(err.message || 'Failed to delete transaction');
      console.error('Error deleting transaction:', err);
    } finally {
      setLoading(false);
      hideDeleteConfirmation();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md px-6 py-6">
      {deleteConfirmation.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={hideDeleteConfirmation}
          />
          <div 
            className="relative z-10 w-[92%] max-w-md rounded-2xl bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                <FaTrash />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Delete transaction?
              </h3>
            </div>

            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
              You're about to delete a transaction of{' '}
              <span className="font-semibold">
                {deleteConfirmation.transaction.amount}
              </span>{' '}
              for <span className="font-semibold">{deleteConfirmation.transaction.name}</span>.
              This action cannot be undone.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 justify-end">
              <button
                onClick={hideDeleteConfirmation}
                className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTransaction}
                disabled={loading}
                className={`px-4 py-2 rounded-full text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-red-400
                  ${loading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
              >
                {loading ? 'Deleting...' : 'Yes, delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#336699]">{heading}</h2>
        {(
          <div className="flex gap-2 items-center">
            <CustomDropdown
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: '', label: 'Sort by' },
                { value: 'Name', label: 'Name' },
                { value: 'AmountAsc', label: 'Amount Asc' },
                { value: 'AmountDsc', label: 'Amount Dsc' },
                { value: 'Date', label: 'Date' }
              ]}
              placeholder="Sort by"
            />

            <CustomDropdown
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={[
                { value: '', label: 'Filter by categories' },
                ...categories.map(cat => ({
                  value: cat.category_name,
                  label: toTitleCase(cat.category_name)
                }))
              ]}
              placeholder="Filter by categories"
              disabled={categoriesLoading}
              loading={categoriesLoading}
            />
            
            <CustomDropdown
              value={dateFilter}
              onChange={setDateFilter}
              options={[
                { value: '', label: 'Filter by date' },
                { value: '7 Days', label: 'Last 7 Days' },
                { value: '10 Days', label: 'Last 10 Days' },
                { value: 'Last Month', label: 'Last Month' }
              ]}
              placeholder="Filter by date"
            />
            
            <CustomDropdown
              value={typeFilter}
              onChange={setTypeFilter}
              options={[
                { value: '', label: 'Filter by type' },
                { value: 'income', label: 'Income' },
                { value: 'expense', label: 'Expense' },
                { value: 'deposit', label: 'Deposit' },
                { value: 'withdrawal', label: 'Withdrawal' },
                { value: 'fee', label: 'Fee' },
                { value: 'transfer', label: 'Transfer' }
              ]}
              placeholder="Filter by type"
            />

            {isAccountView && (
              <button
                onClick={() => setShowAddModal(true)}
                disabled={!account || loading}
                className="flex items-center gap-2 px-4 py-1 bg-[#D8F5C5] dark:bg-[#AAD977] dark:text-white text-[#76B947] text-sm font-medium rounded-full hover:bg-[#c8ecb4] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaPlus /> Add
              </button>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded p-3 mb-4 text-red-700 dark:text-red-300 text-sm">
          {error}
          <button onClick={() => setError('')} className="ml-2 text-red-500 dark:text-red-300 hover:text-red-700 dark:hover:text-red-400">×</button>
        </div>
      )}

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
              filteredSortedTransactions.map((txn, idx) => {
                const isEditing = editTransactionId === txn.transaction_id;
                const isExpense = ['expense', 'withdrawal', 'fee'].includes(txn.transaction_type);
                const isIncome = ['income', 'deposit'].includes(txn.transaction_type);
                const isTransfer = ['transfer'].includes(txn.transaction_type);

                const amountColor = isExpense ? 'text-red-500'
                  : isIncome ? 'text-lime-600'
                    : isTransfer ? 'text-sky-500'
                      : '';

                const amountSign = isExpense ? '-'
                  : isIncome ? '+'
                    : isTransfer ? '→'
                      : '';

                return (
                  <tr key={txn.transaction_id || idx} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editValues.name}
                          onChange={(e) => setEditValues({ ...editValues, name: e.target.value })}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : txn.name}
                    </td>
                    <td className="px-4 py-2">
                      {isEditing ? (
                        <input
                          type="date"
                          value={editValues.date}
                          onChange={(e) => setEditValues({ ...editValues, date: e.target.value })}
                          className="border rounded px-2 py-1 w-full"
                        />
                      ) : txn.date}
                    </td>
                    <td className="px-4 py-2">
                      {isEditing ? (
                        <select
                          value={editValues.category}
                          onChange={(e) => setEditValues({ ...editValues, category: e.target.value })}
                          className="border rounded px-2 py-1 w-full"
                        >
                          {categories.map((cat) => (
                            <option key={cat.category_id} value={cat.category_name}>{cat.category_name}</option>
                          ))}
                        </select>
                      ) : toTitleCase(txn.category)}
                    </td>
                    <td className={`px-4 py-2 font-semibold ${amountColor}`}>
                      {isEditing ? (
                        <input
                          type="number"
                          value={editValues.amount.replace(/[^\d.-]/g, '')}
                          onChange={(e) => setEditValues({ ...editValues, amount: e.target.value })}
                          className="border rounded px-2 py-1 w-full"
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
                            onClick={() => {
                              handleEditTransaction(idx, {
                                ...txn,
                                name: editValues.name,
                                date: editValues.date,
                                category: editValues.category,
                                amount: editValues.amount
                              });
                              setEditTransactionId(null);
                            }}
                          >Save</button>
                          <button
                            className="text-gray-500 hover:underline text-sm"
                            onClick={() => setEditTransactionId(null)}
                          >Cancel</button>
                        </>
                      ) : (
                        <>
                          <button
                            className="text-blue-500 hover:text-blue-600 text-sm"
                            onClick={() => {
                              setEditTransactionId(txn.transaction_id);
                              setEditValues({
                                name: txn.name,
                                date: txn.date.split('/').reverse().join('-'),
                                category: txn.category,
                                amount: txn.amount.replace(/[^\d.-]/g, '')
                              });
                            }}
                          ><FaEdit /></button>
                          <button
                            className="text-red-500 hover:text-red-600 text-sm"
                            onClick={() => showDeleteConfirmation(idx)}
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

      {loading && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#336699] dark:border-blue-400"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">Processing...</span>
        </div>
      )}

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
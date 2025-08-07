import React, { useState, useMemo, useEffect } from 'react';
import { FaTrash, FaEdit, FaPlus, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import AddTransactionModal from '../modals/AddTransactionModal';

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
        // Fallback categories if API fails
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

  const handleDeleteTransaction = async (index) => {
    const transaction = transactions[index];
    if (!transaction.transaction_id) {
      setError('Cannot delete transaction: missing transaction ID');
      return;
    }

  
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:5000/api/transactions/${transaction.transaction_id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error((await response.json()).message || 'Failed to delete transaction');
      onDelete(index);
      if (onRefresh) await onRefresh(account?.account_id);
    } catch (err) {
      setError(err.message || 'Failed to delete transaction');
      console.error('Error deleting transaction:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md px-6 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#336699]">{heading}</h2>
        {(
          <div className="flex gap-2 items-center">
            <select 
              className="border dark:border-gray-600 px-4 py-1 rounded-full text-sm dark:bg-gray-700 dark:text-gray-300" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Sort by</option>
              <option value="Name">Name</option>
              <option value="AmountAsc">Amount Asc</option>
              <option value="AmountDsc">Amount Dsc</option>
              <option value="Date">Date</option>
            </select>

            <select 
              className="border dark:border-gray-600 px-4 py-1 rounded-full text-sm dark:bg-gray-700 dark:text-gray-300" 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              disabled={categoriesLoading}
            >
              <option value="">
                {categoriesLoading ? 'Loading categories...' : 'Filter by categories'}
              </option>
              {categories.map(category => (
                <option key={category.category_id} value={category.category_name}>{toTitleCase(category.category_name)}</option>
              ))}
            </select>
            <select 
              className="border dark:border-gray-600 px-4 py-1 rounded-full text-sm dark:bg-gray-700 dark:text-gray-300" 
              value={dateFilter} 
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="">Filter by date</option>
              <option value="7 Days">Last 7 Days</option>
              <option value="10 Days">Last 10 Days</option>
              <option value="Last Month">Last Month</option>
            </select>
            <select className="border px-4 py-1 rounded-full text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="">Filter by type</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="fee">Fee</option>
              <option value="transfer">Transfer</option>
            </select>
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
                // Determine color and sign based on transaction type
                // Determine color and sign based on transaction type
                const isExpense = ['expense', 'withdrawal', 'fee'].includes(txn.transaction_type);
                const isIncome = ['income', 'deposit'].includes(txn.transaction_type);
                const isTransfer = txn.transaction_type === 'Transfer';

                const amountColor = isExpense ? 'text-red-500'
                  : isIncome ? 'text-lime-600'
                    : isTransfer ? 'text-blue-500'
                      : '';

                const amountSign = isExpense ? '-'
                  : isIncome ? '+'
                    : isTransfer ? '→'
                      : '';

                // In your JSX:
                <td className={`px-4 py-2 font-semibold ${amountColor}`}>
                  {amountSign} {txn.amount.replace(/[+-]/g, '')}
                </td>

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
                          {amountSign} {isTransfer ? '' : txn.amount.replace(/[+-]/g, '')}
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
                            onClick={() => handleDeleteTransaction(idx)}
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

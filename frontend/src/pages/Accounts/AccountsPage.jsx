import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight, FaPlus, FaSearch } from 'react-icons/fa';
import AccountCard from '../../components/cards/AccountCard';
import AddAccountModal from '../../components/modals/AddAccountModal';
import EditAccountModal from '../../components/modals/EditAccountModal';
import RecentTransactionsTable from '../../components/tables/RecentTransactionsTable';

const AccountsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAccountIndex, setSelectedAccountIndex] = useState(null);
  const [activeAccount, setActiveAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [error, setError] = useState(null);
  const transactionsRef = useRef(null);

  // Transaction pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(10);

  // Account pagination
  const [currentAccountPage, setCurrentAccountPage] = useState(1);
  const [accountsPerPage] = useState(2);

  // Get current accounts
  const indexOfLastAccount = currentAccountPage * accountsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
  const currentAccounts = accounts.slice(indexOfFirstAccount, indexOfLastAccount);

  // Get current transactions
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  // Change account page
  const paginateAccounts = (pageNumber) => {
    setCurrentAccountPage(pageNumber);
    setCurrentPage(1);
  };

  // Change transaction page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = userData?.id || null;

  // Helper function to get category name by ID
  const getCategoryName = (categoryId, customCategoryId) => {
    if (customCategoryId) {
      return `Custom Category ${customCategoryId}`;
    }

    if (categoryId) {
      const category = categories.find(cat => cat.category_id === categoryId);
      return category ? category.category_name : 'Unknown Category';
    }

    return 'Uncategorized';
  };

  // Fetch all user transactions
  const fetchAllUserTransactions = useCallback(async () => {
    if (!userId) {
      setTransactions([]);
      return;
    }

    try {
      setLoadingTransactions(true);
      setError(null);

      const res = await fetch(`http://localhost:5000/api/transactions/user/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch user transactions');

      const data = await res.json();
      const mapped = (data.data || []).map(txn => ({
        name: txn.transaction_name,
        date: new Date(txn.transaction_date).toLocaleDateString(),
        category: txn.category_name || 'Uncategorized',
        amount: `${txn.transaction_amount >= 0 ? '' : '-'}${txn.transaction_amount >= 0 ? 'ZAR' : 'ZAR'}${Math.abs(txn.transaction_amount).toFixed(2)}`,
        account_id: txn.account_id,
        account_name: txn.account_name,
        transaction_id: txn.transaction_id,
        transaction_type: txn.transaction_type,
        original_amount: txn.transaction_amount,
        category_id: txn.category_id,
        custom_category_id: txn.custom_category_id,
      }));

      setTransactions(mapped);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setTransactions([]);
    } finally {
      setLoadingTransactions(false);
    }
  }, [userId]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/transactions/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data.data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch accounts and transactions on mount
  useEffect(() => {
    if (!userId) {
      setError('User not logged in. Please log in again.');
      setLoading(false);
      return;
    }

    const fetchAccountsAndTransactions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch accounts
        const accountsResponse = await fetch(`http://localhost:5000/api/accounts/user/${userId}`);
        if (!accountsResponse.ok) throw new Error('Failed to fetch accounts');
        const accountsData = await accountsResponse.json();
        setAccounts(accountsData.data || []);

        // Fetch transactions
        await fetchAllUserTransactions();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountsAndTransactions();
  }, [userId, fetchAllUserTransactions]);

  // Fetch transactions for specific account
  const fetchTransactionsForAccount = async (accountId) => {
    if (!accountId) {
      await fetchAllUserTransactions();
      return;
    }

    try {
      setLoadingTransactions(true);
      setError(null);

      const res = await fetch(`http://localhost:5000/api/transactions/accounts/${accountId}`);
      if (!res.ok) throw new Error('Failed to fetch transactions');

      const data = await res.json();
      const mapped = (data.data || []).map(txn => ({
        name: txn.transaction_name,
        date: new Date(txn.transaction_date).toLocaleDateString(),
        category: getCategoryName(txn.category_id, txn.custom_category_id),
        amount: `${txn.transaction_amount >= 0 ? '' : '-'}${activeAccount?.currency + ' ' || 'ZAR'}${Math.abs(txn.transaction_amount).toFixed(2)}`,
        account_id: txn.account_id,
        transaction_id: txn.transaction_id,
        transaction_type: txn.transaction_type,
        original_amount: txn.transaction_amount,
        category_id: txn.category_id,
        custom_category_id: txn.custom_category_id,
        amountColor: (txn.transaction_type === 'income' || txn.transaction_type === 'transfer' || txn.transaction_type === 'deposit') ? 'bg-green-400' : (txn.transaction_type === 'expense' || txn.transaction_type === 'withdrawal' || txn.transaction_type === 'fee') ? 'bg-red-400' : 'bg-gray-400',
      }));

      setTransactions(mapped);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setTransactions([]);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const handleCardClick = (account) => {
    setActiveAccount(account);
    if (account.account_id) {
      fetchTransactionsForAccount(account.account_id);
    }
    setTimeout(() => {
      transactionsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Account CRUD operations
  const handleAddAccount = async (newAccount) => {
    if (!userId) {
      setError('User not logged in. Please log in again.');
      return;
    }
    try {
      setError(null);
      const response = await fetch('http://localhost:5000/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          bank_name: newAccount.bankName,
          account_name: newAccount.accountName,
          account_type: newAccount.accountType,
          currency: newAccount.currency,
          account_balance: parseFloat(newAccount.balance) || 0,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create account');
      }
      const data = await response.json();
      const newAccountWithId = { ...newAccount, account_id: data.data.account_id, user_id: userId };
      setAccounts((prev) => [...prev, newAccountWithId]);
      setCurrentAccountPage(Math.ceil((accounts.length + 1) / accountsPerPage));
      setShowModal(false);
    } catch (err) {
      setError(err.message);
      console.error('Error creating account:', err);
    }
  };

  const handleDeleteAccount = async (indexToDelete) => {
    const accountToDelete = accounts[indexToDelete];
    const accountId = accountToDelete?.account_id;
    if (!accountId || !userId) {
      setError('Cannot delete account: missing account ID or user ID');
      return;
    }
    try {
      setError(null);
      const response = await fetch(`http://localhost:5000/api/accounts/${accountId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete account');
      }
      setAccounts((prev) => prev.filter((_, index) => index !== indexToDelete));
      setCurrentAccountPage(1);
      if (activeAccount?.account_id === accountId) {
        setActiveAccount(null);
        setTransactions([]);
      }
      if (indexToDelete === selectedAccountIndex) {
        setSelectedAccountIndex(null);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error deleting account:', err);
    }
  };

  const handleEditAccount = (index) => {
    setSelectedAccountIndex(index);
    setShowEditModal(true);
  };

  const handleUpdateAccount = async (updatedAccount) => {
    if (selectedAccountIndex === null || !userId) return;
    const accountToUpdate = accounts[selectedAccountIndex];
    const accountId = accountToUpdate?.account_id;
    if (!accountId) {
      setError('Cannot update account: missing account ID');
      return;
    }
    try {
      setError(null);
      const response = await fetch(`http://localhost:5000/api/accounts/${accountId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account_name: updatedAccount.accountName }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update account');
      }
      setAccounts((prev) => {
        const updated = [...prev];
        updated[selectedAccountIndex] = { ...prev[selectedAccountIndex], ...updatedAccount };
        return updated;
      });
      if (activeAccount?.account_id === accountId) {
        setActiveAccount((prev) => ({ ...prev, ...updatedAccount }));
      }
      setShowEditModal(false);
      setSelectedAccountIndex(null);
    } catch (err) {
      setError(err.message);
      console.error('Error updating account:', err);
    }
  };

  // Transaction operations
  const handleRefreshTransactions = async (accountId) => {
    if (accountId && activeAccount?.account_id === accountId) {
      await fetchTransactionsForAccount(accountId);
    } else {
      await fetchAllUserTransactions();
    }
  };

  const handleAddTransaction = async (newTransaction) => {
    if (activeAccount?.account_id) {
      await fetchTransactionsForAccount(activeAccount.account_id);
    } else {
      await fetchAllUserTransactions();
    }
  };

  const handleEditTransaction = async (index, updatedTransaction) => {
    if (activeAccount?.account_id) {
      await fetchTransactionsForAccount(activeAccount.account_id);
    } else {
      await fetchAllUserTransactions();
    }
  };

  const handleDeleteTransaction = async (index) => {
    if (activeAccount?.account_id) {
      await fetchTransactionsForAccount(activeAccount.account_id);
    } else {
      await fetchAllUserTransactions();
    }
  };

  const transactionHeading = activeAccount
    ? `${activeAccount.account_name || activeAccount.accountName} Transactions`
    : 'Recent Transactions';

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4 flex justify-center items-center min-h-[400px] dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#336699] dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 px-6 py-6 bg-[#F8F9FA] min-h-screen dark:bg-gray-900">
      {/* Left Panel */}
      <div className="w-[360px] flex-shrink-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-[#1C3C78] dark:text-blue-300">Accounts</h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1 px-4 py-1 bg-[#D8F5C5] dark:bg-[#A1E358] text-[#467D35] dark:text-green-100 text-sm font-semibold rounded-full hover:bg-[#c8ecb4] dark:hover:bg-green-700 transition-colors"
          >
            <FaPlus /> Add
          </button>
        </div>

        {/* Render currentAccounts */}
        <div className="space-y-4">
          {currentAccounts.map((acc, idx) => (
            <AccountCard
              key={acc.account_id || idx}
              bank={acc.bank_name}
              accountName={acc.account_name}
              type={acc.account_type}
              available={acc.account_balance}
              balance={acc.balance || '0.00'}
              currency={acc.currency || 'ZAR'}
              isActive={activeAccount?.account_id === acc.account_id}
              onClick={() => handleCardClick(acc)}
              onDelete={() => handleDeleteAccount(
                indexOfFirstAccount + idx
              )}
              onEdit={() => handleEditAccount(
                indexOfFirstAccount + idx
              )}
            />
          ))}
        </div>

        {/* Account Pagination Controls */}
        {accounts.length > accountsPerPage && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => paginateAccounts(Math.max(1, currentAccountPage - 1))}
              disabled={currentAccountPage === 1}
              className="flex items-center gap-1 px-3 py-1 text-sm text-[#1C3C78] dark:text-blue-300 disabled:opacity-50"
            >
              <FaChevronLeft /> Previous
            </button>

            <span className="text-sm text-gray-600 dark:text-gray-300">
              Page {currentAccountPage} of {Math.ceil(accounts.length / accountsPerPage)}
            </span>

            <button
              onClick={() => paginateAccounts(currentAccountPage + 1)}
              disabled={currentAccountPage === Math.ceil(accounts.length / accountsPerPage)}
              className="flex items-center gap-1 px-3 py-1 text-sm text-[#1C3C78] dark:text-blue-300 disabled:opacity-50"
            >
              Next <FaChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* Right Panel */}
      <div className="flex-1 space-y-6">
        {/* Search */}
        <div className="flex items-center w-full px-4 py-2 border border-[#76B947] dark:border-green-600 rounded-full bg-white dark:bg-gray-800 shadow-sm">
          <FaSearch className="text-[#76B947] dark:text-green-400 mr-2" />
          <input
            type="text"
            placeholder="Search your transactions..."
            className="w-full outline-none bg-transparent text-sm text-[#76B947] dark:text-green-200 placeholder-[#76B947]/70 dark:placeholder-green-400/70"
          />
        </div>

        {/* Transactions */}
        <div ref={transactionsRef}>
          <RecentTransactionsTable
            account={activeAccount}
            transactions={currentTransactions}
            heading={transactionHeading}
            loading={loadingTransactions}
            categories={categories}
            onAdd={handleAddTransaction}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
            onRefresh={handleRefreshTransactions}
          />
        </div>

        {/* Transaction Pagination */}
        {transactions.length > transactionsPerPage && (
          <div className="flex justify-center mt-4">
            {Array.from({ length: Math.ceil(transactions.length / transactionsPerPage) }).map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === index + 1 
                    ? 'bg-[#B1E1FF] dark:bg-blue-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddAccountModal isOpen={showModal} onClose={() => setShowModal(false)} onAdd={handleAddAccount} />
      <EditAccountModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedAccountIndex(null);
        }}
        initialData={selectedAccountIndex !== null ? accounts[selectedAccountIndex] : null}
        onSave={handleUpdateAccount}
      />
    </div>
  );
};

export default AccountsPage;
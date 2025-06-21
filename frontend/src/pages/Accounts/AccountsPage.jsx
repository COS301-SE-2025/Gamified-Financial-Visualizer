import React, { useState, useEffect, useRef } from 'react';
import { FaPlus } from 'react-icons/fa';
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
  const [loading, setLoading] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [error, setError] = useState(null);
  const transactionsRef = useRef(null);

  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = userData?.id || null;

  useEffect(() => {
    if (!userId) {
      setError('User not logged in. Please log in again.');
      setLoading(false);
      return;
    }

    const fetchAccounts = async () => {
      try {
        setLoading(true);
        setError(null);
        const accountsResponse = await fetch(`http://localhost:5000/api/accounts/user/${userId}`);
        if (!accountsResponse.ok) throw new Error('Failed to fetch accounts');
        const accountsData = await accountsResponse.json();
        setAccounts(accountsData.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [userId]);

const fetchTransactionsForAccount = async (accountId) => {
  if (!accountId) {
    setTransactions([]);
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
      category: txn.category || 'Uncategorized',
      amount: `${txn.transaction_amount >= 0 ? '' : '-'}${activeAccount?.currency || 'ZAR'}${Math.abs(txn.transaction_amount).toFixed(2)}`,
      account_id: txn.account_id,
      transaction_id: txn.transaction_id,
    }));

    setTransactions(mapped);
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

  const handleEditTransaction = (index, updatedTxn) => {
    setTransactions((prev) => {
      const updated = [...prev];
      updated[index] = updatedTxn;
      return updated;
    });
  };

  const handleDeleteTransaction = (index) => {
    setTransactions((prev) => prev.filter((_, i) => i !== index));
  };

  const filteredTransactions = activeAccount ? transactions : [];

  const transactionHeading = activeAccount
    ? `${activeAccount.accountName} Transactions`
    : 'Recent Transactions';

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#336699] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-8 -ml-[10px]">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex">
            <div className="text-red-400">⚠️</div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-sm text-red-600 hover:text-red-500"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-3xl shadow-md px-6 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#336699]">Accounts</h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-1 bg-[#D8F5C5] text-[#467D35] text-sm font-medium rounded-full hover:bg-[#c8ecb4] transition"
          >
            <FaPlus /> Add
          </button>
        </div>

        {accounts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No accounts found</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-[#336699] text-white rounded-lg hover:bg-[#2a5278] transition"
            >
              Add Your First Account
            </button>
          </div>
        ) : (
          <div className="flex space-x-6 px-1 overflow-x-auto">
            {accounts.map((acc, idx) => (
              <div className="snap-start" key={acc.account_id || idx}>
                <AccountCard
                  bank={acc.bank_name || acc.bankName}
                  accountName={acc.account_name || acc.accountName}
                  type={acc.account_type || acc.accountType}
                  available={acc.account_balance || acc.available || '0.00'}
                  balance={acc.balance || '0.00'}
                  currency={acc.currency}
                  bg={['bg-pink-300', 'bg-yellow-300', 'bg-green-300'][idx % 3]}
                  overlay={['bg-pink-400', 'bg-yellow-400', 'bg-green-400'][idx % 3]}
                  isActive={activeAccount?.account_id === acc.account_id}
                  onClick={() => handleCardClick(acc)}
                  onDelete={() => handleDeleteAccount(idx)}
                  onEdit={() => handleEditAccount(idx)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div ref={transactionsRef}>
        <RecentTransactionsTable
          account={activeAccount}
          transactions={filteredTransactions}
          heading={transactionHeading}
          loading={loadingTransactions}
          onAdd={(newTxn) => {
            const fullTxn = {
              ...newTxn,
              accountName: activeAccount?.account_name || activeAccount?.accountName || 'Unknown',
              account_id: activeAccount?.account_id,
            };
            setTransactions((prev) => [...prev, fullTxn]);
          }}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
        />
      </div>

      <AddAccountModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddAccount}
      />

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


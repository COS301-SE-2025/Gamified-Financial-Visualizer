import React, { useState, useRef } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import AccountCard from '../../components/cards/AccountCard';
import AddAccountModal from '../../components/modals/AddAccountModal';
import EditAccountModal from '../../components/modals/EditAccountModal';
import RecentTransactionsTable from '../../components/tables/RecentTransactionsTable';

const mockTransactions = [
  { name: 'Picknpay', date: '12/06/2025', category: 'Food', amount: 'R5000', accountName: 'Private Savings Account' },
  { name: 'Shell', date: '11/06/2025', category: 'Fuel', amount: 'R950', accountName: 'Private Savings Account' },
  { name: 'Uber', date: '10/06/2025', category: 'Transport', amount: 'R120', accountName: 'Capitec Account' },
  { name: 'Asterhoff', date: '10/06/2025', category: 'Entertainment', amount: 'R345', accountName: 'Capitec Account' },
];

const AccountsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAccountIndex, setSelectedAccountIndex] = useState(null);
  const [activeAccount, setActiveAccount] = useState(null);
  const [transactions, setTransactions] = useState(mockTransactions);
  const transactionsRef = useRef(null);

  const [accounts, setAccounts] = useState([
    {
      bankName: 'FNB',
      accountType: 'Savings',
      available: '10000.00',
      balance: '0.00',
      accountName: 'Private Savings Account',
      currency: 'ZAR'
    },
    {
      bankName: 'Capitec',
      accountType: 'Savings',
      available: '5000.00',
      balance: '0.00',
      accountName: 'Capitec Account',
      currency: 'ZAR'
    }
  ]);

  const handleCardClick = (account) => {
    setActiveAccount(account);
    setTimeout(() => {
      transactionsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleAddAccount = (newAccount) => {
    setAccounts((prev) => [...prev, newAccount]);
  };

  const handleDeleteAccount = (indexToDelete) => {
    setAccounts((prev) => prev.filter((_, index) => index !== indexToDelete));
    if (indexToDelete === selectedAccountIndex) setActiveAccount(null);
  };

  const handleEditAccount = (index) => {
    setSelectedAccountIndex(index);
    setShowEditModal(true);
  };

  const handleUpdateAccount = (updatedAccount) => {
    setAccounts((prev) => {
      const updated = [...prev];
      updated[selectedAccountIndex] = {
        ...prev[selectedAccountIndex],
        ...updatedAccount,
      };
      return updated;
    });
    setShowEditModal(false);
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

  const filteredTransactions = activeAccount
    ? transactions.filter(txn => txn.accountName === activeAccount.accountName)
    : transactions;

  const transactionHeading = activeAccount
    ? `${activeAccount.accountName} Transactions`
    : 'Recent Transactions';

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-8 -ml-[10px]">
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

        <div className="flex space-x-6 px-1">
          {accounts.map((acc, idx) => (
            <div className="snap-start" key={idx}>
              <AccountCard
                bank={acc.bankName}
                accountName={acc.accountName}
                type={acc.accountType}
                available={acc.available}
                balance={acc.balance}
                currency={acc.currency}
                bg={['bg-pink-300', 'bg-yellow-300', 'bg-green-300'][idx % 3]}
                overlay={['bg-pink-400', 'bg-yellow-400', 'bg-green-400'][idx % 3]}
                isActive={activeAccount?.accountName === acc.accountName}
                onClick={() => handleCardClick(acc)}
                onDelete={() => handleDeleteAccount(idx)}
                onEdit={() => handleEditAccount(idx)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center w-full max-w-9xl -ml-[8px] px-4 py-2 rounded-3xl border-2 border-[#E5794B] bg-white shadow-sm">
        <FaSearch className="text-[#E5794B] mr-2" />
        <input
          type="text"
          placeholder="Search your transactions..."
          className="w-full outline-none bg-transparent text-sm text-[#E5794B] placeholder-[#E5794B]/70"
        />
      </div>

      <div ref={transactionsRef}>
        <RecentTransactionsTable
          account={activeAccount}
          transactions={filteredTransactions}
          heading={transactionHeading}
          onAdd={(newTxn) => {
            const fullTxn = {
              ...newTxn,
              accountName: activeAccount?.accountName ?? 'Unknown',
            };
            setTransactions(prev => [...prev, fullTxn]);
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
        onClose={() => setShowEditModal(false)}
        initialData={selectedAccountIndex !== null ? accounts[selectedAccountIndex] : null}
        onSave={handleUpdateAccount}
      />
    </div>
  );
};

export default AccountsPage;

import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import AccountCard from '../../components/cards/AccountCard';
import AddAccountModal from '../../components/modals/AddAccountModal';
import EditAccountModal from '../../components/modals/EditAccountModal';
import RecentTransactionsTable from '../../components/tables/RecentTransactionsTable';

// Mock transaction data linked to accountName for demo purposes
const mockTransactions = [
  { name: 'Picknpay', date: '12/06/2025', category: 'Groceries', amount: 'R500.00', accountName: 'Private Savings Account' },
  { name: 'Shell', date: '11/06/2025', category: 'Fuel', amount: 'R950.00', accountName: 'Private Savings Account' },
  { name: 'Netflix', date: '10/06/2025', category: 'Entertainment', amount: 'R180.00', accountName: 'Other Account' },
  { name: 'Uber', date: '09/06/2025', category: 'Transport', amount: 'R120.00', accountName: 'Private Savings Account' },
  { name: 'Spotify', date: '08/06/2025', category: 'Entertainment', amount: 'R99.00', accountName: 'Other Account' }
];

const AccountsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAccountIndex, setSelectedAccountIndex] = useState(null);
  const [activeAccount, setActiveAccount] = useState(null);
  const [accounts, setAccounts] = useState([
    {
      bankName: 'FNB',
      accountType: 'Savings',
      available: '10000.00',
      balance: '0.00',
      accountName: 'Private Savings Account',
      currency: 'ZAR'
    },
  ]);

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
        available: prev[selectedAccountIndex].available,
        balance: prev[selectedAccountIndex].balance,
      };
      return updated;
    });
    setShowEditModal(false);
  };

  const handleCardClick = (account) => {
    setActiveAccount(account);
  };

  const filteredTransactions = activeAccount
    ? mockTransactions.filter(txn => txn.accountName === activeAccount.accountName)
    : mockTransactions;

  const transactionHeading = activeAccount
    ? `${activeAccount.accountName} Transactions`
    : 'Recent Transactions';

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-8">
      {/* Accounts Carousel Section */}
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

        {/* Carousel */}
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
                onClick={() => handleCardClick(acc)}
                onDelete={() => handleDeleteAccount(idx)}
                onEdit={() => handleEditAccount(idx)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      {filteredTransactions.length > 0 && (
        <RecentTransactionsTable
          account={activeAccount}
          transactions={filteredTransactions}
          heading={transactionHeading}
        />
      )}

      {/* Add Modal */}
      <AddAccountModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddAccount}
      />

      {/* Edit Modal */}
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

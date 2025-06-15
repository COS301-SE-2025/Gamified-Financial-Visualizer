import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import AccountCard from '../../components/cards/AccountCard';
import AddAccountModal from '../../components/modals/AddAccountModal';
import RecentTransactionsTable from '../../components/tables/RecentTransactionsTable';


const AccountsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [accounts, setAccounts] = useState([
    {
      bankName: 'FNB',
      accountType: 'Savings',
      available: 'R10 000.00',
      balance: 'R0.00',
      accountName: 'Private Savings Account',
      status: 'Active',
    },
  ]);

  const handleAddAccount = (newAccount) => {
    setAccounts((prev) => [...prev, newAccount]);
  };

  return (
    <div className="p-8 min-h-screen bg-[#f9f9fb]">
      <div className="bg-white border border-gray-200 rounded-3xl shadow-md px-6 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Accounts</h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-1 bg-[#D8F5C5] text-[#467D35] text-sm font-medium rounded-full hover:bg-[#c8ecb4] transition"
          >
            <FaPlus /> Add
          </button>
        </div>

        {/* ✅ Only One Map Here */}
        <div className="overflow-x-auto scroll-smooth snap-x snap-mandatory">
          <div className="flex space-x-6 px-1">
            {accounts.map((acc, idx) => (
              <div className="snap-start" key={idx}>
                <AccountCard
                  bank={acc.bankName}
                  accountName={acc.accountName}
                  type={acc.accountType}
                  available={acc.available}
                  balance={acc.balance}
                  status={acc.status}
                  bg={['bg-pink-300', 'bg-yellow-300', 'bg-green-300'][idx % 3]}
                  overlay={['bg-pink-400', 'bg-yellow-400', 'bg-green-400'][idx % 3]}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <AddAccountModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddAccount}
      />
      <RecentTransactionsTable />
    </div>
  );
};

export default AccountsPage;

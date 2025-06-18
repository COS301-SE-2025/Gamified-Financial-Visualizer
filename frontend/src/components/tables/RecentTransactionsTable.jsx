import React, { useState, useMemo } from 'react';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import AddTransactionModal from '../modals/AddTransactionModal';
import EditTransactionModal from '../modals/EditTransactionModal';

const RecentTransactionsTable = ({ account, transactions = [], heading, onAdd, onEdit, onDelete }) => {
  const isAccountView = Boolean(account);
  const [sortBy, setSortBy] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTxnIndex, setEditTxnIndex] = useState(null);
  const [editTxnData, setEditTxnData] = useState(null);

  const filteredSortedTransactions = useMemo(() => {
    let filtered = [...transactions];

    if (categoryFilter) {
      filtered = filtered.filter(txn => txn.category === categoryFilter);
    }

    if (sortBy === 'Name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortBy === 'Amount') {
      filtered.sort((a, b) => parseFloat(b.amount.replace('R', '')) - parseFloat(a.amount.replace('R', '')));
    }
    if (sortBy === 'Date') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return filtered;
  }, [transactions, sortBy, categoryFilter, dateFilter]);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-md px-6 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#336699]">{heading}</h2>

        {isAccountView && (
          <div className="flex gap-2 items-center">
            <select className="border px-4 py-1 rounded-full text-sm" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="">Sort by</option>
              <option value="Name">Name</option>
              <option value="Amount">Amount</option>
              <option value="Date">Date</option>
            </select>
            <select className="border px-4 py-1 rounded-full text-sm" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="">Filter by categories</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Fuel">Fuel</option>
              <option value="Entertainment">Entertainment</option>
            </select>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-1 bg-[#D8F5C5] text-[#467D35] text-sm font-medium rounded-full hover:bg-[#c8ecb4] transition"
            >
              <FaPlus /> Add
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="border-b">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSortedTransactions.map((txn, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{txn.name}</td>
                <td className="px-4 py-2">{txn.date}</td>
                <td className="px-4 py-2">{txn.category}</td>
                <td className="px-4 py-2">{txn.amount}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    className="text-sm text-blue-500 hover:text-blue-600"
                    onClick={() => {
                      setEditTxnIndex(idx);
                      setEditTxnData(txn);
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-sm text-red-500 hover:text-red-600"
                    onClick={() => onDelete(idx)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={(txn) => {
          onAdd(txn);
          setShowAddModal(false);
        }}
      />

      {editTxnData && (
        <EditTransactionModal
          isOpen={editTxnData !== null}
          transaction={editTxnData}    
          onSave={(updatedTxn) => {
            onEdit(editTxnIndex, updatedTxn);
            setEditTxnData(null);
            setEditTxnIndex(null);
          }}
        />
      )}
    </div>
  );
};

export default RecentTransactionsTable;

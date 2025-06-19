import React from 'react';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';

const transactions = [
  { name: 'Picknpay', date: '12/06/2025', category: 'Groceries', amount: 'R500.00' },
  { name: 'Netflix', date: '11/06/2025', category: 'Entertainment', amount: 'R180.00' },
  { name: 'Shell Garage', date: '10/06/2025', category: 'Fuel', amount: 'R950.00' },
  { name: 'Uber', date: '09/06/2025', category: 'Transport', amount: 'R120.00' },
  { name: 'Woolworths', date: '08/06/2025', category: 'Groceries', amount: 'R340.00' },
  { name: 'Spotify', date: '07/06/2025', category: 'Entertainment', amount: 'R60.00' },
  { name: 'BP Station', date: '06/06/2025', category: 'Fuel', amount: 'R750.00' },
  { name: 'Gautrain', date: '05/06/2025', category: 'Transport', amount: 'R85.00' },
];


const RecentTransactionsTable = () => {
  return (
    <div className="mt-10 bg-white border border-gray-200 rounded-3xl p-6 shadow-md overflow-x-auto">
      <h3 className="text-lg font-semibold text-[#336699] mb-4">Recent Transactions</h3>

      <table className="w-full text-left text-sm text-gray-700">
        <thead>
          <tr className="border-b">
            <th className="py-2">Name</th>
            <th className="py-2">Date</th>
            <th className="py-2">Category</th>
            <th className="py-2">Amount</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn, idx) => (
            <tr key={idx} className="border-b hover:bg-gray-50">
              <td className="py-2">{txn.name}</td>
              <td className="py-2">{txn.date}</td>
              <td className="py-2">{txn.category}</td>
              <td className="py-2">{txn.amount}</td>
              <td className="py-2">
                <div className="flex gap-3">
                  <FaTrashAlt className="text-red-400 hover:text-red-500 cursor-pointer" />
                  <FaEdit className="text-blue-400 hover:text-blue-500 cursor-pointer" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentTransactionsTable;

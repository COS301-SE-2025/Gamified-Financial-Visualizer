import React, { useState } from 'react';
import {
  FaSearch, FaPlus, FaDownload, FaLightbulb, FaMoneyCheckAlt, FaEdit, FaTrash
} from 'react-icons/fa';

const DashboardPage = () => {

    const [view, setView] = useState('transactions'); 
    const budgetItems = [
    { category: 'Groceries', limit: 9000, used: 5000 },
    { category: 'Transport', limit: 9000, used: 5000 },
    { category: 'Entertainment', limit: 9000, used: 5000 },
  ];
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-1/4 p-4 space-y-6">
        {/* Profile + Performance */}
        <div className="bg-white p-4 rounded-2xl shadow space-y-3">
          <h2 className="text-lg font-semibold text-gray-700">Overall Performance</h2>
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-blue-400 to-blue-200" />
              <div className="absolute inset-1 flex items-center justify-center bg-white rounded-full text-xl font-bold">350</div>
            </div>
            <p className="mt-2 text-sm text-gray-500">Level 3: Silver</p>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white p-4 rounded-2xl shadow space-y-2">
          <h3 className="text-sm font-semibold text-gray-600">Badges</h3>
          <div className="flex justify-between">
            <img src="/icons/badge1.png" alt="badge" className="w-10 h-10" />
            <img src="/icons/badge2.png" alt="badge" className="w-10 h-10" />
            <img src="/icons/badge3.png" alt="badge" className="w-10 h-10" />
          </div>
        </div>

        {/* Category Summary */}
        <div className="bg-white p-4 rounded-2xl shadow">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Category Summary</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              ['Groceries', 'R1000', 'bg-orange-100 text-orange-700'],
              ['Health', 'R2200', 'bg-blue-100 text-blue-700'],
              ['Fuel', 'R620.50', 'bg-red-100 text-red-700'],
              ['Entertainment', 'R500', 'bg-pink-100 text-pink-700'],
              ['Personal', 'R750', 'bg-purple-100 text-purple-700'],
              ['Transport', 'R825.23', 'bg-gray-100 text-gray-700'],
            ].map(([name, amt, style]) => (
              <div key={name} className={`rounded-xl px-2 py-1 ${style}`}>
                <p className="font-bold">{name}</p>
                <p>{amt}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="w-3/4 p-6 space-y-6">
        {/* Search and Controls */}
        <div className="flex justify-between items-center space-x-4">
          <div className="flex items-center w-full bg-white px-3 py-2 rounded-xl shadow">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full outline-none bg-transparent"
            />
          </div>
          <div className="flex space-x-2">
            <button onClick={() => setView('budget')}
              className={`px-4 py-2 border rounded-xl shadow flex items-center gap-2 ${view === 'budget' ? 'bg-green-100' : 'bg-white'}`}>
              <FaMoneyCheckAlt /> Budget
            </button>
            <button className="px-4 py-2 bg-white border rounded-xl shadow flex items-center gap-2">
              <FaLightbulb /> Insight
            </button>
            <button className="px-4 py-2 bg-white border rounded-xl shadow flex items-center gap-2">
              <FaDownload /> Import
            </button>
          </div>
        </div>

        {/* Account Cards */}
        <div className="flex overflow-x-auto space-x-4">
          {[1, 2, 3, 4].map((_, idx) => (
            <div key={idx} className="bg-white min-w-[200px] p-4 rounded-2xl shadow">
              <h4 className="text-sm font-semibold text-gray-700">FNB</h4>
              <p className="text-xs text-gray-500">Private Savings Account</p>
              <p className="text-lg font-bold text-green-600 mt-2">R10,000</p>
              <p className="text-xs text-gray-400">Savings | Active</p>
              <div className="mt-2 h-2 bg-gray-200 rounded-full">
                <div className="h-full rounded-full bg-green-400" style={{ width: `${(idx + 1) * 20}%` }} />
              </div>
            </div>
          ))}
          <button className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-xl hover:bg-green-200 transition">
            <FaPlus /> Add
          </button>
        </div>

        {/* Recent Transactions */}
        {/* Conditional Section */}
        {view === 'transactions' ? (
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Transactions</h3>
            <table className="w-full text-sm">
              <thead className="text-left text-gray-400 border-b">
                <tr>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array(5).fill(null).map((_, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td>Pick n Pay</td>
                    <td>12/06/2025</td>
                    <td>Food</td>
                    <td>R500</td>
                    <td className="flex gap-2 py-2">
                      <button className="text-blue-500 hover:underline">Edit</button>
                      <button className="text-red-500 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-700">Budget</h3>
              <button className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-xl hover:bg-green-200">
                <FaPlus className="inline-block mr-1" /> Create
              </button>
            </div>
            {budgetItems.map(({ category, limit, used }, i) => {
              const usagePercent = Math.min((used / limit) * 100, 100);
              return (
                <div key={i} className="p-4 rounded-xl bg-gray-50 shadow-inner flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <img src="/icons/budget-icon.png" alt="" className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="font-bold">{category}</p>
                        <p className="text-xs text-gray-500">Limit: {limit} | Used: {used}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-blue-100 px-3 py-1 text-blue-600 rounded-xl text-sm flex items-center gap-1">
                        <FaEdit /> Edit
                      </button>
                      <button className="bg-red-100 px-3 py-1 text-red-600 rounded-xl text-sm flex items-center gap-1">
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-red-200 rounded-full">
                    <div
                      className="h-full bg-pink-500 rounded-full"
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
};

export default DashboardPage;

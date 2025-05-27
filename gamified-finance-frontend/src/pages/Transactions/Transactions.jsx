import React, { useState, useEffect } from 'react';
import AddTransactionModal from '../../components/AddTransactionModal';
import SetBudgetModal from '../../components/SetBudgetModal';
import EditTransactionModal from '../../components/EditTransactionModal';
import { useLocation } from 'react-router-dom';
import badge1 from '../../assets/Images/awardIcon.png';
import badge2 from '../../assets/Images/CoinStack.png';
import badge3 from '../../assets/Images/highFiveIcon.png';
import badge4 from '../../assets/Images/notesIcon.png';

import { FaUtensils, FaBus, FaBolt, FaFilm, FaHeartbeat, FaPlane, FaBook, FaLaptop, FaUser, FaHandsHelping, FaTshirt, FaDumbbell, FaMobileAlt, FaWifi, FaTv, FaHome, FaCar, FaShieldAlt, FaCalendarAlt } from 'react-icons/fa'

const getLimitForCategory = (categoryId) => {
  const limits = {
    1: 9000,
    2: 8000,
    3: 6000,
    4: 7000,
    5: 5000,
    6: 4000,
    7: 10000,
    8: 11000,
    9: 2500,
    10: 3000,
    11: 2000,
    12: 1200,
    13: 800,
    14: 600,
    15: 9000,
    16: 5000,
    17: 4500,
    18: 3500,
    19: 12000,
    20: 8000,
  };
  return limits[categoryId] || 0;
};
console.log(getLimitForCategory(1)); // Example usage, should return 9000
const fetchUserId = async (username) => {
  try {
    const res = await fetch(`http://localhost:5000/api/auth/user-id/${username}`);
    const data = await res.json();
    return data.data.user_id;
  } catch (err) {
    console.error('Failed to fetch user ID:', err);
    return null;
  }
};
console.log(fetchUserId('testuser')); // Example usage, should return user ID or null
const DashboardPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('All Transactions');
  const [showSetBudget, setShowSetBudget] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const [budgetData, setBudgetData] = useState([]);
  const badgeImages = [badge1, badge2, badge3, badge4];
  const [categories, setCategories] = useState([]);
  const location = useLocation();
  const [transactions, setTransactions] = useState([
    { name: 'Groceries - Checkers', category: 'Food', amount: 'R320', date: '2025-05-20', account: 'Capitec Main' },
    { name: 'Uber Ride', category: 'Transport', amount: 'R120', date: '2025-05-21', account: 'FNB Everyday' },
    { name: 'Electricity Bill', category: 'Utilities', amount: 'R450', date: '2025-05-18', account: 'TymeBank GoalSave' },
    { name: 'Netflix', category: 'Entertainment', amount: 'R199', date: '2025-05-15', account: 'Capitec Main' },
    { name: 'Doctor Visit', category: 'Health', amount: 'R600', date: '2025-05-22', account: 'Discovery Card' },
    { name: 'Flight Ticket', category: 'Travel', amount: 'R2400', date: '2025-05-10', account: 'FNB Platinum' },
    { name: 'KFC Dinner', category: 'Food', amount: 'R270', date: '2025-05-17', account: 'Nedbank JustInvest' },
    { name: 'Gym Membership', category: 'Health', amount: 'R300', date: '2025-05-01', account: 'Capitec Main' },
    { name: 'Petrol', category: 'Transport', amount: 'R800', date: '2025-05-19', account: 'Absa Transact' },
    { name: 'Internet Bill', category: 'Utilities', amount: 'R699', date: '2025-05-16', account: 'MTN Wallet' },
    { name: 'School Books', category: 'Education', amount: 'R1500', date: '2025-05-12', account: 'TymeBank GoalSave' },
    { name: 'Laptop Repair', category: 'Tech', amount: 'R950', date: '2025-05-08', account: 'Capitec Main' },
    { name: 'Concert Tickets', category: 'Entertainment', amount: 'R1100', date: '2025-05-09', account: 'Standard Bank Elite' },
    { name: 'Taxi', category: 'Transport', amount: 'R60', date: '2025-05-22', account: 'FNB Everyday' },
    { name: 'Toiletries', category: 'Personal', amount: 'R180', date: '2025-05-18', account: 'Capitec Main' },
    { name: 'MTN Data', category: 'Utilities', amount: 'R99', date: '2025-05-13', account: 'MTN Wallet' },
    { name: 'Pizza Night', category: 'Food', amount: 'R290', date: '2025-05-14', account: 'Nedbank JustInvest' },
    { name: 'Birthday Gift', category: 'Personal', amount: 'R500', date: '2025-05-11', account: 'TymeBank GoalSave' },
    { name: 'Train Pass', category: 'Transport', amount: 'R350', date: '2025-05-04', account: 'Absa Transact' },
    { name: 'Donation', category: 'Giving', amount: 'R1000', date: '2025-05-03', account: 'Capitec Main' },
    { name: 'Takealot Order', category: 'Tech', amount: 'R2200', date: '2025-05-07', account: 'Standard Bank Elite' },
  ]);

  const categoryIcons = {
    Food: <FaUtensils />, Transport: <FaBus />, Utilities: <FaBolt />, Entertainment: <FaFilm />, Health: <FaHeartbeat />, Travel: <FaPlane />, Education: <FaBook />, Tech: <FaLaptop />, Personal: <FaUser />, Giving: <FaHandsHelping />, Fashion: <FaTshirt />,
    Fitness: <FaDumbbell />, Gadgets: <FaMobileAlt />, Internet: <FaWifi />, Streaming: <FaTv />, Subscriptions: <FaTv />, Housing: <FaHome />, Car: <FaCar />, Insurance: <FaShieldAlt />, Events: <FaCalendarAlt />
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/transactions/categories');
      const data = await res.json();
      if (data.status === 'success') {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };


  const fetchBudgetSummary = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`http://localhost:5001/api/budget?user_id=${userId}`);
      const data = await res.json();
      if (data.status === 'success') {
        const formatted = data.data.map(item => ({
          name: item.budget_name,
          target: item.total_target,
          used: item.current_amount || 0
        }));
        setBudgetData(formatted);
      }
    } catch (error) {
      console.error('Failed to fetch budget summary', error);
    }
  };


  useEffect(() => {
    if (location.state?.userId) {
      setUserId(location.state.userId);
    } else {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.id) {
        setUserId(user.id);
      }
    }
  }, [location.state]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (userId && categories.length > 0) {
      fetchBudgetSummary();
    }
  }, [userId, categories]);


  const renderMainContent = () => {
    if (activeTab === 'All Transactions') {
      return (
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-green-400">
              <th className="p-2">Name</th>
              <th className="p-2">Category</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Date</th>
              <th className="p-2">Account</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-2">{txn.name}</td>
                <td className="p-2">{txn.category}</td>
                <td className="p-2">{txn.amount}</td>
                <td className="p-2">{txn.date}</td>
                <td className="p-2 ">{txn.account}</td>
                <td className="p-2 space-x-2">
                  <span
                    className="inline-block border border-red-300 text-red-500 text-xs px-2 py-1 rounded-md cursor-pointer hover:bg-red-50"
                    onClick={() => {
                      const updated = transactions.filter((_, index) => index !== i);
                      setTransactions(updated);
                    }}
                  >
                    Delete
                  </span>
                  <span
                    className="inline-block border border-yellow-300 text-yellow-500 text-xs px-2 py-1 rounded-md cursor-pointer hover:bg-yellow-50"
                    onClick={() => {
                      setSelectedTransaction({ ...transactions[i], index: i });
                      setShowEditModal(true);
                    }}
                  >
                    Edit
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (activeTab === 'Category') {
      return (
        <div className="grid grid-cols-4 gap-4">
          {categories.map((label, idx) => (
            <div key={idx} className="text-center">
              <img
                src={`/categories/${label.category_name.toLowerCase()}.png`}
                alt={label.category_name}
                className="w-full h-24 object-cover rounded-md border"
              />
              <p className="text-xs mt-1">{label.category_name}</p>
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === 'Budget') {
      return (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => {
                if (userId) {
                  setShowSetBudget(true);
                } else {
                  alert('User ID not yet loaded. Please wait a moment.');
                }
              }}
              className="bg-green-500 text-white px-4 py-2 text-sm rounded-lg shadow hover:brightness-110"
            >
              Set Budget
            </button>
          </div>


          {budgetData.map((budget, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-xl shadow border border-gray-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={`/categories/${(budget.name || 'default').toLowerCase()}.png`}
                  alt={budget.name}
                  className="w-12 h-12 rounded-full border"
                />

                <div>
                  <p className="font-semibold text-sm">{budget.name}</p>
                  <p className="text-xs text-gray-600">
                    Target: R{budget.target} &nbsp; Used: R{budget.used}
                  </p>

                  <div className="w-64 bg-pink-100 h-2 mt-1 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-orange-400 to-pink-500 h-full"
                      style={{
                        width: `${Math.min((budget.used / budget.target) * 100, 100)}%`,
                      }}
                    ></div>

                  </div>
                </div>
              </div>
              <button className="bg-yellow-100 text-yellow-700 px-4 py-1 rounded-md text-xs hover:bg-yellow-200">
                Update
              </button>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="flex p-4 gap-4">
        {/* Sidebar */}
        <aside className="w-1/4 flex flex-col gap-4">
          {/* Spending Summary */}
          <div className="bg-white rounded-xl shadow border">
            <div className="bg-blue-300 px-4 py-2 rounded-t-xl">
              <h2 className="text-white text-sm font-semibold">Spending Summary</h2>
            </div>
            <div className="flex justify-center items-center p-4">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="54" stroke="#f3f4f6" strokeWidth="10" fill="none" />
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    stroke="url(#grad)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={`${(budgetData.reduce((t, b) => t + b.used, 0) / budgetData.reduce((t, b) => t + b.limit, 0)) * 339} 339`}
                  />
                  <defs>
                    <linearGradient id="grad" x1="1" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#facc15" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-lg font-bold text-gray-700">
                    {Math.round((budgetData.reduce((t, b) => t + b.used, 0) / budgetData.reduce((t, b) => t + b.limit, 0)) * 100)}%
                  </p>
                  <p className="text-xs text-gray-400">Used</p>
                </div>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="bg-cyan-50 rounded-xl p-4 shadow border">
            <h2 className="text-md font-semibold text-red-400 mb-2 border-b-4 border-red-200">Badges</h2>
            <div className="flex justify-around my-2">
              {badgeImages.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Badge ${index + 1}`}
                  className="w-20 h-20 rounded-full"
                />
              ))}
            </div>
          </div>


          {/* Category Summary */}
          <div className="bg-white rounded-xl p-4 shadow border">
            <h2 className="text-md font-semibold text-gray-700 mb-2 border-b-4 border-orange-400 pb-1">
              Category Summary
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4 mt-3">
              {Object.entries(
                transactions.reduce((acc, curr) => {
                  const amount = parseFloat(curr.amount.replace('R', ''));
                  if (!acc[curr.category]) acc[curr.category] = 0;
                  acc[curr.category] += amount;
                  return acc;
                }, {})
              ).map(([cat, total], i) => (
                <div key={i} className="flex flex-col items-start space-y-1">
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="text-lg">{categoryIcons[cat] || <FaUser />}</span>
                    <span className="text-sm font-medium">{cat}</span>
                  </div>
                  <span className="text-sm text-orange-600 font-semibold ml-8">
                    R{total.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-3/4">
          <div className="flex justify-between items-center mb-2">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 border-2 border-red-400 rounded-lg w-1/2"
            />

            <button
              onClick={() => setShowModal(true)}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 text-white text-sm rounded-lg"
            >
              Add Transaction
            </button>
          </div>

          <div className="flex space-x-2 mb-4">
            {['All Transactions', 'Category', 'Budget', 'Insight', 'Import'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1 text-sm rounded-full border transition-all duration-200 ${activeTab === tab
                  ? 'border-green-500 text-green-600'
                  : 'border-gray-300 text-gray-700 hover:border-green-400'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
          {renderMainContent()}
        </main>
      </div>

      {/* Modals */}
      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}
      {showSetBudget && (
        <SetBudgetModal
          onClose={() => setShowSetBudget(false)}
          onBudgetSet={fetchBudgetSummary}
          userId={userId}
        />
      )}

      {showEditModal && selectedTransaction && (
        <EditTransactionModal
          transaction={selectedTransaction}
          onClose={() => setShowEditModal(false)}
          onSave={(updated) => {
            const updatedList = [...transactions];
            updatedList[updated.index] = {
              name: updated.name,
              category: updated.category,
              amount: updated.amount,
              date: updated.date,
              account: updated.account,
            };
            setTransactions(updatedList);
          }}
        />
      )}

    </div>
  );
};

export default DashboardPage;

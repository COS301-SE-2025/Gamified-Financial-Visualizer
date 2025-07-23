import React, { useState, useEffect, useMemo } from 'react';
import avatar from '../../assets/Images/avatars/totoroAvatar.jpeg';
import {
  FaBolt,
  FaChartBar,
  FaHourglassHalf,
  FaCheck,
  FaTimes,
  FaBan,
  FaUtensils,
  FaBus,
  FaFilm,
  FaHeartbeat,
  FaPlane,
  FaBook,
  FaLaptop,
  FaUser,
  FaHandsHelping,
  FaTshirt,
  FaDumbbell,
  FaMobileAlt,
  FaWifi,
  FaTv,
  FaHome,
  FaCar,
  FaShieldAlt,
  FaCalendarAlt,
  FaGasPump,
  FaBuilding,
  FaUniversity,
  FaMoneyBillWave,
  FaPiggyBank,
  FaChartLine,
  FaChild,
  FaPaw,
  FaTools,
  FaWallet,
  FaCoins,
  FaExchangeAlt,
  FaSpinner
} from 'react-icons/fa';

// Category icons mapping
const categoryIcons = {
  groceries: <FaUtensils />,
  transport: <FaBus />,
  fuel: <FaGasPump />,
  utilities: <FaBolt />,
  rent: <FaHome />,
  mortgage: <FaBuilding />,
  internet: <FaWifi />,
  phone: <FaMobileAlt />,
  insurance: <FaShieldAlt />,
  medical: <FaHeartbeat />,
  health: <FaHeartbeat />,
  fitness: <FaDumbbell />,
  education: <FaBook />,
  subscriptions: <FaTv />,
  entertainment: <FaFilm />,
  restaurants: <FaUtensils />,
  clothing: <FaTshirt />,
  'personal care': <FaUser />,
  personal: <FaUser />,
  gifts: <FaHandsHelping />,
  charity: <FaHandsHelping />,
  default: <FaMoneyBillWave />
};

// Base category colors mapping
const categoryColors = {
  groceries: '#FF8A8A',
  transport: '#5FBFFF',
  fuel: '#FF7F9E',
  utilities: '#7FDD53',
  rent: '#FFC541',
  mortgage: '#FF7F9E',
  internet: '#7FDD53',
  phone: '#93C5FD',
  insurance: '#4C51BF',
  medical: '#F56565',
  health: '#F68D2B',
  fitness: '#805AD5',
  education: '#4299E1',
  subscriptions: '#38B2AC',
  entertainment: '#FFC541',
  restaurants: '#E53E3E',
  clothing: '#DD6B20',
  personal: '#7FDD53',
  gifts: '#68D391',
  charity: '#48BB78'
};

// Array of vibrant colors for categories not in the mapping
const fallbackColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
  '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
  '#10AC84', '#EE5A6F', '#C44569', '#F8B500', '#6C5CE7',
  '#A29BFE', '#FD79A8', '#00B894', '#E17055', '#74B9FF',
  '#81ECEC', '#FAB1A0', '#E84393', '#00CEC9', '#FDCB6E'
];

// Function to get color for a category
const getCategoryColor = (categoryKey, index = 0) => {
  if (categoryColors[categoryKey]) {
    return categoryColors[categoryKey];
  }
  
  return fallbackColors[index % fallbackColors.length];
};

const AccountsSidebar = () => {
  const [categorySummary, setCategorySummary] = useState([]);
  const [userTransactions, setUserTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // Get user ID from localStorage
  useEffect(() => {
    const getUserFromStorage = () => {
      try {
        // Try different possible keys for user data in localStorage
        const userData = localStorage.getItem('user') || 
                        localStorage.getItem('currentUser') || 
                        localStorage.getItem('userData') ||
                        localStorage.getItem('authUser');
        
        if (userData) {
          const parsedUser = JSON.parse(userData);
          // Handle different possible user object structures
          const id = parsedUser.id || parsedUser.user_id || parsedUser.userId;
          setUserId(id);
        } else {
          setError('User not found in localStorage');
        }
      } catch (err) {
        console.error('Error reading user from localStorage:', err);
        setError('Failed to get user information');
      }
    };

    getUserFromStorage();
  }, []);

  // Fetch both category summary and user transactions
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        if (userId === null) {
          return;
        }
        setError('User ID is required');
        return;
      }

      try {
        setError(null);

        // Fetch category summary
        const summaryResponse = await fetch(`http://localhost:5000/api/transactions/user/${userId}/summary`);
        
        if (!summaryResponse.ok) {
          throw new Error(`HTTP error! status: ${summaryResponse.status}`);
        }

        const summaryResult = await summaryResponse.json();
        
        if (summaryResult.status === 'success') {
          setCategorySummary(summaryResult.data || []);
        } else {
          throw new Error(summaryResult.message || 'Failed to fetch category summary');
        }

        // Fetch user transactions
        const transactionsResponse = await fetch(`http://localhost:5000/api/transactions/user/${userId}`);
        
        if (!transactionsResponse.ok) {
          throw new Error(`HTTP error! status: ${transactionsResponse.status}`);
        }

        const transactionsResult = await transactionsResponse.json();
        
        if (transactionsResult.status === 'success') {
          setUserTransactions(transactionsResult.data || []);
        } else {
          throw new Error(transactionsResult.message || 'Failed to fetch user transactions');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load data');
      }
    };

    fetchData();
  }, [userId]);

  // Calculate performance metrics based on transactions
  const performanceMetrics = useMemo(() => {
    if (!userTransactions || userTransactions.length === 0) {
      return {
        /* score: 150,
        level: 'Silver',
        levelNumber: 3,
        description: 'Excellent',
        progressPercentage: 75 */
      };
    }

    // Calculate totals by transaction type
    const totals = userTransactions.reduce((acc, transaction) => {
      const amount = parseFloat(transaction.transaction_amount) || 0;
      const type = transaction.transaction_type?.toLowerCase();
      
      if (type === 'deposit' || type === 'income') {
        acc.income += amount;
      } else if (type === 'expense' || type === 'withdrawal' || type === 'fee') {
        acc.expenses += amount;
      } else if (type === 'transfer') {
        acc.transfers += amount;
      }
      
      return acc;
    }, { income: 0, expenses: 0, transfers: 0 });

    // Calculate performance score
    // Base score starts at 100
    let score = 100;
    
    // Income boosts score (every R100 income = +5 points, max +100)
    const incomeBonus = Math.min((totals.income / 100) * 5, 100);
    score += incomeBonus;
    
    // Expenses reduce score (every R100 expense = -3 points, max -80)
    const expenseReduction = Math.min((totals.expenses / 100) * 3, 80);
    score -= expenseReduction;
    
    // Transfers have neutral impact but show activity (+1 point per R100, max +20)
    const transferBonus = Math.min((totals.transfers / 100) * 1, 20);
    score += transferBonus;
    
    // Keep score within reasonable bounds
    score = Math.max(0, Math.min(300, score));
    
    // Determine level based on score
    let level, levelNumber, description;
    
    if (score >= 250) {
      level = 'Diamond';
      levelNumber = 5;
      description = 'Outstanding';
    } else if (score >= 200) {
      level = 'Platinum';
      levelNumber = 4;
      description = 'Excellent';
    } else if (score >= 150) {
      level = 'Gold';
      levelNumber = 3;
      description = 'Excellent';
    } else if (score >= 100) {
      level = 'Silver';
      levelNumber = 3;
      description = 'Good';
    } else if (score >= 50) {
      level = 'Bronze';
      levelNumber = 2;
      description = 'Fair';
    } else {
      level = 'Starter';
      levelNumber = 1;
      description = 'Getting Started';
    }
    
    // Calculate progress percentage for the circle (0-100%)
    const progressPercentage = Math.min((score / 300) * 100, 100);
    
    return {
      score: Math.round(score),
      level,
      levelNumber,
      description,
      progressPercentage
    };
  }, [userTransactions]);

  // Debug logging to help troubleshoot

  // useEffect(() => {
  //   console.log('AccountsSidebar Debug:', {
  //     userId,
  //     categorySummary,
  //     loading,
  //     error
  //   });
  // }, [userId, categorySummary, loading, error]);


  // Process category data for display
  const categoryTotals = useMemo(() => {
    if (!categorySummary || categorySummary.length === 0) {
      return [];
    }

    return categorySummary.map((category, index) => {
      const categoryKey = category.category?.toLowerCase() || 'default';
      
      return {
        total: parseFloat(category.total_spent) || 0,
        name: category.category || 'Unknown',
        icon: categoryIcons[categoryKey] || categoryIcons.default,
        color: getCategoryColor(categoryKey, index),
        transactionCount: category.transaction_count || 0
      };
    }).sort((a, b) => b.total - a.total);
  }, [categorySummary]);

  // Calculate total spending across all categories
  const totalSpending = useMemo(() => {
    return categoryTotals.reduce((sum, category) => sum + category.total, 0);
  }, [categoryTotals]);

  // Calculate stroke dash offset for progress circle
  const strokeDashOffset = useMemo(() => {
    const circumference = 2 * Math.PI * 45; // radius = 45
    const progress = performanceMetrics.progressPercentage / 100;
    return circumference * (1 - progress);
  }, [performanceMetrics.progressPercentage]);

  // Error state
  if (error) {
    return (
      <aside className="space-y-6">
        <div className="bg-white rounded-2xl p-4 shadow text-center">
          <div className="text-red-500 mb-2">
            <FaTimes className="mx-auto text-2xl mb-2" />
            <p className="text-sm">Error loading categories</p>
            <p className="text-xs text-gray-500 mt-1">{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="text-blue-500 text-sm hover:underline"
          >
            Try again
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="space-y-6">
      {/* Overall Performance */}
      <div className="bg-white rounded-2xl p-4 shadow text-center">
        <p className="text-sm font-semibold text-[#4A5568] bg-[#D6EAFE] px-3 py-1 rounded-full inline-block mb-2">
          Account Performance
        </p>

        {/* Progress Circle */}
        <div className="relative w-40 h-40 mx-auto">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#E8F0FA" strokeWidth="10" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="10"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={strokeDashOffset}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              style={{ 
                transition: 'stroke-dashoffset 0.5s ease-in-out' 
              }}
            />
            <defs>
              <linearGradient id="gradient" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#93C5FD" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {(
              <>
                <p className="text-[24px] font-bold text-[#2D3748]">{performanceMetrics.score}</p>
                <p className="text-sm text-[#718096]">{performanceMetrics.description}</p>
                <img
                  src={avatar}
                  alt={`${performanceMetrics.level} Level`}
                  className="w-8 h-8 mt-1 rounded-full object-cover"
                />
              </>
            )}
          </div>

          <div className="absolute top-[6px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-blue-400 rounded-full" />
          </div>
        </div>
        <p className="text-sm text-[#F56565] mt-2 font-medium">
          Lv {performanceMetrics.levelNumber}: {performanceMetrics.level}
        </p>
      </div>

      {/* Categories Summaries */}
      <div className="bg-white rounded-2xl p-4 shadow">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm font-semibold text-[#4A5568] bg-[#D6EAFE] px-4 py-1 rounded-full inline-block">
            Categories
          </p>
          {totalSpending > 0 && (
            <p className="text-xs text-gray-500">
              {/* Total: R{totalSpending.toFixed(2)} */}
            </p>
          )}
        </div>

        {categoryTotals.length === 0 ? (
          console.log('No categories found. ')
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {categoryTotals.map((category, i) => (
              <div key={i} className="relative bg-white rounded-xl shadow-md p-3 flex items-center justify-between hover:shadow-lg transition-shadow">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <div style={{ color: category.color }}>
                    {category.icon}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    R{category.total.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">{category.name}</p>
                  {category.transactionCount > 0 && (
                    <p className="text-xs text-gray-400">
                      {category.transactionCount} transaction{category.transactionCount !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                <div
                  className="absolute bottom-0 left-0 h-[5px] w-full rounded-b-xl"
                  style={{ backgroundColor: category.color }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default AccountsSidebar;
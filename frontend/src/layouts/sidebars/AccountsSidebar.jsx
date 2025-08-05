import React, {useState, useEffect, useMemo} from 'react';
import {
  FaUsers,
  FaBolt,
  FaCheck,
  FaHourglassHalf,
  FaTimes,
  FaChartBar,
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
import avatar from '../../assets/Images/avatars/BeachShore.png';

const performance = {
  score: 350,
  level: 'Lv 3: Silver',
  label: 'Excellent',
  progress: 70
};

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

const AccountsPerformanceHeader = () => {
  const [categorySummary, setCategorySummary] = useState([]);
  const [userTransactions, setUserTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [performanceSummary, setPerformanceSummary] = useState(null);
  const [userId, setUserId] = useState(null);

  // Get user ID from localStorage
  useEffect(() => {
    const getUserFromStorage = () => {
      try {
        // Try different possible keys for user data in localStorage
        const userData = localStorage.getItem('user') ;
        
        if (userData) {
          const parsedUser = JSON.parse(userData);
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

    fetch(`http://localhost:5000/api/auth/profile/performance-summary/${userId}`)
      .then(res => res.json())
      .then(data => setPerformanceSummary(data.data))
      .catch(err => console.error('Performance summary error:', err));

    fetchData();
  }, [userId]);

  // Calculate performance metrics based on transactions
  const performanceMetrics = useMemo(() => {
    if (!userTransactions || userTransactions.length === 0) {
      return {};
    }

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

    let score = 100;
    const incomeBonus = Math.min((totals.income / 100) * 5, 100);
    score += incomeBonus;
    const expenseReduction = Math.min((totals.expenses / 100) * 3, 80);
    score -= expenseReduction;
    const transferBonus = Math.min((totals.transfers / 100) * 1, 20);
    score += transferBonus;
    score = Math.max(0, Math.min(300, score));
    
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
    
    const progressPercentage = Math.min((score / 300) * 100, 100);
    
    return {
      score: Math.round(score),
      level,
      levelNumber,
      description,
      progressPercentage
    };
  }, [userTransactions]);



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

  return (
    <div className="flex flex-wrap justify-between gap-6 items-start w-full mb-6">
      {/* Left Label */}
      <div className="text-center lg:text-left">
        <div className="flex items-center justify-center lg:justify-start gap-2 text-[#B4DFA4] dark:text-[#88BC46]">
          <FaUsers className="text-6xl" />
          <h1 className="text-5xl font-light dark:text-white">Accounts</h1>
        </div>
        <p className="text-lg text-gray-400 dark:text-gray-300 mt-1 max-w-xs mx-auto lg:mx-0">
          View and manage all your linked accounts and track recent transactions in one place.
        </p>
      </div>

      {/* Right Section (Performance Card + Stat Grid) */}
      <div className="flex flex-col gap-4 flex-1">
        {/* Center Performance Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Avatar + Info */}
          <div className="flex items-center gap-6">
            <img src={`/assets/Images/${performanceSummary?.avatar_image_path}`} className="w-16 h-16 rounded-full object-cover" alt="Avatar" />
            <div>
              <p className="text-sm text-gray-500">Score</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{performanceMetrics.score}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{performanceMetrics.description}</p>
              <p className="text-sm text-[#F97156] dark:text-[#FF955A] font-medium">Lv {performanceMetrics.levelNumber}: {performanceMetrics.level}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full">
            <p className="text-sm font-medium text-[#7FBCE9] dark:text-[#5FBFFF] mb-1">Accounts Performance</p>
            <div className="relative h-4 w-full rounded-full bg-[#f5f5f5] dark:bg-gray-700 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${performanceMetrics.progressPercentage}%`,
                  background: 'linear-gradient(to right, #4FC3F7, #B3E5FC)'
                }}
              />
              <div
                className="absolute top-1/2 w-5 h-5 bg-[#B3E5FC] rounded-full border-2 border-white dark:border-gray-800 shadow-md"
                style={{
                  left: `calc(${performanceMetrics.progressPercentage}% - 10px)`,
                  transform: 'translateY(-50%)'
                }}
              />
            </div>
          </div>
        </div>

        {/* Stat Blocks*/}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
          {categoryTotals.map((category, i) => (
            <div key={i} className="relative bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3">
                {/* Icon circle with soft background */}
                <div className="w-10 h-10 flex items-center justify-center rounded-full" style={{ backgroundColor: `${category.color}20` }}>
                  <span className="text-xl" style={{ color: category.color }}>{category.icon}</span>
                </div>

                {/* Stat content */}
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">R{category.total.toFixed(2)}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{category.name}</div>
                </div>
              </div>

              {/* Bottom colored bar */}
              <div className="absolute bottom-0 left-0 h-[5px] w-full rounded-b-xl" style={{ backgroundColor: category.color }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountsPerformanceHeader;
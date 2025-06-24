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

function getRandomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

const randomColor = getRandomColor(); // Example output: "#3A7B42"
// Category colors mapping
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
  charity: '#48BB78',
  default: randomColor
};

const AccountsSidebar = () => {
  const [categorySummary, setCategorySummary] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Fetch category summary data from API
  useEffect(() => {
    const fetchCategorySummary = async () => {
      if (!userId) {
        if (userId === null) {
          // Still loading user ID
          return;
        }
        setError('User ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:5000/api/transactions/user/${userId}/summary`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.status === 'success') {
          setCategorySummary(result.data || []);
        } else {
          throw new Error(result.message || 'Failed to fetch category summary');
        }
      } catch (err) {
        console.error('Error fetching category summary:', err);
        setError(err.message || 'Failed to load category data');
      } finally {
        setLoading(false);
      }
    };

    fetchCategorySummary();
  }, [userId]);

  // Debug logging to help troubleshoot
  useEffect(() => {
    console.log('AccountsSidebar Debug:', {
      userId,
      categorySummary,
      loading,
      error
    });
  }, [userId, categorySummary, loading, error]);

  // Process category data for display
  const categoryTotals = useMemo(() => {
    if (!categorySummary || categorySummary.length === 0) {
      return [];
    }

    return categorySummary.map(category => {
      // Fix: Use 'category' instead of 'category_name' to match API response
      const categoryKey = category.category?.toLowerCase() || 'default';
      
      return {
        total: parseFloat(category.total_spent) || 0,
        name: category.category || 'Unknown', // Fix: Use 'category' instead of 'category_name'
        icon: categoryIcons[categoryKey] || categoryIcons.default,
        color: categoryColors[categoryKey] || categoryColors.default,
        transactionCount: category.transaction_count || 0
      };
    }).sort((a, b) => b.total - a.total); // Sort by highest spending first
  }, [categorySummary]);

  // Calculate total spending across all categories
  const totalSpending = useMemo(() => {
    return categoryTotals.reduce((sum, category) => sum + category.total, 0);
  }, [categoryTotals]);

  // Loading state
  if (loading) {
    return (
      <aside className="space-y-6">
        <div className="bg-white rounded-2xl p-4 shadow text-center">
          <div className="flex items-center justify-center space-x-2">
            <FaSpinner className="animate-spin text-blue-500" />
            <span className="text-gray-600">Loading categories...</span>
          </div>
        </div>
      </aside>
    );
  }

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
              strokeDasharray="270"
              strokeDashoffset="67"
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
            <defs>
              <linearGradient id="gradient" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#93C5FD" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[24px] font-bold text-[#2D3748]">150</p>
            <p className="text-sm text-[#718096]">Excellent</p>
            <img
              src={avatar}
              alt="Silver Level"
              className="w-8 h-8 mt-1 rounded-full object-cover"
            />
          </div>

          <div className="absolute top-[6px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-blue-400 rounded-full" />
          </div>
        </div>
        <p className="text-sm text-[#F56565] mt-2 font-medium">Lv 3: Silver</p>
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
          <div className="text-center py-8 text-gray-500">
            <FaChartBar className="mx-auto text-3xl mb-2 opacity-50" />
            <p className="text-sm">No spending data available</p>
            <p className="text-xs mt-1">Start making transactions to see your categories</p>
          </div>
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
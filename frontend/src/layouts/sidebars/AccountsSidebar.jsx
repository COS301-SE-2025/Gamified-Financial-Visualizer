import React, { useMemo } from 'react';
import avatar from '../../assets/Images/avatars/totoroAvatar.jpeg';
import {
  FaBolt, FaUtensils, FaBus, FaFilm, FaHeartbeat, FaBook, FaUser,
  FaHandsHelping, FaTshirt, FaDumbbell, FaMobileAlt, FaWifi, FaTv,
  FaHome, FaShieldAlt, FaGasPump, FaBuilding, FaMoneyBillWave
} from 'react-icons/fa';

// Mock transaction data
const mockTransactions = [
  { category: 'Groceries', amount: 'R1200', date: '2023-05-15', name: 'Supermarket' },
  { category: 'Groceries', amount: 'R850', date: '2023-05-20', name: 'Local Market' },
  { category: 'Entertainment', amount: 'R500', date: '2023-05-10', name: 'Movie Tickets' },
  { category: 'Entertainment', amount: 'R350', date: '2023-05-18', name: 'Concert' },
  { category: 'Health', amount: 'R1200', date: '2023-05-05', name: 'Gym Membership' },
  { category: 'Health', amount: 'R450', date: '2023-05-12', name: 'Vitamins' },
  { category: 'Personal', amount: 'R2800', date: '2023-05-01', name: 'Clothing' },
  { category: 'Personal', amount: 'R1500', date: '2023-05-08', name: 'Electronics' },
  { category: 'Fuel', amount: 'R800', date: '2023-05-03', name: 'Gas Station' },
  { category: 'Fuel', amount: 'R750', date: '2023-05-17', name: 'Gas Station' },
  { category: 'Transport', amount: 'R500', date: '2023-05-07', name: 'Bus Pass' },
  
];

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
  default: '##FF7F9E'
};

const AccountsSidebar = () => {
  // Calculate category totals from mock data
  const categoryTotals = useMemo(() => {
    const totals = {};
    
    mockTransactions.forEach(txn => {
      const amountValue = parseFloat(txn.amount.replace(/[^0-9.-]+/g, ''));
      const categoryKey = txn.category.toLowerCase();
      
      if (totals[categoryKey]) {
        totals[categoryKey].total += amountValue;
      } else {
        totals[categoryKey] = {
          total: amountValue,
          name: txn.category,
          icon: categoryIcons[categoryKey] || categoryIcons.default,
          color: categoryColors[categoryKey] || categoryColors.default
        };
      }
    });
    
    return Object.values(totals);
  }, []);

  return (
    <aside className="space-y-6">
      {/* Overall Performance */}
      <div className="bg-white rounded-2xl p-4 shadow text-center">
        <p className="text-sm font-semibold text-[#4A5568] bg-[#D6EAFE] px-3 py-1 rounded-full inline-block mb-2">
          Overall Performance
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
            <p className="text-[24px] font-bold text-[#2D3748]">350</p>
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
      <div className="bg-white rounded-2xl p-4 shadow text-center">
        <p className="text-sm font-semibold text-[#4A5568] bg-[#D6EAFE] px-4 py-1 rounded-full inline-block mb-4">
          Transaction Statistcs
        </p>

        <div className="grid grid-cols-2 gap-4">
          {categoryTotals.map((category, i) => (
            <div key={i} className="relative bg-white rounded-xl shadow-md p-3 flex items-center justify-between">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${category.color}20` }}
              >
                <div style={{ color: category.color }}>
                  {category.icon}
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">R{category.total.toFixed(2)}</p>
                <p className="text-sm text-gray-500">{category.name}</p>
              </div>

              <div
                className="absolute bottom-0 left-0 h-[5px] w-full rounded-b-xl"
                style={{ backgroundColor: category.color }}
              />
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default AccountsSidebar;
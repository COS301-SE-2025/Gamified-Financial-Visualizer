import React, { useState, useMemo } from 'react';
import AccountsLayout from './AccountsLayout';
import {
  FaChartBar,
  FaUsers,
  FaTrophy,
  FaPiggyBank,
  FaRunning,
  FaArrowUp,
  FaArrowDown,
  FaCheckCircle,
  FaTimesCircle,
  FaRobot,
  FaPaperPlane,
  FaLightbulb,
  FaExchangeAlt, FaChartLine, FaTags 
} from 'react-icons/fa';

import {
  ComposedChart, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
  PieChart, Pie, Cell, LabelList,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, CartesianGrid, Area
} from 'recharts';

import GaugeChart from 'react-gauge-chart';

// Color palette
const COLORS = {
  primary: '#4f46e5',
  income: '#10b981',
  expense: '#f43f5e',
  average: '#8b5cf6',
  averageExpense: '#f87171',
  averageIncome: '#1b3de5ff',
  forecast: '#0ea5e9',
  savings: '#06b6d4',
  budget: '#8b5cf6',
  checking: '#6366f1',
  investment: '#f59e0b',
  radar: '#4f46e5',
  grid: '#e5e7eb',
  anomaly: '#ef4444',
  volatility: '#f59e0b',
  groceries: '#4f46e5',
  dining: '#10b981',
  transport: '#f59e0b',
  utilities: '#f43f5e'
};

// Mock data
const monthlyData = [
  { month: 'Jan', income: 8000, expense: 6500, avgIncome: 9500, avgExpense: 7000 },
  { month: 'Feb', income: 8500, expense: 6200, avgIncome: 7600, avgExpense: 7100 },
  { month: 'Mar', income: 7800, expense: 6900, avgIncome: 7700, avgExpense: 6950 },
  { month: 'Apr', income: 9000, expense: 7200, avgIncome: 7900, avgExpense: 7300 },
  { month: 'May', income: 8200, expense: 6800, avgIncome: 6000, avgExpense: 7050 },
  { month: 'Jun', income: 9500, expense: 7500, avgIncome: 8000, avgExpense: 7200 },
  { month: 'Jul', income: 8700, expense: 7000, avgIncome: 8500, avgExpense: 7400 },
  { month: 'Aug', income: 9200, expense: 7300, avgIncome: 9000, avgExpense: 7500 },
  { month: 'Sep', income: 8800, expense: 7100, avgIncome: 8700, avgExpense: 7600 },
  { month: 'Oct', income: 9400, expense: 7700, avgIncome: 9200, avgExpense: 7800 },
  { month: 'Nov', income: 9100, expense: 7400, avgIncome: 8900, avgExpense: 7700 },
  { month: 'Dec', income: 9600, expense: 8000, avgIncome: 9500, avgExpense: 8000 }
];

const accountData = [
  { name: 'Checking', value: 12000, income: 8000, expense: 6500 },
  { name: 'Savings', value: 8000, income: 2000, expense: 500 },
  { name: 'Investment', value: 15000, income: 1500, expense: 300 },
];

const radarStats = [
  {
    axis: 'Savings Rate',
    value: 70,
    average: 55,
    ideal: 80,
    description: 'Percentage of income saved each month'
  },
  {
    axis: 'Investing Rate',
    value: 65,
    average: 45,
    ideal: 70,
    description: 'Percentage of income invested'
  },
  {
    axis: 'Smart Spending',
    value: 80,
    average: 60,
    ideal: 85,
    description: 'Ratio of needs vs wants spending'
  },
  {
    axis: 'Spending Discipline',
    value: 75,
    average: 50,
    ideal: 75,
    description: 'Consistency in sticking to budget'
  },
  {
    axis: 'Financial Literacy',
    value: 60,
    average: 40,
    ideal: 90,
    description: 'Understanding of financial concepts'
  },
  {
    axis: 'Financial Health',
    value: 85,
    average: 65,
    ideal: 90,
    description: 'Overall financial wellbeing score'
  }
];

const comparisonData = {
  categorySpending: [
    { category: 'Groceries', userSpent: 2100, avgSpent: 1600, status: 'higher' },
    { category: 'Entertainment', userSpent: 1200, avgSpent: 850, status: 'higher' },
    { category: 'Transport', userSpent: 400, avgSpent: 600, status: 'lower' },
    { category: 'Dining', userSpent: 800, avgSpent: 750, status: 'higher' },
    { category: 'Utilities', userSpent: 1200, avgSpent: 1250, status: 'lower' },

  ],
  monthlySpending: {
    user: 8500,
    allUsers: 9200,
    ageGroup: 8100,
    incomeBracket: 8800
  },
  aiScore: {
    user: 74,
    allUsers: 68,
    ageGroup: 62
  },
  savingsRate: {
    user: 15,
    average: 10,
    topPercentile: 25
  },
  goalProgress: [
    { goal: 'Emergency Fund', userMonths: 2, avgMonths: 3.5 },
    { goal: 'Vacation', userMonths: 4, avgMonths: 6 }
  ],
  leaderboards: {
    entertainment: { percentile: 72, direction: 'less' },
    savings: { percentile: 65, direction: 'more' },
    quizScore: { percentile: 20, direction: 'top' }
  }
};

// Mock data generator
const generateMockData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const categories = ['groceries', 'dining', 'transport', 'utilities'];

  return {
    categoryTrends: months.reduce((acc, month) => {
      acc[month] = categories.reduce((catAcc, category) => {
        catAcc[category] = Math.floor(Math.random() * 3000) + 500;
        return catAcc;
      }, {});
      return acc;
    }, {}),

    globalTrend: {
      months,
      spending: months.map(() => Math.floor(Math.random() * 8000) + 2000),
      delta: months.map(() => (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 500))
    },

    categoryShift: {
      previous: categories[Math.floor(Math.random() * categories.length)],
      current: categories[Math.floor(Math.random() * categories.length)],
      changed: Math.random() > 0.5
    },

    behavioralTags: ['Impulsive Spender', 'Frugal'].filter(() => Math.random() > 0.5),

    spendingForecast: {
      next_month_forecast: Math.floor(Math.random() * 8000) + 2000
    },

    anomalies: Array(Math.floor(Math.random() * 5)).fill().map(() => ({
      amount: Math.floor(Math.random() * 5000) + 1000,
      category: categories[Math.floor(Math.random() * categories.length)],
      month: months[Math.floor(Math.random() * months.length)]
    })),

    volatility: months.reduce((acc, month) => {
      acc[month] = Math.floor(Math.random() * 500) + 100;
      return acc;
    }, {})
  };
};

const analysisData = generateMockData();

// Transform data for visualization
const chartData = Object.entries(analysisData.categoryTrends).map(([month, categories], index) => ({
  month,
  ...categories,
  totalSpending: analysisData.globalTrend.spending[index],
  forecast: index === analysisData.globalTrend.months.length - 1
    ? analysisData.spendingForecast.next_month_forecast
    : null,
  volatility: analysisData.volatility[month],
  anomalies: analysisData.anomalies.filter(a => a.month === month).length
}));

// Custom tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload) {
    const monthData = chartData.find(d => d.month === label);
    return (
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
        <p className="font-bold mb-2">{label}</p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-red-500">Total: R{monthData?.totalSpending.toLocaleString()}</p>
            {payload.map((entry, index) => (
              <p key={index} style={{ color: entry.color }}>
                {entry.name}: R{entry.value?.toLocaleString() || '0'}
              </p>
            ))}
          </div>
          <div className="pl-4 border-l">
            <p className="text-sm">Volatility: {monthData?.volatility.toLocaleString()}</p>
            <p className="text-sm">Anomalies: {monthData?.anomalies}</p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const trendData = monthlyData.map(d => ({
  ...d,
  forecast: d.expense * 1.1,
  rollingAvg: (d.expense + (d.expense * 1.1)) / 2,
  budgetTarget: d.expense * 0.9
}));

const InsightsPage = () => {
  const [prompt, setPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('overall'); // 'overall' or 'byAccount'
  const [activePieIndex, setActivePieIndex] = useState(null);

  const getAiAnalysis = async (userPrompt) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const responses = {
      default: "Based on your spending patterns, you could save 15% more by reducing dining out expenses and optimizing your grocery budget.",
      savings: "Your savings rate is 18%, which is good but could improve. Consider automating R500 more per month to reach your goals faster.",
      investments: "Your portfolio lacks diversification. 78% is in equities - consider adding 20% bonds and 2% crypto for better risk balance.",
      debt: "Your credit card utilization is 45%. Aim for under 30% to improve your credit score. Focus on paying down the card with 19.5% APR first."
    };

    let response = responses.default;
    if (userPrompt.toLowerCase().includes('savings')) response = responses.savings;
    if (userPrompt.toLowerCase().includes('invest')) response = responses.investments;
    if (userPrompt.toLowerCase().includes('debt')) response = responses.debt;

    setAiResponse({
      prompt: userPrompt,
      analysis: response,
      actionItems: [
        "Set up auto-transfer of R500 to savings",
        "Review dining expenses from last month",
        "Schedule a portfolio review next week"
      ],
      generatedAt: new Date().toLocaleString()
    });
    setIsLoading(false);
  };

  const totalNetWorth = accountData.reduce((sum, a) => sum + a.value, 0);

  // Custom tooltip components
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <p className="font-bold">{data.name}</p>
          <p className="text-sm">Net Worth: R{data.value.toLocaleString()}</p>
          <p className="text-sm text-green-600">Income: R{data.income.toLocaleString()}</p>
          <p className="text-sm text-red-500">Expenses: R{data.expense.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  const CustomRadarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = radarStats.find(item => item.axis === payload[0].payload.axis);
      return (
        <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200 text-sm">
          <p className="font-bold">{data.axis}</p>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div>
              <p className="text-indigo-600">You: {payload[0].value}/100</p>
              <p className="text-gray-500">Avg: {data.average}/100</p>
              <p className="text-green-600">Ideal: {data.ideal}/100</p>
            </div>
            <div className="border-l pl-2">
              <p className="text-gray-600 text-xs">{data.description}</p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomLineTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = trendData.find(item => item.month === label);
      return (
        <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
          <p className="font-bold mb-2">{label}</p>
          <div className="space-y-1">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span>Actual: R{data.expense.toLocaleString()}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span>Forecast: R{data.forecast.toLocaleString()}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2 border border-gray-300"></div>
              <span>Budget Target: R{data.budgetTarget.toLocaleString()}</span>
            </div>
            <div className="pt-2 mt-2 border-t border-gray-100">
              <p className="text-sm">
                {data.expense > data.forecast ? (
                  <span className="text-red-500">↑ Overspending by {(data.expense / data.forecast * 100 - 100).toFixed(1)}%</span>
                ) : (
                  <span className="text-green-500">↓ Underspending by {(100 - data.expense / data.forecast * 100).toFixed(1)}%</span>
                )}
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };


  const getSentiment = (features) => {
    if (features.savings_rate < 0.05 && features.impulse_score > 0.6) return "Anxious";
    if (features.goal_completion_ratio > 0.75) return "Confident";
    if (features.burn_rate > 300) return "Unstable";
    return "Stable";
  };

  // Mock financial data
  const financialFeatures = {
    savings_rate: 0.07,
    impulse_score: 0.4,
    goal_completion_ratio: 0.6,
    burn_rate: 250
  };

  const currentSentiment = getSentiment(financialFeatures);

  // Map sentiment to gauge value (0-1)
  const sentimentToValue = {
    "Anxious": 0.125,  // 12.5% (middle of 0-25% range)
    "Unstable": 0.375, // 37.5% (middle of 25-50% range)
    "Stable": 0.625,   // 62.5% (middle of 50-75% range)
    "Confident": 0.875 // 87.5% (middle of 75-100% range)
  };

  const chartStyle = {
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto'
  };


  const spendingData = [
    {
      month: 'Jan',
      accounts: {
        checking: {
          groceries: 1200,
          dining: 800,
          transport: 600,
          utilities: 400
        },
        savings: {
          groceries: 300,
          dining: 200,
          transport: 150,
          utilities: 100
        },
        investment: {
          groceries: 0,
          dining: 50,
          transport: 0,
          utilities: 0
        }
      },
      totals: {
        groceries: 1500,
        dining: 1050,
        transport: 750,
        utilities: 500
      }
    },
    // ... more months following same structure
    {
      month: 'Feb',
      accounts: {
        checking: {
          groceries: 1100,
          dining: 900,
          transport: 550,
          utilities: 450
        },
        savings: {
          groceries: 400,
          dining: 150,
          transport: 200,
          utilities: 120
        },
        investment: {
          groceries: 0,
          dining: 75,
          transport: 0,
          utilities: 0
        }
      },
      totals: {
        groceries: 1500,
        dining: 1125,
        transport: 750,
        utilities: 570
      }
    },
    {
      month: 'Mar',
      accounts: {
        checking: {
          groceries: 1300,
          dining: 700,
          transport: 650,
          utilities: 480
        },
        savings: {
          groceries: 200,
          dining: 250,
          transport: 100,
          utilities: 90
        },
        investment: {
          groceries: 0,
          dining: 100,
          transport: 0,
          utilities: 0
        }
      },
      totals: {
        groceries: 1500,
        dining: 1050,
        transport: 750,
        utilities: 570
      }
    },
    {
      month: 'Apr',
      accounts: {
        checking: {
          groceries: 1300,
          dining: 700,
          transport: 650,
          utilities: 480
        },
        savings: {
          groceries: 200,
          dining: 250,
          transport: 100,
          utilities: 90
        },
        investment: {
          groceries: 0,
          dining: 100,
          transport: 0,
          utilities: 0
        }
      },
      totals: {
        groceries: 1500,
        dining: 1050,
        transport: 750,
        utilities: 570
      }
    },
    {
      month: 'Apr',
      accounts: {
        checking: {
          groceries: 1300,
          dining: 700,
          transport: 650,
          utilities: 480
        },
        savings: {
          groceries: 200,
          dining: 250,
          transport: 100,
          utilities: 90
        },
        investment: {
          groceries: 0,
          dining: 100,
          transport: 0,
          utilities: 0
        }
      },
      totals: {
        groceries: 1500,
        dining: 1050,
        transport: 750,
        utilities: 570
      }
    },
    {
      month: 'May',
      accounts: {
        checking: {
          groceries: 1300,
          dining: 700,
          transport: 650,
          utilities: 480
        },
        savings: {
          groceries: 200,
          dining: 250,
          transport: 100,
          utilities: 90
        },
        investment: {
          groceries: 0,
          dining: 100,
          transport: 0,
          utilities: 0
        }
      },
      totals: {
        groceries: 1500,
        dining: 1050,
        transport: 750,
        utilities: 570
      }
    },
    {
      month: 'June',
      accounts: {
        checking: {
          groceries: 1300,
          dining: 700,
          transport: 650,
          utilities: 480
        },
        savings: {
          groceries: 200,
          dining: 250,
          transport: 100,
          utilities: 90
        },
        investment: {
          groceries: 0,
          dining: 100,
          transport: 0,
          utilities: 0
        }
      },
      totals: {
        groceries: 1500,
        dining: 1050,
        transport: 750,
        utilities: 570
      }
    },
    {
      month: 'Aug',
      accounts: {
        checking: {
          groceries: 1300,
          dining: 700,
          transport: 650,
          utilities: 480
        },
        savings: {
          groceries: 200,
          dining: 250,
          transport: 100,
          utilities: 90
        },
        investment: {
          groceries: 0,
          dining: 100,
          transport: 0,
          utilities: 0
        }
      },
      totals: {
        groceries: 1500,
        dining: 1050,
        transport: 750,
        utilities: 570
      }
    },
    {
      month: 'Sep',
      accounts: {
        checking: {
          groceries: 1300,
          dining: 700,
          transport: 650,
          utilities: 480
        },
        savings: {
          groceries: 200,
          dining: 250,
          transport: 100,
          utilities: 90
        },
        investment: {
          groceries: 0,
          dining: 100,
          transport: 0,
          utilities: 0
        }
      },
      totals: {
        groceries: 1500,
        dining: 1050,
        transport: 750,
        utilities: 570
      }
    },
    {
      month: 'Oct',
      accounts: {
        checking: {
          groceries: 1300,
          dining: 700,
          transport: 650,
          utilities: 480
        },
        savings: {
          groceries: 200,
          dining: 250,
          transport: 100,
          utilities: 90
        },
        investment: {
          groceries: 0,
          dining: 100,
          transport: 0,
          utilities: 0
        }
      },
      totals: {
        groceries: 1500,
        dining: 1050,
        transport: 750,
        utilities: 570
      }
    },
    {
      month: 'Nov',
      accounts: {
        checking: {
          groceries: 1300,
          dining: 700,
          transport: 650,
          utilities: 480
        },
        savings: {
          groceries: 200,
          dining: 250,
          transport: 300,
          utilities: 90
        },
        investment: {
          groceries: 0,
          dining: 100,
          transport: 0,
          utilities: 0
        }
      },
      totals: {
        groceries: 1500,
        dining: 1050,
        transport: 750,
        utilities: 570
      }
    },
    {
      month: 'Dec',
      accounts: {
        checking: {
          groceries: 100,
          dining: 700,
          transport: 650,
          utilities: 480
        },
        savings: {
          groceries: 200,
          dining: 250,
          transport: 100,
          utilities: 50
        },
        investment: {
          groceries: 10,
          dining: 100,
          transport: 0,
          utilities: 0
        }
      },
      totals: {
        groceries: 1500,
        dining: 1050,
        transport: 750,
        utilities: 570
      }
    }
  ];

  // Color mapping for categories
  const CATEGORY_COLORS = {
    groceries: '#4f46e5',
    dining: '#10b981',
    transport: '#f59e0b',
    utilities: '#f43f5e'
  };

  const [selectedAccount, setSelectedAccount] = useState('all');
  const [selectedCategories, setSelectedCategories] = useState(['groceries', 'dining', 'transport', 'utilities']);


  // Process data based on filters
  const filteredData = useMemo(() => {
    return spendingData.map(monthData => {
      const result = { month: monthData.month };

      if (selectedAccount === 'all') {
        // Show totals for all accounts
        selectedCategories.forEach(category => {
          result[category] = monthData.totals[category];
        });
      } else {
        // Show data for selected account
        selectedCategories.forEach(category => {
          result[category] = monthData.accounts[selectedAccount]?.[category] || 0;
        });
      }

      return result;
    });
  }, [selectedAccount, selectedCategories]);

  return (
    <AccountsLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* AI Insights Section */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600">
              <FaRobot size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">AI Financial Advisor</h2>
          </div>

          {/* Prompt Input */}
          <div className="mb-6">
            <label htmlFor="ai-prompt" className="block text-sm font-medium text-gray-700 mb-2">
              Ask for specific analysis:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="ai-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g. 'How can I improve my savings rate?'"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700"
              />
              <button
                onClick={() => getAiAnalysis(prompt)}
                disabled={!prompt.trim() || isLoading}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50 hover:bg-indigo-700 transition-colors duration-200"
              >
                {isLoading ? 'Analyzing...' : (
                  <>
                    <FaPaperPlane /> Analyze
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Try: "Review my debt strategy" or "Investment suggestions"
            </p>
          </div>

          {/* AI Response */}
          {aiResponse && (
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <FaLightbulb className="text-yellow-400" /> Analysis for: "{aiResponse.prompt}"
                </h3>
                <span className="text-xs text-gray-500">{aiResponse.generatedAt}</span>
              </div>

              <div className="bg-indigo-50 p-4 rounded-lg mb-4 border-l-4 border-indigo-400">
                <p className="text-gray-800">{aiResponse.analysis}</p>
              </div>

              <h4 className="font-medium text-gray-800 mb-2">Recommended Actions:</h4>
              <ul className="space-y-2 pl-2">
                {aiResponse.actionItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <FaCheckCircle className="text-indigo-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Predefined Quick Prompts */}
          {!aiResponse && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Quick analysis prompts:</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "Optimize my budget",
                  "Debt payoff strategy",
                  "Investment review",
                  "Savings potential"
                ].map((quickPrompt) => (
                  <button
                    key={quickPrompt}
                    onClick={() => {
                      setPrompt(quickPrompt);
                      getAiAnalysis(quickPrompt);
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg text-sm transition-colors duration-200 border border-gray-200"
                  >
                    {quickPrompt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Motivational Summary */}
        <div className="bg-gradient-to-r from-sky-300 to-blue-300 dark:from-sky-600 dark:to-blue-600 p-6 rounded-xl shadow-lg text-white">
          <h2 className="text-xl font-bold mb-4">Your Financial Standing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <p className="text-sm opacity-90 mb-1">Categories Spending Less Than Average</p>
              <p className="text-2xl font-bold">
                {comparisonData.categorySpending.filter(x => x.status === 'lower').length}
                <span className="text-lg font-normal">/{comparisonData.categorySpending.length}</span>
              </p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <p className="text-sm opacity-90 mb-1">Financial Health Score</p>
              <p className="text-2xl font-bold flex items-center">
                {comparisonData.aiScore.user}
                <span className="text-sm font-normal ml-2">
                  ({comparisonData.aiScore.user > comparisonData.aiScore.allUsers ? 'Above' : 'Below'} average)
                </span>
              </p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <p className="text-sm opacity-90 mb-1">Savings Rate Percentile</p>
              <p className="text-2xl font-bold">
                Top {100 - Math.floor((comparisonData.savingsRate.user / comparisonData.savingsRate.topPercentile) * 100)}%
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm opacity-90 bg-white/10 p-3 rounded-lg">
            💪 Keep up the good work! You're making better financial decisions than most users in your demographic.
          </p>
        </div>


        {/* AI-Generated Monthly Summary */}
        <div className="bg-gradient-to-r from-sky-300 to-blue-300 dark:from-sky-600 dark:to-blue-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold mb-3">AI-Generated Financial Summary</h2>
              <p className="opacity-90 max-w-2xl leading-relaxed">
                Based on your June activity: Your savings rate improved by 2% from last month,
                but dining expenses increased by 18%. You're on track to complete your emergency
                fund goal 3 weeks early.
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <FaRobot size={24} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <p className="text-sm opacity-90 mb-1">Financial Health Score</p>
              <p className="text-2xl font-bold">82/100</p>
              <p className="text-xs mt-1 opacity-80">↑ 5 points from May</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <p className="text-sm opacity-90 mb-1">Savings Potential</p>
              <p className="text-2xl font-bold">R1,200/mo</p>
              <p className="text-xs mt-1 opacity-80">Through budget optimization</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <p className="text-sm opacity-90 mb-1">Goal Projection</p>
              <p className="text-2xl font-bold">2.1 years</p>
              <p className="text-xs mt-1 opacity-80">To financial independence</p>
            </div>
          </div>
        </div>

        {/* 2-Column Layout for Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Financial Sentiment</h2>

            <div className="flex flex-col items-center">
              {/* Gauge Chart */}
              <div style={chartStyle}>
                <GaugeChart
                  id="financial-sentiment-gauge"
                  nrOfLevels={4}
                  percent={sentimentToValue[currentSentiment]}
                  colors={["#ef4444", "#f59e0b", "#10b981", "#3b82f6"]}
                  arcWidth={0.3}
                  arcPadding={0.02}
                  cornerRadius={3}
                  textColor="#6b7280"
                  needleColor="#4b5563"
                  needleBaseColor="#4b5563"
                  formatTextValue={() => currentSentiment}
                  animate={true}
                  animateDuration={1000}
                />
              </div>

              {/* Legend */}
              <div className="flex justify-between w-full max-w-xs mt-4">
                {["Anxious", "Unstable", "Stable", "Confident"].map((label, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="w-4 h-4 rounded-full mb-1"
                      style={{
                        backgroundColor:
                          label === "Anxious" ? "#ef4444" :
                            label === "Unstable" ? "#f59e0b" :
                              label === "Stable" ? "#10b981" : "#3b82f6"
                      }}
                    ></div>
                    <span className="text-xs text-gray-600">{label}</span>
                  </div>
                ))}
              </div>

              {/* Insights */}
              <div className="mt-6 w-full">
                {currentSentiment === "Anxious" && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                    <p>Your savings rate is low while impulse spending is high.</p>
                    <p className="font-medium mt-1">Action: Set up spending limits and automate savings.</p>
                  </div>
                )}
                {currentSentiment === "Unstable" && (
                  <div className="p-3 rounded-lg bg-yellow-50 text-yellow-600 text-sm">
                    <p>Your burn rate is higher than recommended.</p>
                    <p className="font-medium mt-1">Action: Review recurring expenses and subscriptions.</p>
                  </div>
                )}
                {currentSentiment === "Stable" && (
                  <div className="p-3 rounded-lg bg-green-50 text-green-600 text-sm">
                    <p>Your finances are in good shape.</p>
                    <p className="font-medium mt-1">Action: Consider increasing investments for long-term goals.</p>
                  </div>
                )}
                {currentSentiment === "Confident" && (
                  <div className="p-3 rounded-lg bg-blue-50 text-blue-600 text-sm">
                    <p>Excellent financial health and goal progress!</p>
                    <p className="font-medium mt-1">Action: Explore advanced investment strategies.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8">
            <div className="flex flex-wrap justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Monthly Spending by Category</h2>

              <div className="flex flex-wrap gap-4 mt-4 sm:mt-0">
                {/* Account Selector */}
                <div>
                  <label htmlFor="account-select" className="block text-sm font-medium text-gray-700 mb-1">
                    Account
                  </label>
                  <select
                    id="account-select"
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="all">All Accounts</option>
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                    <option value="investment">Investment</option>
                  </select>
                </div>

                {/* Category Multi-select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categories
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(CATEGORY_COLORS).map(category => (
                      <button
                        key={category}
                        onClick={() => {
                          if (selectedCategories.includes(category)) {
                            setSelectedCategories(selectedCategories.filter(c => c !== category));
                          } else {
                            setSelectedCategories([...selectedCategories, category]);
                          }
                        }}
                        className={`px-3 py-1 text-sm rounded-lg flex items-center ${selectedCategories.includes(category)
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-gray-100 text-gray-700'}`}
                      >
                        {selectedCategories.includes(category) && (
                          <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: CATEGORY_COLORS[category] }}></span>
                        )}
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  stackOffset="expand" // Optional: use for percentage view
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`R${value.toLocaleString()}`, '']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  {selectedCategories.map(category => (
                    <Bar
                      key={category}
                      dataKey={category}
                      name={category.charAt(0).toUpperCase() + category.slice(1)}
                      stackId="a"
                      fill={CATEGORY_COLORS[category]}
                      radius={[4, 4, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Insights Panel */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-2">Insights</h3>
              {selectedAccount === 'all' ? (
                <p className="text-sm text-gray-700">
                  Showing combined spending across all accounts.
                  {selectedCategories.includes('dining') && (
                    <span className="text-indigo-600 font-medium"> Dining out accounts for {(1050 / 3825 * 100).toFixed(1)}% of total spending.</span>
                  )}
                </p>
              ) : (
                <p className="text-sm text-gray-700">
                  Showing spending only from your {selectedAccount} account.
                  {selectedAccount === 'checking' && selectedCategories.includes('groceries') && (
                    <span className="text-indigo-600 font-medium"> Groceries make up {(1200 / 3100 * 100).toFixed(1)}% of this account's spending.</span>
                  )}
                </p>
              )}
            </div>
          </div>

          {/* Income vs Expense Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Income vs Expenses</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('overall')}
                  className={`px-3 py-1 text-sm rounded-md ${viewMode === 'overall' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}
                >
                  Overall
                </button>
                <button
                  onClick={() => setViewMode('byAccount')}
                  className={`px-3 py-1 text-sm rounded-md ${viewMode === 'byAccount' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}
                >
                  By Account
                </button>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />

                  <Bar
                    dataKey="income"
                    fill={COLORS.income}
                    name="Money In"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="expense"
                    fill={COLORS.expense}
                    name="Money Out"
                    radius={[4, 4, 0, 0]}
                  />

                  <Line
                    type="monotone"
                    dataKey="avgIncome"
                    stroke={COLORS.averageIncome}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Avg Income"
                  />
                  <Line
                    type="monotone"
                    dataKey="avgExpense"
                    stroke={COLORS.averageExpense}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Avg Expense"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 flex justify-center gap-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm">Income</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm">Expenses</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2 border border-gray-300"></div>
                <span className="text-sm">Averages</span>
              </div>
            </div>
          </div>

          {/* Net Worth Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Account Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={accountData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={120}
                    paddingAngle={2}
                    onMouseEnter={(_, index) => setActivePieIndex(index)}
                    onMouseLeave={() => setActivePieIndex(null)}
                  >
                    {accountData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index === 0 ? COLORS.checking :
                            index === 1 ? COLORS.savings :
                              COLORS.investment
                        }
                        stroke="#fff"
                        strokeWidth={activePieIndex === index ? 3 : 1}
                        opacity={activePieIndex === null || activePieIndex === index ? 1 : 0.6}
                      />
                    ))}
                    <LabelList
                      dataKey="name"
                      position="outside"
                      formatter={(value) => `${value}`}
                      fill="#4b5563"
                      fontSize={12}
                    />
                  </Pie>
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xl font-bold text-gray-800"
                  >
                    R{totalNetWorth.toLocaleString()}
                  </text>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center gap-4 flex-wrap">
              {accountData.map((account, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{
                      backgroundColor:
                        index === 0 ? COLORS.checking :
                          index === 1 ? COLORS.savings :
                            COLORS.investment
                    }}
                  ></div>
                  <span className="text-sm">{account.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Radar Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Financial Health Radar</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarStats}>
                  <PolarGrid stroke={COLORS.grid} />
                  <PolarAngleAxis dataKey="axis" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="You"
                    dataKey="value"
                    stroke={COLORS.radar}
                    fill={COLORS.radar}
                    fillOpacity={0.4}
                    strokeWidth={2}
                  />

                  <Radar
                    name="Average"
                    dataKey="average"
                    stroke="#9ca3af"
                    fill="#9ca3af"
                    fillOpacity={0.2}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                  <Tooltip content={<CustomRadarTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              {radarStats.map((stat, index) => (
                <div key={index} className="bg-gray-50 p-2 rounded">
                  <p className="font-medium">{stat.axis}</p>
                  <p className={`${stat.value > stat.average ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.value > stat.average ? '↑' : '↓'} {Math.abs(stat.value - stat.average)}pts
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Trend Line Chart */}

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FaLightbulb className="text-blue-500" /> Financial Trend Analysis
                </h2>
                <p className="text-sm text-gray-500">Last 12 months with forecast</p>
              </div>

              {analysisData.behavioralTags.length > 0 && (
                <div className="flex items-center gap-2">
                  <FaTags className="text-gray-400" />
                  <div className="flex flex-wrap gap-1">
                    {analysisData.behavioralTags.map(tag => (
                      <span key={tag} className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700 font-medium">Current Top Category</p>
                <p className="text-xl font-bold capitalize">
                  {analysisData.categoryShift.current || 'N/A'}
                </p>
                {analysisData.categoryShift.changed && (
                  <p className="text-xs text-blue-600 mt-1">
                    Changed from {analysisData.categoryShift.previous}
                  </p>
                )}
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-700 font-medium">Next Month Forecast</p>
                <p className="text-xl font-bold">
                  R{analysisData.spendingForecast.next_month_forecast.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Based on {chartData.length} months of data
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-700 font-medium">Spending Trend</p>
                <p className="text-xl font-bold">
                  {analysisData.globalTrend.delta.slice(-1)[0] > 0 ? '↑ Increasing' : '↓ Decreasing'}
                </p>
                <p className="text-xs text-purple-600 mt-1">
                  Last change: R{Math.abs(analysisData.globalTrend.delta.slice(-1)[0]).toLocaleString()}
                </p>
              </div>
            </div>

           <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData}>
          {/* Grid and Axes */}
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
            label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            yAxisId="left"
            label={{ value: 'Spending (ZAR)', angle: -90, position: 'insideLeft' }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: 'Volatility', angle: 90, position: 'insideRight' }}
          />

          {/* Tooltip and Legend */}
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          {/* Total Spending Area */}
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="totalSpending"
            fill={COLORS.expense}
            stroke={COLORS.expense}
            fillOpacity={0.3}
            name="Total Spending"
          />

          {/* Top Categories Lines */}
          {  ['groceries', 'dining', 'transport', 'utilities'].map(category => (
            <Line
              key={category}
              yAxisId="left"
              type="monotone"
              dataKey={category}
              stroke={COLORS[category]}
              strokeWidth={2}
              dot={{ r: 2 }}
              name={category.charAt(0).toUpperCase() + category.slice(1)}
            />
          ))}

          {/* Forecast Line */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="forecast"
            stroke={COLORS.forecast}
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Forecast"
          />

          {/* Volatility Bars */}
          <Bar
            yAxisId="right"
            dataKey="volatility"
            fill={COLORS.volatility}
            opacity={0.4}
            name="Volatility"
            radius={[4, 4, 0, 0]}
          />

          {/* Anomaly Indicators */}
          {chartData.map((entry, index) =>
            entry.anomalies > 0 ? (
              <ReferenceLine
                key={index}
                x={entry.month}
                yAxisId="left"
                stroke={COLORS.anomaly}
                strokeWidth={2}
                label={{
                  value: `${entry.anomalies} ⚠️`,
                  position: 'top',
                  fill: COLORS.anomaly,
                  fontSize: 10,
                  fontWeight: 'bold'
                }}
              />
            ) : null
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>


            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-800 mb-2">Key Insights</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  {analysisData.globalTrend.delta.slice(-1)[0] > 0 && (
                    <li>• Spending increased last month by R{Math.abs(analysisData.globalTrend.delta.slice(-1)[0]).toLocaleString()}</li>
                  )}
                  {analysisData.anomalies.length > 0 && (
                    <li>• Detected {analysisData.anomalies.length} unusual transactions</li>
                  )}
                  {analysisData.categoryShift.changed && (
                    <li>• Spending focus shifted from {analysisData.categoryShift.previous} to {analysisData.categoryShift.current}</li>
                  )}
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-800 mb-2">Recommendations</h3>
                <ul className="text-sm text-gray-700 space-y-2">
                  {analysisData.behavioralTags.includes('Impulsive Spender') && (
                    <li>• Consider setting spending limits for discretionary categories</li>
                  )}
                  {analysisData.spendingForecast.next_month_forecast > chartData.slice(-1)[0]?.totalSpending && (
                    <li>• Projected spending increase next month - review upcoming expenses</li>
                  )}
                  {analysisData.volatility[Object.keys(analysisData.volatility).slice(-1)[0]] > 500 && (
                    <li>• High spending volatility detected - consider smoothing expenses</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AccountsLayout>
  );
};

export default InsightsPage;
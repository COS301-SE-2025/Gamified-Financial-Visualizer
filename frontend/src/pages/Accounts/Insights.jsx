import React, { useState, useMemo, useEffect } from 'react';
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
import CalendarHeatmap from 'react-calendar-heatmap';
import { format } from 'date-fns';

const BASE_URL = process.env.REACT_APP_API_URL || 'https://gamified-finance-backend-d2a3hnatafa7h8bw.southafricanorth-01.azurewebsites.net';
// const BASE_URL = "http://localhost:3000";
// const BASE_URL = "http://localhost:5000";

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
  utilities: '#f43f5e',

  avgIncome: '#1b3de5',     // alias of averageIncome
  avgExpense: '#f87171',    // alias of averageExpense
  you: '#4f46e5',           // for radar “You”
  avg: '#93c5fd',          // for radar “Average”
  total: "#2563eb",
  forecast: "#7c3aed",
  vol: "rgba(124,58,237,0.25)", // soft purple
  deltaPos: "#16a34a",
  deltaNeg: "#dc2626",
  cats: ["#059669", "#dc2626", "#d97706", "#0ea5e9", "#16a34a"]
};

const MONTHS_ORDER = Array.from({ length: new Date().getMonth() + 1 }, (_, i) =>
  new Date(2000, i, 1).toLocaleString('en-US', { month: 'short' })
);
const ZAR = (n) => `R${Number(n ?? 0).toLocaleString()}`;
const PALETTE = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#a855f7", "#f43f5e", "#84cc16", "#22c55e", "#14b8a6", "#eab308", "#f97316", "#8b5cf6", "#60a5fa", "#94a3b8"];

const AXIS_DESCRIPTIONS = {
  "Savings Rate": "Share of income left after expenses.",
  "Investing Rate": "Share of income allocated to investments.",
  "Smart Spending": "Lower impulse spending = higher score.",
  "Spending Discipline": "% of budgets staying at/under target.",
  "Cash Flow Stability": "Consistency of monthly net flow.",
  "Financial Health": "Composite score from your AI model."
};

const AXIS_ORDER = [
  "Savings Rate",
  "Investing Rate",
  "Smart Spending",
  "Spending Discipline",
  "Cash Flow Stability",
  "Financial Health"
];

function getAllAccounts(spendingData) {
  const set = new Set();
  (spendingData || []).forEach(m => {
    Object.keys(m.accounts || {}).forEach(a => set.add(a));
  });
  return Array.from(set).sort();
}

function getCategoryUnion(spendingData, account) {
  const set = new Set();
  (spendingData || []).forEach(m => {
    const src = account && account !== "all" ? (m.accounts?.[account] || {}) : (m.totals || {});
    Object.keys(src).forEach(c => set.add(c));
  });
  return Array.from(set).sort();
}

function pickTopCategories(spendingData, account = "all", limit = 6) {
  const totals = {};
  (spendingData || []).forEach(m => {
    const src = account && account !== "all" ? (m.accounts?.[account] || {}) : (m.totals || {});
    Object.entries(src).forEach(([cat, val]) => {
      totals[cat] = (totals[cat] || 0) + Number(val || 0);
    });
  });
  return Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([cat]) => cat);
}

// Build stacked series per month for selected account + categories
function buildCategorySeries(spendingData, selectedAccount, selectedCategories) {
  const monthsSorted = [...(spendingData || [])].sort(
    (a, b) => MONTHS_ORDER.indexOf(a.month) - MONTHS_ORDER.indexOf(b.month)
  );

  return monthsSorted.map(m => {
    const src = selectedAccount && selectedAccount !== "all"
      ? (m.accounts?.[selectedAccount] || {})
      : (m.totals || {});
    const row = { month: m.month };
    selectedCategories.forEach(cat => {
      row[cat] = Number(src[cat] || 0);
    });
    return row;
  });
}

function makeCategoryColors(categories) {
  const map = {};
  categories.forEach((c, i) => { map[c] = PALETTE[i % PALETTE.length]; });
  return map;
}

const init12 = () => Array.from({ length: 12 }, () => 0);

// Transform API -> recharts data
function buildMonthlyData(api, viewMode, selectedAccount) {
  if (!api) return [];

  const inc = init12();
  const exp = init12();

  // Sum user income/expense by month (optionally by account)
  (api.insights || []).forEach((r) => {
    const mIdx = Math.max(0, Math.min(11, parseInt(r.month, 10) - 1));
    if (viewMode === "byAccount" && selectedAccount && r.accountName !== selectedAccount) return;
    inc[mIdx] += Number(r.income || 0);
    exp[mIdx] += Number(r.expense || 0);
  });

  // Map global averages for that month
  const avgMap = new Map();
  (api.globalAvg?.monthlyAverages || []).forEach((m) => {
    avgMap.set(m.month, { avgIncome: m.avgIncome, avgExpense: m.avgExpense });
  });

  return MONTHS_ORDER.map((label, i) => {
    const mKey = String(i + 1);
    const avg = avgMap.get(mKey) || {};
    return {
      month: label,
      income: inc[i] || 0,
      expense: exp[i] || 0,
      avgIncome: avg.avgIncome ?? null,
      avgExpense: avg.avgExpense ?? null,
    };
  });
}

// Get unique account names
function getAccounts(api) {
  if (!api || !api.insights) return [];
  return Array.from(new Set((api.insights || []).map((i) => i.accountName))).sort();
}


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


const InsightsPage = () => {
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = userData?.id || null;

  const [prompt, setPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('overall'); // 'overall' or 'byAccount'
  const [activePieIndex, setActivePieIndex] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [account, setAccount] = React.useState("");
  const [wealth, setWealthData] = useState([]);
  const [categoryApi, setCategoryApi] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState("all");
  const [selectedCategories, setSelectedCategories] = useState([]); // will initialize after fetch
  const [radarData, setRadarData] = useState(null);
  const [sentiment, setSentimentData] = useState(null);
  const [trend, setTrendData] = useState(null);
  const [heatmapData, setHeatmapData] = useState(null);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/insights/transactions/${userId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // normalize numbers/strings
        data.insights = (data.insights || []).map(r => ({
          ...r,
          month: String(r.month),
          income: Number(r.income ?? 0),
          expense: Number(r.expense ?? 0),
        }));

        if (data.globalAvg?.monthlyAverages) {
          data.globalAvg.monthlyAverages = data.globalAvg.monthlyAverages.map(m => ({
            month: String(m.month),
            avgIncome: Number(m.avgIncome ?? 0),
            avgExpense: Number(m.avgExpense ?? 0),
          }));
        }
        setApiData(data);


        // fetch account wealth data
        const wealthRes = await fetch(`${BASE_URL}/api/insights/wealth/${userId}`);
        if (!wealthRes.ok) throw new Error(`HTTP ${wealthRes.status}`);
        const wealthData = await wealthRes.json();
        setWealthData(wealthData);

        // fetch category data
        const catRes = await fetch(`${BASE_URL}/api/insights/category/${userId}`);
        if (!catRes.ok) throw new Error(`HTTP ${catRes.status}`);
        const categoryData = await catRes.json();
        setCategoryApi(categoryData);

        // fetch radar insights
        const radarRes = await fetch(`${BASE_URL}/api/insights/radar/${userId}`);
        if (!radarRes.ok) throw new Error(`HTTP ${radarRes.status}`);
        const radarData = await radarRes.json();
        setRadarData(radarData);

        // fetch sentiment
        const monthId = new Date().getMonth() + 1; // 1-based month
        const sentimentRes = await fetch(`${BASE_URL}/api/insights/sentiment/user/${userId}/${monthId}`);
        if (!sentimentRes.ok) throw new Error(`HTTP ${sentimentRes.status}`);
        const sentimentData = await sentimentRes.json();
        setSentimentData(sentimentData);

        // fetch trend data
        const trendRes = await fetch(`${BASE_URL}/api/insights/trends/${userId}`);
        if (!trendRes.ok) throw new Error(`HTTP ${trendRes.status}`);
        const trendData = await trendRes.json();
        setTrendData(trendData);

        // fetch heatmap data
        const heatmapRes = await fetch(`${BASE_URL}/api/insights/transactions/heatmap/${userId}`);
        if (!heatmapRes.ok) throw new Error(`HTTP ${heatmapRes.status}`);
        const heatmap = await heatmapRes.json();
        setHeatmapData(heatmap);

      } catch (e) {
        console.error("Error fetching monthly data:", e);
      }
    })();
  }, [userId]);

  const [selectedCats, setSelectedCats] = React.useState(() => getTopCategories(trend, 3));
  const data = React.useMemo(() => buildTrendChartData(trend, selectedCats), [trend, selectedCats]);

  const deltas = data.map(d => d.delta).filter(v => typeof v === "number");
  const deltaMin = Math.min(0, ...deltas);
  const deltaMax = Math.max(0, ...deltas);

  // list all category options the API knows about (for a small toggle row)
  const allCats = React.useMemo(() => {
    const s = new Set();
    Object.values(trend?.categoryTrends || {}).forEach(cats =>
      Object.keys(cats || {}).forEach(c => s.add(c))
    );
    return Array.from(s);
  }, [trend]);

  // Initialize categories (top-N overall) after data arrives
  useEffect(() => {
    if (!categoryApi?.spendingData) return;
    setSelectedCategories(prev =>
      prev.length ? prev : pickTopCategories(categoryApi.spendingData, "all", 6)
    );
  }, [categoryApi]);

  // Keep category list valid when switching account
  useEffect(() => {
    if (!categoryApi?.spendingData || !selectedCategories.length) return;
    // ensure selected categories exist in new account context (fallback to topN)
    const union = getCategoryUnion(categoryApi.spendingData, selectedAccount);
    const stillValid = selectedCategories.filter(c => union.includes(c));
    if (stillValid.length) {
      setSelectedCategories(stillValid);
    } else {
      setSelectedCategories(pickTopCategories(categoryApi.spendingData, selectedAccount, 6));
    }
  }, [selectedAccount]); // eslint-disable-line react-hooks/exhaustive-deps

  const [showAvg, setShowAvg] = React.useState(true);
  const [viewPercent, setViewPercent] = React.useState(false); // if you already had percent view

  // If user enables "Compare to Global Avg", force absolute view for clarity
  React.useEffect(() => {
    if (showAvg && viewPercent) setViewPercent(false);
  }, [showAvg, viewPercent]);

  // Build chart rows + colors
  const filteredData = React.useMemo(() => {
    const months = categoryApi?.spendingData ?? [];
    return months.map((m) => {
      const row = { month: m.month, averages: {}, avgSelectedTotal: 0 };

      let userSelectedTotal = 0;
      selectedCategories.forEach((cat) => {
        // User values (by account or all)
        const userVal =
          selectedAccount === "all"
            ? Number(m.totals?.[cat] ?? 0)
            : Number(m.accounts?.[selectedAccount]?.[cat] ?? 0);

        // Global average for this category in this month
        const avgVal = Number(m.averages?.[cat] ?? 0);

        row[cat] = userVal;
        row.averages[cat] = avgVal;

        userSelectedTotal += userVal;
        row.avgSelectedTotal += avgVal;
      });

      // Optional: percent view (only when NOT showing global avg line)
      if (viewPercent && !showAvg) {
        const denom = userSelectedTotal || 1;
        selectedCategories.forEach((cat) => {
          row[cat] = row[cat] / denom; // normalize bars to 0..1
        });
      }

      return row;
    });
  }, [categoryApi, selectedAccount, selectedCategories, viewPercent, showAvg]);


  const CATEGORY_COLORS = useMemo(() => makeCategoryColors(selectedCategories), [selectedCategories]);
  const accounts = useMemo(() => getAccounts(apiData), [apiData]);

  const SENTIMENT_ORDER = ["Anxious", "Unstable", "Stable", "Confident"];

  // center the needle in each colored band
  const sentimentToPercent = (s) => {
    const i = SENTIMENT_ORDER.indexOf(s);
    return i === -1 ? 0.5 : (i + 0.5) / SENTIMENT_ORDER.length; // 0..1
  };
  const monthlyData = useMemo(() => {
    // fallback to [] to avoid undefined
    return buildMonthlyData(apiData, viewMode, account || null) || [];
  }, [apiData, viewMode, account]);


  const radarStats = useMemo(() => {
    const items = radarData?.radar || [];
    const byAxis = new Map(items.map(p => [p.axis, p]));
    // enforce order + add descriptions
    return AXIS_ORDER.map(axis => {
      const row = byAxis.get(axis) || { user: 0, average: 0 };
      return {
        axis,
        user: Number(row.user ?? 0),
        average: Number(row.average ?? 0),
        description: AXIS_DESCRIPTIONS[axis] || ""
      };
    });
  }, [radarData]);


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


  // Polished tooltip
  function ChartTooltip({ active, payload, label }) {
    if (!active || !payload || !payload.length) return null;
    const rows = payload
      .filter((p) => p.value != null)
      .map((p) => ({
        name: p.name || p.dataKey,
        value: ZAR(p.value),
        color: p.color,
      }));

    return (
      <div className="rounded-xl border border-gray-200 bg-white/90 backdrop-blur px-3 py-2 shadow">
        <div className="text-xs text-gray-500 mb-1">{label}</div>
        {rows.map((r) => (
          <div key={r.name} className="flex items-center gap-2 text-sm">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: r.color }} />
            <span className="text-gray-600">{r.name}</span>
            <span className="ml-auto font-medium text-gray-800">{r.value}</span>
          </div>
        ))}
      </div>
    );
  }

  // Custom tooltip components
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <p className="font-bold">{data.name}</p>
          <p className="text-sm">Balance: R{data.value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  const CustomRadarTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;
    const { axis, user, average, description } = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200 text-sm">
        <p className="font-bold">{axis}</p>
        <div className="grid grid-cols-2 gap-2 mt-1">
          <div>
            <p className="text-indigo-600">You: {Math.round(user)}/100</p>
            <p className="text-gray-500">Avg: {Math.round(average)}/100</p>
          </div>
          <div className="border-l pl-2">
            <p className="text-gray-600 text-xs">{description || ""}</p>
          </div>
        </div>
      </div>
    );
  };

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const ZAR = v => `R${Number(v ?? 0).toLocaleString()}`;

  function getTopCategories(trendApi, k = 3) {
    if (!trendApi?.categoryTrends) return [];
    const totals = {};
    for (const month of Object.keys(trendApi.categoryTrends)) {
      const cats = trendApi.categoryTrends[month] || {};
      Object.entries(cats).forEach(([cat, val]) => {
        totals[cat] = (totals[cat] || 0) + Number(val || 0);
      });
    }
    return Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, k)
      .map(([cat]) => cat);
  }

  function buildTrendChartData(trendApi, selectedCategories = []) {
    if (!trendApi?.globalTrend) return [];
    const { months, spending, delta } = trendApi.globalTrend;
    const catTrends = trendApi.categoryTrends || {};
    const anomalies = trendApi.anomalies || [];
    const vol = trendApi.volatility || {};
    const forecastValue = trendApi.spendingForecast?.next_month_forecast ?? null;

    const anomalyCount = Object.fromEntries(months.map(m => [m, 0]));
    anomalies.forEach(a => { if (anomalyCount[a.month] != null) anomalyCount[a.month] += 1; });

    const rows = months.map((m, i) => {
      const base = {
        month: m,
        totalSpending: Number(spending[i] || 0),
        delta: Number(delta?.[i] ?? 0),        // <— add delta
        volatility: Number(vol[m] || 0),       // <— already present
        anomalies: anomalyCount[m] || 0
      };
      selectedCategories.forEach(cat => (base[cat] = Number(catTrends[m]?.[cat] || 0)));
      return base;
    });

    if (forecastValue != null && months.length) {
      rows.push({
        month: "Next",
        totalSpending: null,
        forecast: Number(forecastValue),
        delta: null,           // <— no delta for forecast stub
        volatility: null,
        anomalies: 0,
        ...Object.fromEntries(selectedCategories.map(c => [c, null]))
      });
    }
    return rows;
  }

  const currencyTick = (v) => `R${Number(v).toLocaleString()}`;
  const tooltipFormatter = (value, name) => [ZAR(value), name];


  const [mode, setMode] = useState("count"); // 'count' | 'amount'

  const startOfYear = useMemo(
    () => {
      const now = new Date();
      const yearAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      yearAgo.setMonth(yearAgo.getMonth() - 12);
      return yearAgo;
    },
    []
  );
  const today = useMemo(() => new Date(), []);

  // Build the values array CalendarHeatmap expects
  // (If your source is different, normalize to this shape)
  const values = useMemo(() => {
    // Accept only arrays for this mapper
    if (!Array.isArray(heatmapData)) return [];

    // Helper: normalize to local YYYY-MM-DD
    const toLocalYMD = (d) => {
      const dt = new Date(d);              // handles ISO with Z
      const yyyy = dt.getFullYear();
      const mm = String(dt.getMonth() + 1).padStart(2, "0");
      const dd = String(dt.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    };

    // Aggregate per day in case API returns multiple rows for same date
    const byDay = new Map();
    for (const row of heatmapData) {
      const key = toLocalYMD(row.date);
      const count = Number(row.transactions ?? 0);
      const amount = Number(row.amount ?? 0);

      const prev = byDay.get(key) || { date: key, count: 0, amount: 0 };
      prev.count += isFinite(count) ? count : 0;
      prev.amount += isFinite(amount) ? amount : 0;
      byDay.set(key, prev);
    }

    return [...byDay.values()].sort((a, b) => a.date.localeCompare(b.date));
  }, [heatmapData]);

  // Thresholds per mode (tweak to taste)
  const thresholds = useMemo(
    () => (mode === "amount" ? [0, 250, 1000, 2500, 5000] : [0, 2, 5, 10, 15]),
    [mode]
  );

  // Tailwind-driven fill for each day cell
  const fillClassFor = (metric) =>
    metric <= thresholds[1]
      ? "fill-blue-100"
      : metric <= thresholds[2]
        ? "fill-blue-300"
        : metric <= thresholds[3]
          ? "fill-blue-400"
          : "fill-blue-600";


  // state + ref near top of component
  const heatmapRef = React.useRef(null);
  const [tip, setTip] = React.useState({ show: false, text: "", x: 0, y: 0 });

  const showTip = (e, text) => {
    const box = heatmapRef.current?.getBoundingClientRect();
    const x = e.clientX - (box?.left ?? 0) + 12; // offset from cursor
    const y = e.clientY - (box?.top ?? 0) + 12;
    setTip({ show: true, text, x, y });
  };
  const hideTip = () => setTip(t => ({ ...t, show: false }));

  const transformDayElement = (element, value) => {
    if (!value) {
      return React.cloneElement(
        element,
        {
          className:
            "fill-gray-100 hover:stroke-indigo-600 hover:stroke-2 transition cursor-default",
          onMouseLeave: hideTip,
        },
        <>
          <title></title>
          {element.props.children}
        </>
      );
    }

    const metric = mode === "amount" ? Number(value.amount ?? 0) : Number(value.count ?? 0);
    const label = new Date(value.date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const tooltipText =
      mode === "amount"
        ? `${label}: R${metric.toLocaleString()} spent (${Number(value.count ?? 0)} tx)`
        : `${label}: ${metric} transactions (R${Number(value.amount ?? 0).toLocaleString()} spent)`;

    const cls = `transition hover:stroke-indigo-600 hover:stroke-2 ${metric ? "cursor-pointer" : "cursor-default"
      } ${fillClassFor(metric)}`;

    return React.cloneElement(
      element,
      {
        className: cls,
        onMouseEnter: (e) => showTip(e, tooltipText),
        onMouseMove: (e) => showTip(e, tooltipText),
        onMouseLeave: hideTip,
      },
      <>
        {/* keep native tooltip as a fallback if you like */}
        <title>{tooltipText}</title>
        {element.props.children}
      </>
    );
  };


  // state near top of component
  const [catOpen, setCatOpen] = useState(false);
  const [catQuery, setCatQuery] = useState("");

  // derive list
  const allCategories = React.useMemo(
    () => getCategoryUnion(categoryApi?.spendingData || [], selectedAccount),
    [categoryApi, selectedAccount]
  );

  const filteredCategories = React.useMemo(() => {
    const q = catQuery.trim().toLowerCase();
    return q ? allCategories.filter(c => c.toLowerCase().includes(q)) : allCategories;
  }, [allCategories, catQuery]);

  // helpers
  const toggleCat = (cat) =>
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );

  const selectAll = () => setSelectedCategories(filteredCategories);
  const clearAll = () => setSelectedCategories([]);

  const totalNetWorth = wealth?.netWorth ?? 0;


  // Show loading with details about missing data
  if (!apiData || !categoryApi || !radarData || !sentiment || !wealth || !trend || !heatmapData) {
    const missing = [
      !apiData && "Transactions",
      !categoryApi && "Category Data",
      !radarData && "Radar Insights",
      !sentiment && "Sentiment",
      !trend && "Trend Data",
      !wealth && "Wealth Data",
      !heatmapData && "Heatmap Data"
    ].filter(Boolean);

    return (
      <AccountsLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-gray-500 text-center">
            <div>Loading insights...</div>
            <div className="mt-2 text-sm">
              Missing: {missing.join(", ")}
            </div>
          </div>
        </div>
      </AccountsLayout>
    );
  }

  return (
    <AccountsLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 dark:bg-gray-900">
        {/* AI Insights Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-indigo-100 p-3 rounded-lg text-indigo-600">
              <FaRobot size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">AI Financial Advisor</h2>
          </div>

          {/* Prompt Input */}
          <div className="mb-6">
            <label htmlFor="ai-prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Try: "Review my debt strategy" or "Investment suggestions"
            </p>
          </div>

          {/* AI Response */}
          {aiResponse && (
            <div className="border-t pt-4 mt-4 border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <FaLightbulb className="text-yellow-400 dark:text-yellow-500" /> Analysis for: "{aiResponse.prompt}"
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">{aiResponse.generatedAt}</span>
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
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick analysis prompts:</h4>
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
                    className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-1.5 rounded-lg text-sm transition-colors duration-200 border border-gray-200 dark:border-gray-600"
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

          {/* Sentiment */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-gray-800">Financial Sentiment</h2>
              {sentiment?.clusterLabel && (
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                  {sentiment.clusterLabel}
                </span>
              )}
            </div>


            <div className="flex flex-col items-center">
              {/* Gauge */}
              <div style={{ width: 280, maxWidth: "100%" }}>
                <GaugeChart
                  id="financial-sentiment-gauge"
                  nrOfLevels={4}
                  percent={sentimentToPercent(sentiment?.sentiment)}
                  colors={["#ef4444", "#f59e0b", "#10b981", "#3b82f6"]} // matches SENTIMENT_ORDER left→right
                  arcWidth={0.3}
                  arcPadding={0.02}
                  cornerRadius={3}
                  textColor="#6b7280"
                  needleColor="#4b5563"
                  needleBaseColor="#4b5563"
                  formatTextValue={() => sentiment?.sentiment ?? "—"}
                  animate
                  animateDuration={900}
                />
              </div>

              {/* Legend */}
              <div className="flex justify-between w-full max-w-xs mt-4">
                {SENTIMENT_ORDER.map((label) => (
                  <div key={label} className="flex flex-col items-center">
                    <div
                      className="w-4 h-4 rounded-full mb-1"
                      style={{
                        backgroundColor:
                          label === "Anxious" ? "#ef4444" :
                            label === "Unstable" ? "#f59e0b" :
                              label === "Stable" ? "#10b981" :
                                "#3b82f6"
                      }}
                    />
                    <span className="text-xs text-gray-600">{label}</span>
                  </div>
                ))}
              </div>

              {/* Summary */}
              {sentiment?.summaryText && (
                <p className="mt-4 text-sm text-gray-700 text-center max-w-2xl">{sentiment.summaryText}</p>
              )}

              {/* Quick highlights (first 3) */}
              {!!sentiment?.insights?.length && (
                <ul className="mt-4 text-sm text-gray-700 space-y-1">
                  {sentiment.insights.slice(0, 3).map((i, idx) => (
                    <li key={idx}>• {i}</li>
                  ))}
                </ul>
              )}

              {/* Adaptive callout based on sentiment */}
              <div className="mt-6 w-full">
                {sentiment?.sentiment === "Anxious" && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                    <p>Your savings rate is low while impulse spending is high.</p>
                    <p className="font-medium mt-1">Action: Set up spending limits and automate savings.</p>
                  </div>
                )}
                {sentiment?.sentiment === "Unstable" && (
                  <div className="p-3 rounded-lg bg-yellow-50 text-yellow-600 text-sm">
                    <p>Your burn rate is higher than recommended.</p>
                    <p className="font-medium mt-1">Action: Review recurring expenses and subscriptions.</p>
                  </div>
                )}
                {sentiment?.sentiment === "Stable" && (
                  <div className="p-3 rounded-lg bg-green-50 text-green-600 text-sm">
                    <p>Your finances are in good shape.</p>
                    <p className="font-medium mt-1">Action: Consider increasing investments for long-term goals.</p>
                  </div>
                )}
                {sentiment?.sentiment === "Confident" && (
                  <div className="p-3 rounded-lg bg-blue-50 text-blue-600 text-sm">
                    <p>Excellent financial health and goal progress!</p>
                    <p className="font-medium mt-1">Action: Explore advanced investment strategies.</p>
                  </div>
                )}
              </div>

              {/* Optional: show a few tips */}
              {!!sentiment?.tips?.length && (
                <div className="mt-4 w-full">
                  <h4 className="text-sm font-semibold text-gray-800 mb-1">Tips</h4>
                  <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
                    {sentiment.tips.slice(0, 3).map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </div>
              )}
            </div>

          </div>

          {/* Monthly Spending by Category Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-8">
            <div className="flex flex-wrap justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Monthly Spending by Category</h2>

              <div className="flex flex-wrap gap-3 items-center">
                {/* Account select (as you had) */}
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
                    {accounts.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>

                {/* Percent view toggle (disabled when avg on) */}
                <div className="opacity-100">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scale</label>
                  <div className="inline-flex rounded-md overflow-hidden border border-gray-300">
                    <button
                      type="button"
                      disabled={!showAvg}
                      onClick={() => setViewPercent(false)}
                      className={`px-3 py-1.5 text-sm ${!viewPercent ? "bg-indigo-100 text-indigo-700" : "bg-white text-gray-700"} ${showAvg ? "opacity-50 cursor-not-allowed" : ""}`}
                      title={showAvg ? "Disable Global Avg to use % view" : ""}
                    >
                      Amount
                    </button>
                    <button
                      type="button"
                      disabled={!showAvg}
                      onClick={() => setViewPercent(true)}
                      className={`px-3 py-1.5 text-sm border-l border-gray-300 ${viewPercent ? "bg-indigo-100 text-indigo-700" : "bg-white text-gray-700"} ${showAvg ? "opacity-50 cursor-not-allowed" : ""}`}
                      title={showAvg ? "Disable Global Avg to use % view" : ""}
                    >
                      %
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Multi-select (collapsible) */}
            <div className="w-full">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Categories
                </label>
                <button
                  type="button"
                  onClick={() => setCatOpen(v => !v)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                  aria-expanded={catOpen}
                  aria-controls="category-panel"
                >
                  {catOpen ? "Hide" : "Show"} ({selectedCategories.length} selected)
                  <svg
                    className={`h-4 w-4 transition-transform ${catOpen ? "rotate-180" : ""}`}
                    viewBox="0 0 20 20" fill="currentColor"
                  >
                    <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                  </svg>
                </button>
              </div>

              {/* Collapsible panel */}
              <div
                id="category-panel"
                className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out
                ${catOpen ? "max-h-[480px] opacity-100 mt-3" : "max-h-0 opacity-0"}`}
              >
                {/* Controls */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <button
                    type="button"
                    onClick={selectAll}
                    className="px-2.5 py-1.5 text-xs rounded-md bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                  >
                    Select all (filtered)
                  </button>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="px-2.5 py-1.5 text-xs rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    Clear
                  </button>
                </div>

                {/* Chips */}
                <div className="flex flex-wrap gap-2 max-w-[640px]">
                  {filteredCategories.map((category) => {
                    const active = selectedCategories.includes(category);
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => toggleCat(category)}
                        className={`px-3 py-1 text-sm rounded-lg flex items-center
                        ${active ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-700"}`}
                        title={category}
                      >
                        <span
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: CATEGORY_COLORS[category] || "#ddd" }}
                        />
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </button>
                    );
                  })}
                  {filteredCategories.length === 0 && (
                    <span className="text-sm text-gray-500">No categories match your search.</span>
                  )}
                </div>
              </div>

              {/* Optional: compact summary row when collapsed */}
              {!catOpen && selectedCategories.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                  <span className="opacity-70">Selected:</span>
                  {selectedCategories.slice(0, 6).map(c => (
                    <span key={c} className="px-2 py-0.5 rounded-full bg-gray-100">
                      {c}
                    </span>
                  ))}
                  {selectedCategories.length > 6 && (
                    <span className="opacity-70">+{selectedCategories.length - 6} more</span>
                  )}
                </div>
              )}
            </div>

            {/* Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  {...(viewPercent && !showAvg ? { stackOffset: "expand" } : {})}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" />
                  <YAxis
                    tickFormatter={(v) =>
                      viewPercent && !showAvg
                        ? `${Math.round(Number(v) * 100)}%`
                        : ZAR(v)
                    }
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload || !payload.length) return null;
                      const row = filteredData.find((d) => d.month === label);
                      if (!row) return null;

                      const isPct = viewPercent && !showAvg;

                      return (
                        <div className="rounded-xl border border-gray-200 bg-white/90 backdrop-blur px-3 py-2 shadow">
                          <div className="text-xs text-gray-500 mb-1">{label}</div>

                          {payload
                            // only show your category bars (ignore any Line or other series)
                            .filter((p) => selectedCategories.includes(p.dataKey))
                            .map((p) => {
                              const cat = p.dataKey;
                              const userVal = Number(p.value ?? 0);
                              const avgVal = Number(row.averages?.[cat] ?? 0);

                              // if percent view, convert avg to % of avgSelectedTotal
                              const avgPct =
                                row.avgSelectedTotal > 0 ? (avgVal / row.avgSelectedTotal) * 100 : 0;

                              const userDisplay = isPct
                                ? `${Math.round(userVal * 100)}%`
                                : ZAR(userVal);
                              const avgDisplay = isPct
                                ? `${Math.round(avgPct)}%`
                                : ZAR(avgVal);

                              return (
                                <div key={cat} className="flex items-center gap-2 text-sm">
                                  <span
                                    className="inline-block h-2 w-2 rounded-full"
                                    style={{ background: p.color }}
                                  />
                                  <span className="text-gray-600">
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                  </span>

                                  <span className="ml-auto font-medium text-gray-800">
                                    {userDisplay}
                                  </span>

                                  {/* Global average next to user amount */}
                                  <span className="ml-2 text-xs text-gray-500">
                                    Avg: {avgDisplay}
                                  </span>
                                </div>
                              );
                            })}
                        </div>
                      );
                    }}
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    }}
                  />

                  <Legend />

                  {/* User stacked bars (selected categories) */}
                  {selectedCategories.map((category) => (
                    <Bar
                      key={category}
                      dataKey={category}
                      name={category.charAt(0).toUpperCase() + category.slice(1)}
                      stackId="user"
                      fill={CATEGORY_COLORS[category]}
                      radius={[4, 4, 0, 0]}
                      isAnimationActive={false}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Legend hint */}
            {showAvg && (
              <div className="mt-3 text-xs text-gray-500">
                The dashed line shows the global average total for your selected categories each month.
              </div>
            )}
          </div>

          {/* Income vs Expense Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 className="text-xl font-bold text-gray-800">Income vs Expenses</h2>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("overall")}
                  className={`px-3 py-1 text-sm rounded-md ${viewMode === "overall"
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-gray-100 text-gray-700"
                    }`}
                >
                  Overall
                </button>
                <button
                  onClick={() => setViewMode("byAccount")}
                  className={`px-3 py-1 text-sm rounded-md ${viewMode === "byAccount"
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-gray-100 text-gray-700"
                    }`}
                >
                  By Account
                </button>

                {viewMode === "byAccount" && (
                  <select
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    className="ml-2 px-3 py-1 text-sm rounded-md border border-gray-300 bg-white"
                  >
                    <option value="">All accounts</option>
                    {accounts.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyData} margin={{ top: 16, right: 20, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7280" }} />
                  <YAxis tickFormatter={(v) => `R${Number(v).toLocaleString()}`} tick={{ fontSize: 12, fill: "#6b7280" }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />

                  <Bar dataKey="income" name="Money In" fill={COLORS.income} radius={[6, 6, 0, 0]} maxBarSize={30} />
                  <Bar dataKey="expense" name="Money Out" fill={COLORS.expense} radius={[6, 6, 0, 0]} maxBarSize={30} />

                  {/* use avgIncome/avgExpense keys that match COLORS */}
                  <Line type="monotone" dataKey="avgIncome" name="Avg Income" stroke={COLORS.avgIncome} strokeDasharray="6 6" strokeWidth={2} dot={false} connectNulls />
                  <Line type="monotone" dataKey="avgExpense" name="Avg Expense" stroke={COLORS.avgExpense} strokeDasharray="6 6" strokeWidth={2} dot={false} connectNulls />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-4">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full mr-2" style={{ background: COLORS.income }} />
                <span className="text-sm">Income</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full mr-2" style={{ background: COLORS.expense }} />
                <span className="text-sm">Expenses</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full mr-2 border border-gray-300" style={{ background: "#fff" }} />
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
                    data={wealth?.breakdown ?? []}
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
                    {wealth?.breakdown.map((entry, index) => (
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
              {wealth?.breakdown.map((account, index) => (
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
                    dataKey="user"
                    stroke={COLORS.you}
                    fill={COLORS.you}
                    fillOpacity={0.35}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Average"
                    dataKey="average"
                    stroke={COLORS.avg}
                    fill={COLORS.avg}
                    fillOpacity={0.2}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                  <Legend />
                  <Tooltip content={<CustomRadarTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Tiny KPI grid */}
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              {radarStats.map((stat, i) => (
                <div key={i} className="bg-gray-50 p-2 rounded">
                  <p className="font-medium">{stat.axis}</p>
                  <p className={`${stat.user > stat.average ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.user > stat.average ? '↑' : '↓'} {Math.abs(Math.round(stat.user - stat.average))}pts
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Trend Line Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Spending Trend</h2>
                <p className="text-sm text-gray-500">
                  Monthly trends this year so far, including spending volatility and month-over-month changes.
                </p>

                <div className="bg-indigo-50 rounded-lg px-3 py-2 text-indigo-700 text-xs font-medium inline-block mb-2">
                  Your spending characteristics: <span className="font-semibold">{trend?.behavioralTags.join(", ")}</span>
                </div>                </div>
            </div>

            {/* simple category toggles (optional) */}
            <div className="flex flex-wrap gap-2">
              {allCats.slice(0, 8).map((cat) => {
                const active = selectedCats.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() =>
                      setSelectedCats(
                        active ? selectedCats.filter(c => c !== cat)
                          : [...selectedCats, cat].slice(-5) // cap to 5 for clarity
                      )
                    }
                    className={`px-2 py-1 rounded-md text-xs ${active ? "bg-indigo-100 text-indigo-700"
                      : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 12, right: 24, left: 8, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7280" }} />
                  {/* Left axis: spending */}
                  <YAxis yAxisId="left" tickFormatter={currencyTick} tick={{ fontSize: 12, fill: "#6b7280" }} />
                  {/* Right axis (visible): volatility */}
                  <YAxis
                    yAxisId="rightVol"
                    orientation="right"
                    tickFormatter={currencyTick}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                  />
                  {/* Hidden right axis for delta so ticks don't appear */}
                  <YAxis
                    yAxisId="rightDelta"
                    orientation="right"
                    domain={[deltaMin * 1.1, deltaMax * 1.1]}
                    hide
                  />

                  <Tooltip
                    formatter={tooltipFormatter}
                    content={({ active, payload, label }) => {
                      if (!active || !payload || !payload.length) return null;
                      // Find anomalies/categories for this month
                      const row = data.find(d => d.month === label);
                      return (
                        <div className="rounded-xl border border-gray-200 bg-white/90 backdrop-blur px-3 py-2 shadow">
                          <div className="text-xs text-gray-500 mb-1">{label}</div>
                          {payload
                            .filter(p => p.value != null)
                            .map((p, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <span className="inline-block h-2 w-2 rounded-full" style={{ background: p.color }} />
                                <span className="text-gray-600">{p.name || p.dataKey}</span>
                                <span className="ml-auto font-medium text-gray-800">{ZAR(p.value)}</span>
                              </div>
                            ))}
                          {/* Show anomalies if present */}
                          {row?.anomalies > 0 && (
                            <div className="mt-2 text-xs text-red-600 flex items-center gap-1">
                              <FaTimesCircle className="inline-block" /> {row.anomalies} anomaly{row.anomalies > 1 ? "ies" : "y"} detected <br />
                              {/* Show highest anomaly category for this month */}
                              {Array.isArray(trend?.anomalies) && (
                                (() => {
                                  // Find anomalies for this month
                                  const anomaliesForMonth = trend.anomalies.filter(a => a.month === label);
                                  if (anomaliesForMonth.length) {
                                    // Find the anomaly with the highest value
                                    const highest = anomaliesForMonth.reduce((max, curr) =>
                                      (curr.value ?? 0) > (max.value ?? 0) ? curr : max, anomaliesForMonth[0]);
                                    return (
                                      <span>
                                        &nbsp;Highest anomaly category: <span className="font-semibold">{highest.category}</span>
                                      </span>
                                    );
                                  }
                                  return null;
                                })()
                              )}
                            </div>
                          )}

                          {/* Show top categories for this month */}
                          {selectedCats.length > 0 && (
                            <div className="mt-2 text-xs text-gray-600">
                              <span className="font-medium">Categories:</span>{" "}
                              {selectedCats.map(cat => (
                                <span key={cat} className="inline-block mr-2">
                                  {cat}: <span className="font-semibold">{ZAR(row?.[cat])}</span>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }}
                  />
                  <Legend />

                  {/* Volatility bars (soft background) */}
                  <Bar
                    yAxisId="rightVol"
                    dataKey="volatility"
                    name="Volatility"
                    fill={COLORS.vol}
                    radius={[4, 4, 0, 0]}
                    barSize={18}
                  />

                  {/* Delta bars (thin, red/green around zero) */}
                  <Bar
                    yAxisId="rightVol"
                    dataKey="delta"
                    name="MoM Change"
                    barSize={8}
                  >
                    {data.map((d, i) => (
                      <Cell key={`cell-${i}`} fill={(d.delta ?? 0) >= 0 ? COLORS.deltaPos : COLORS.deltaNeg} />
                    ))}
                  </Bar>
                  {/* zero baseline for delta */}
                  <ReferenceLine y={0} yAxisId="rightDelta" stroke="#9ca3af" strokeDasharray="4 4" />

                  {/* Total spending line (bold) */}
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="totalSpending"
                    name="Total Spending"
                    stroke={COLORS.total}
                    strokeWidth={3}
                    dot={{ r: 3 }}
                    connectNulls
                    isAnimationActive={false}
                  />

                  {/* Forecast (dashed, only on 'Next') */}
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="forecast"
                    name="Forecast"
                    stroke={COLORS.forecast}
                    strokeDasharray="6 6"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    connectNulls
                    isAnimationActive={false}
                  />

                  {/* Optional: top categories as thin lines */}
                  {selectedCats.map((cat, i) => (
                    <Line
                      key={cat}
                      yAxisId="left"
                      type="monotone"
                      dataKey={cat}
                      name={cat}
                      stroke={COLORS.cats[i % COLORS.cats.length]}
                      strokeWidth={1.75}
                      dot={false}
                      connectNulls
                      isAnimationActive={false}
                    />
                  ))}
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 text-xs text-gray-500">
              Delta = change vs last month. Volatility = spread of your expense amounts in that month.
            </div>

            {/* Small footnote with auto-insights */}
            <div className="mt-4 text-sm text-gray-600">
              <ul className="list-disc pl-5 space-y-1">
                {!!trend?.categoryShift?.changed && (
                  <li>
                    Top category shifted from <span className="font-medium">{trend.categoryShift.previous}</span> to{" "}
                    <span className="font-medium">{trend.categoryShift.current}</span>.
                  </li>
                )}
                {Array.isArray(trend?.anomalies) && trend.anomalies.length > 0 && (
                  <li>Detected {trend.anomalies.length} unusual transactions this year so far.</li>
                )}
                {!!trend?.spendingForecast?.next_month_forecast && (
                  <li>
                    Next-month forecast: <span className="font-medium">
                      R{Number(trend.spendingForecast.next_month_forecast).toLocaleString()}
                    </span>.
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Heatmap Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 lg:col-span-2">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Transactions Heatmap</h2>
                <p className="text-sm text-gray-500">
                  Visualizing your daily transaction activity over the past year — the darker the shade, the busier the day.
                </p>
              </div>

              {/* Mode toggle */}
              <div className="inline-flex rounded-md border border-gray-300 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setMode("count")}
                  className={`px-3 py-1.5 text-sm ${mode === "count"
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-white text-gray-700"
                    }`}
                >
                  Count
                </button>
                <button
                  type="button"
                  onClick={() => setMode("amount")}
                  className={`px-3 py-1.5 text-sm border-l border-gray-300 ${mode === "amount"
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-white text-gray-700"
                    }`}
                >
                  Amount
                </button>
              </div>
            </div>

            {/* Heatmap */}
            <div className="overflow-x-auto pb-2">
              <div className="min-w-[680px]">
                <CalendarHeatmap
                  startDate={startOfYear}
                  endDate={today}
                  values={values}
                  showWeekdayLabels
                  gutterSize={2}
                  classForValue={() => ""}
                  transformDayElement={transformDayElement}
                  weekdayLabelClass="text-[0.625rem] text-gray-500" // SIZE DOES NOT WANT TO CHANGE :()
                  monthLabelClass="text-[0.625rem] text-gray-500"
                />
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center flex-wrap gap-2 text-xs text-gray-600">
              <span className="opacity-70">Less</span>
              <span className="inline-block w-3 h-3 rounded bg-blue-100 border border-gray-200" />
              <span className="inline-block w-3 h-3 rounded bg-blue-300 border border-gray-200" />
              <span className="inline-block w-3 h-3 rounded bg-blue-400 border border-gray-200" />
              <span className="inline-block w-3 h-3 rounded bg-blue-600 border border-gray-200" />
              <span className="opacity-70">More</span>

              <span className="ml-3 opacity-60">
                {mode === "amount"
                  ? `≤ ${ZAR(thresholds[1])}, ≤ ${ZAR(thresholds[2])}, ≤ ${ZAR(
                    thresholds[3]
                  )}, > ${ZAR(thresholds[3])}`
                  : `≤ ${thresholds[1]}, ≤ ${thresholds[2]}, ≤ ${thresholds[3]}, > ${thresholds[3]}`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </AccountsLayout >
  );
};

export default InsightsPage;
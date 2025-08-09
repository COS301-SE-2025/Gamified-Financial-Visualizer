import React from 'react';
import {
  ResponsiveContainer, ComposedChart, Bar, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { COLORS } from '../../constants/colors';
import { buildMonthlyData, getAccounts, ZAR } from '../../utils/insightsTransforms';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const rows = payload.filter(p => p.value != null).map(p => ({
    name: p.name || p.dataKey, value: ZAR(p.value), color: p.color
  }));
  return (
    <div className="rounded-xl border border-gray-200 bg-white/90 backdrop-blur px-3 py-2 shadow text-sm">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      {rows.map(r => (
        <div key={r.name} className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: r.color }} />
          <span className="text-gray-600">{r.name}</span>
          <span className="ml-auto font-medium text-gray-800">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function IncomeExpenseChart({ apiData }) {
  const [viewMode, setViewMode] = React.useState('overall'); // 'overall' | 'byAccount'
  const [account, setAccount] = React.useState('');
  const accounts = React.useMemo(() => getAccounts(apiData), [apiData]);
  const monthlyData = React.useMemo(() => (
    buildMonthlyData(apiData, viewMode, account || null)
  ), [apiData, viewMode, account]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-bold text-gray-800">Income vs Expenses</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => setViewMode('overall')}
            className={`px-3 py-1 text-sm rounded-md ${viewMode === 'overall' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>
            Overall
          </button>
          <button onClick={() => setViewMode('byAccount')}
            className={`px-3 py-1 text-sm rounded-md ${viewMode === 'byAccount' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>
            By Account
          </button>
          {viewMode === 'byAccount' && (
            <select value={account} onChange={(e) => setAccount(e.target.value)}
              className="ml-2 px-3 py-1 text-sm rounded-md border border-gray-300 bg-white">
              <option value="">All accounts</option>
              {accounts.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          )}
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={monthlyData} margin={{ top: 16, right: 20, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
            <YAxis tickFormatter={(v) => `R${Number(v).toLocaleString()}`} tick={{ fontSize: 12, fill: '#6b7280' }} />
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />

            <Bar dataKey="income" name="Money In" fill={COLORS.income} radius={[6,6,0,0]} maxBarSize={30} />
            <Bar dataKey="expense" name="Money Out" fill={COLORS.expense} radius={[6,6,0,0]} maxBarSize={30} />

            <Line type="monotone" dataKey="avgIncome" name="Avg Income" stroke={COLORS.avgIncome} strokeDasharray="6 6" strokeWidth={2} dot={false} connectNulls />
            <Line type="monotone" dataKey="avgExpense" name="Avg Expense" stroke={COLORS.avgExpense} strokeDasharray="6 6" strokeWidth={2} dot={false} connectNulls />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

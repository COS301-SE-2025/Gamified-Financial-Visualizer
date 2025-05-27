import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const data = [
  { month: 'Jan', income: 4000, expense: 2400 },
  { month: 'Feb', income: 3000, expense: 3200 },
  { month: 'Mar', income: 5000, expense: 2000 },
  { month: 'Apr', income: 6000, expense: 2780 },
  { month: 'May', income: 4000, expense: 1890 },
  { month: 'Jun', income: 7000, expense: 2390 },
  { month: 'Jul', income: 5000, expense: 3490 },
];

const ExpenseIncomeChart = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" label={{position: "bottom", dy: 10 }} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="expense"
          stroke="#ef4444"
          strokeWidth={3}
          dot={false}
          name="Expense"
        />
        <Line
          type="monotone"
          dataKey="income"
          stroke="#60a5fa"
          strokeWidth={3}
          dot={false}
          name="Income"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ExpenseIncomeChart;

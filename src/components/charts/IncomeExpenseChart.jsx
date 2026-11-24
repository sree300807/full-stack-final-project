import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { formatCurrency, formatCompactCurrency } from '../../utils/currency';
import { useFinance } from '../../context/FinanceContext';

export default function IncomeExpenseChart({ data, height = 300 }) {
  const { currency } = useFinance();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <div className="tooltip-title">{label}</div>
          {payload.map((entry, index) => (
            <div key={`tooltip-${index}`} className="tooltip-row">
              <span className="tooltip-label">
                <span
                  className="tooltip-color-dot"
                  style={{ background: entry.color }}
                />
                <span style={{ color: 'var(--text-muted)' }}>{entry.name}:</span>
              </span>
              <span className="tooltip-value" style={{ color: entry.color }}>
                {formatCurrency(entry.value, currency)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-wrapper" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 15, right: 10, left: -15, bottom: 0 }}
          barGap={6}
        >
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#059669" stopOpacity={0.7} />
            </linearGradient>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#e11d48" stopOpacity={0.7} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="rgba(255, 255, 255, 0.06)"
          />

          <XAxis
            dataKey="month"
            stroke="var(--text-dim)"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: 'rgba(255, 255, 255, 0.08)' }}
          />

          <YAxis
            stroke="var(--text-dim)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => formatCompactCurrency(val, currency)}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ paddingBottom: '12px', fontSize: '12px', color: 'var(--text-muted)' }}
          />

          <Bar
            name="Income"
            dataKey="income"
            fill="url(#incomeGradient)"
            radius={[6, 6, 0, 0]}
            maxBarSize={36}
          />

          <Bar
            name="Expense"
            dataKey="expenses"
            fill="url(#expenseGradient)"
            radius={[6, 6, 0, 0]}
            maxBarSize={36}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

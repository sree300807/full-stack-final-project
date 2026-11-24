import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { formatCurrency, formatCompactCurrency } from '../../utils/currency';
import { useFinance } from '../../context/FinanceContext';

export default function SpendingTrendAreaChart({ data, height = 320 }) {
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
        <AreaChart
          data={data}
          margin={{ top: 15, right: 10, left: -15, bottom: 0 }}
        >
          <defs>
            <linearGradient id="areaIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="areaExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
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

          <Area
            type="monotone"
            name="Income"
            dataKey="income"
            stroke="#10b981"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#areaIncome)"
          />

          <Area
            type="monotone"
            name="Expense"
            dataKey="expenses"
            stroke="#f43f5e"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#areaExpense)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

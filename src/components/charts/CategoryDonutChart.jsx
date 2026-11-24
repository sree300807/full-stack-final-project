import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { formatCurrency } from '../../utils/currency';
import { getCategoryMeta } from '../../data/categories';
import { useFinance } from '../../context/FinanceContext';
import { PieChart as PieIcon } from 'lucide-react';

export default function CategoryDonutChart({
  categoryData = [],
  height = 280,
  showLegend = true,
}) {
  const { currency } = useFinance();

  const totalExpense = categoryData.reduce((acc, curr) => acc + curr.value, 0);

  if (!categoryData || categoryData.length === 0 || totalExpense === 0) {
    return (
      <div
        style={{
          height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-dim)',
          textAlign: 'center',
          padding: '20px',
        }}
      >
        <PieIcon size={36} style={{ marginBottom: '10px', opacity: 0.5 }} />
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          No expense transactions recorded yet
        </p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percent = totalExpense > 0 ? ((data.value / totalExpense) * 100).toFixed(1) : 0;
      return (
        <div className="custom-tooltip">
          <div className="tooltip-title">{data.name}</div>
          <div className="tooltip-row">
            <span style={{ color: 'var(--text-muted)' }}>Amount:</span>
            <span className="tooltip-value" style={{ color: data.payload.color }}>
              {formatCurrency(data.value, currency)}
            </span>
          </div>
          <div className="tooltip-row">
            <span style={{ color: 'var(--text-muted)' }}>Share:</span>
            <span className="tooltip-value">{percent}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="chart-wrapper" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={68}
              outerRadius={98}
              paddingAngle={4}
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="rgba(10, 15, 29, 0.8)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {showLegend && (
        <div className="legend-breakdown">
          {categoryData.slice(0, 5).map((cat, idx) => {
            const percent = totalExpense > 0 ? ((cat.value / totalExpense) * 100).toFixed(0) : 0;
            return (
              <div key={idx} className="legend-item">
                <div className="legend-left">
                  <span className="legend-color-box" style={{ background: cat.color }} />
                  <span className="legend-name">{cat.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                    {percent}%
                  </span>
                  <span className="legend-val">
                    {formatCurrency(cat.value, currency)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

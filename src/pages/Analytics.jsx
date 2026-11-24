import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import SpendingTrendAreaChart from '../components/charts/SpendingTrendAreaChart';
import IncomeExpenseChart from '../components/charts/IncomeExpenseChart';
import CategoryDonutChart from '../components/charts/CategoryDonutChart';
import { formatCurrency } from '../utils/currency';
import { getCategoryMeta } from '../data/categories';
import CategoryIcon from '../components/common/CategoryIcon';
import {
  TrendingUp,
  PieChart,
  Percent,
  PiggyBank,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';

export default function Analytics() {
  const { metrics, currency, transactions } = useFinance();
  const [chartView, setChartView] = useState('monthly'); // 'monthly' | 'trend'

  // Prepare category data for Donut and Progress breakdown
  const categoryData = Object.entries(metrics.categorySpendAllTime)
    .map(([catName, amount]) => {
      const meta = getCategoryMeta(catName, 'expense');
      return {
        name: catName,
        value: amount,
        color: meta.color,
        icon: meta.icon,
      };
    })
    .sort((a, b) => b.value - a.value);

  const totalAllTimeExpenses = metrics.totalExpenses;
  const topExpenseCategory = categoryData.length > 0 ? categoryData[0] : null;

  // Calculate average monthly expense based on trends
  const nonZeroExpenseMonths = metrics.monthlyTrends.filter((m) => m.expenses > 0);
  const avgMonthlyExpense =
    nonZeroExpenseMonths.length > 0
      ? Math.round(
          nonZeroExpenseMonths.reduce((sum, m) => sum + m.expenses, 0) /
            nonZeroExpenseMonths.length
        )
      : 0;

  return (
    <div className="animate-fade">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-wrap">
          <h1 className="page-title">Financial Analytics & Insights</h1>
          <p className="page-subtitle">
            Deep dive into your monthly spending patterns, savings rate, and category distribution.
          </p>
        </div>
      </div>

      {/* Top Analytics Metrics */}
      <div className="analytics-metrics-grid">
        <div className="metric-pill-card">
          <div className="metric-pill-icon" style={{ color: '#c084fc' }}>
            <Percent size={20} />
          </div>
          <div className="metric-pill-info">
            <span className="metric-pill-label">Savings Rate</span>
            <span className="metric-pill-value" style={{ color: '#c084fc' }}>
              {metrics.savingsRate >= 0 ? `${metrics.savingsRate}%` : '0%'}
            </span>
          </div>
        </div>

        <div className="metric-pill-card">
          <div className="metric-pill-icon" style={{ color: '#fb7185' }}>
            <ArrowUpRight size={20} />
          </div>
          <div className="metric-pill-info">
            <span className="metric-pill-label">Top Expense Category</span>
            <span
              className="metric-pill-value"
              style={{ fontSize: '1.1rem', color: topExpenseCategory ? topExpenseCategory.color : '#ffffff' }}
            >
              {topExpenseCategory ? topExpenseCategory.name : 'None'}
            </span>
          </div>
        </div>

        <div className="metric-pill-card">
          <div className="metric-pill-icon" style={{ color: '#06b6d4' }}>
            <Calendar size={20} />
          </div>
          <div className="metric-pill-info">
            <span className="metric-pill-label">Avg. Monthly Outflow</span>
            <span className="metric-pill-value" style={{ color: '#38bdf8' }}>
              {formatCurrency(avgMonthlyExpense, currency)}
            </span>
          </div>
        </div>

        <div className="metric-pill-card">
          <div className="metric-pill-icon" style={{ color: '#10b981' }}>
            <Layers size={20} />
          </div>
          <div className="metric-pill-info">
            <span className="metric-pill-label">Total Transactions</span>
            <span className="metric-pill-value" style={{ color: '#34d399' }}>
              {transactions.length}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Chart: Monthly Spending & Cashflow Trajectory */}
      <div className="chart-card">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">Income vs Expense Trajectory</h3>
            <p className="chart-subtitle">Compare inflow versus outflow over the past 6 months</p>
          </div>

          <div className="filter-pill-group">
            <button
              type="button"
              className={`filter-pill ${chartView === 'monthly' ? 'active' : ''}`}
              onClick={() => setChartView('monthly')}
            >
              Bar Comparison
            </button>
            <button
              type="button"
              className={`filter-pill ${chartView === 'trend' ? 'active' : ''}`}
              onClick={() => setChartView('trend')}
            >
              Area Flow Trend
            </button>
          </div>
        </div>

        {chartView === 'monthly' ? (
          <IncomeExpenseChart data={metrics.monthlyTrends} height={340} />
        ) : (
          <SpendingTrendAreaChart data={metrics.monthlyTrends} height={340} />
        )}
      </div>

      {/* Two Column Layout: Category Donut & Category Progress Breakdown */}
      <div className="dashboard-grid-two-col">
        {/* Category Donut Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">All-Time Spending by Category</h3>
              <p className="chart-subtitle">Cumulative expense share across all entries</p>
            </div>
          </div>
          <CategoryDonutChart categoryData={categoryData} height={240} showLegend={true} />
        </div>

        {/* Detailed Category Progress Bars */}
        <div className="card-glass" style={{ padding: '24px' }}>
          <div className="section-header">
            <h3 className="section-title">
              <PieChart size={20} style={{ color: 'var(--accent-primary)' }} />
              <span>Category Breakdown</span>
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {categoryData.length === 0 ? (
              <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                No expense data available.
              </p>
            ) : (
              categoryData.map((cat, idx) => {
                const percent =
                  totalAllTimeExpenses > 0
                    ? ((cat.value / totalAllTimeExpenses) * 100).toFixed(1)
                    : 0;

                return (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.88rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '6px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: cat.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <CategoryIcon name={cat.icon} size={14} />
                        </div>
                        <span style={{ fontWeight: 600 }}>{cat.name}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                          {percent}%
                        </span>
                        <span style={{ fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                          {formatCurrency(cat.value, currency)}
                        </span>
                      </div>
                    </div>

                    <div className="progress-track" style={{ margin: '0' }}>
                      <div
                        className="progress-fill"
                        style={{
                          width: `${percent}%`,
                          background: cat.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Monthly Financial Summary Table */}
      <div className="card-glass" style={{ padding: '24px', marginTop: '24px' }}>
        <div className="section-header">
          <h3 className="section-title">
            <Calendar size={20} style={{ color: 'var(--accent-primary)' }} />
            <span>Monthly Financial Summary</span>
          </h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '0.9rem',
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid var(--card-border)',
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                <th style={{ padding: '12px 16px' }}>Month</th>
                <th style={{ padding: '12px 16px' }}>Income</th>
                <th style={{ padding: '12px 16px' }}>Expenses</th>
                <th style={{ padding: '12px 16px' }}>Net Savings</th>
                <th style={{ padding: '12px 16px' }}>Savings Rate</th>
              </tr>
            </thead>
            <tbody>
              {metrics.monthlyTrends.map((row, idx) => {
                const rate = row.income > 0 ? Math.round((row.savings / row.income) * 100) : 0;
                return (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    }}
                  >
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{row.fullLabel}</td>
                    <td style={{ padding: '14px 16px', color: '#34d399', fontWeight: 600 }}>
                      +{formatCurrency(row.income, currency)}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#fb7185', fontWeight: 600 }}>
                      -{formatCurrency(row.expenses, currency)}
                    </td>
                    <td
                      style={{
                        padding: '14px 16px',
                        color: row.savings >= 0 ? '#34d399' : '#fb7185',
                        fontWeight: 700,
                      }}
                    >
                      {row.savings >= 0 ? '+' : ''}
                      {formatCurrency(row.savings, currency)}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        className={`badge ${
                          rate >= 20 ? 'badge-income' : rate >= 0 ? 'badge-warning' : 'badge-danger'
                        }`}
                      >
                        {rate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

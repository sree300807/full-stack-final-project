import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';
import StatCard from '../components/common/StatCard';
import IncomeExpenseChart from '../components/charts/IncomeExpenseChart';
import CategoryDonutChart from '../components/charts/CategoryDonutChart';
import TransactionList from '../components/transactions/TransactionList';
import { getCategoryMeta } from '../data/categories';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
  Plus,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export default function Dashboard() {
  const { metrics, recentTransactions, currency } = useFinance();
  const { openAddTransaction } = useOutletContext();

  // Prepare category data for Donut Chart
  const categoryData = Object.entries(metrics.categorySpendMonth).map(([catName, amount]) => {
    const meta = getCategoryMeta(catName, 'expense');
    return {
      name: catName,
      value: amount,
      color: meta.color,
    };
  }).sort((a, b) => b.value - a.value);

  return (
    <div className="animate-fade">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-wrap">
          <h1 className="page-title">Financial Dashboard</h1>
          <p className="page-subtitle">
            Welcome back! Here is your real-time cashflow and wealth overview.
          </p>
        </div>

        <div className="page-actions">
          <button className="btn btn-gradient" onClick={openAddTransaction}>
            <Plus size={18} />
            <span>Quick Add</span>
          </button>
        </div>
      </div>

      {/* Financial Health Banner */}
      <div className="health-banner">
        <div className="health-banner-left">
          <div className="health-banner-icon">
            <Sparkles size={24} />
          </div>
          <div className="health-banner-text">
            <h4>
              Monthly Savings Rate: {metrics.savingsRate >= 0 ? `${metrics.savingsRate}%` : '0%'}
            </h4>
            <p>
              {metrics.monthlySavings >= 0
                ? `You have saved a net surplus this month. Outstanding financial discipline!`
                : `Your monthly expenses have exceeded income. Review budgets below to optimize.`}
            </p>
          </div>
        </div>

        <Link to="/budgets" className="btn btn-secondary btn-sm">
          <span>Manage Budgets</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Stat Cards Grid */}
      <div className="stats-grid">
        <StatCard
          title="Total Balance"
          amount={metrics.totalBalance}
          currency={currency}
          icon={Wallet}
          variant="balance"
          sublabel="Net liquid assets"
        />

        <StatCard
          title="Total Income"
          amount={metrics.totalIncome}
          currency={currency}
          icon={ArrowDownLeft}
          variant="income"
          trendText="All Time"
          isPositiveTrend={true}
        />

        <StatCard
          title="Total Expenses"
          amount={metrics.totalExpenses}
          currency={currency}
          icon={ArrowUpRight}
          variant="expense"
          trendText="All Time"
          isPositiveTrend={false}
        />

        <StatCard
          title="Monthly Savings"
          amount={metrics.monthlySavings}
          currency={currency}
          icon={PiggyBank}
          variant="savings"
          trendText={`${metrics.savingsRate}% saved`}
          isPositiveTrend={metrics.monthlySavings >= 0}
          sublabel="This month"
        />
      </div>

      {/* Charts Section */}
      <div className="dashboard-grid-two-col">
        {/* Income vs Expenses Monthly Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Income vs Expense Trend</h3>
              <p className="chart-subtitle">Monthly cash flow comparison over past 6 months</p>
            </div>
            <Link to="/analytics" className="link-btn">
              <span>Detailed Analytics</span>
              <ArrowRight size={14} />
            </Link>
          </div>
          <IncomeExpenseChart data={metrics.monthlyTrends} height={300} />
        </div>

        {/* Expense Distribution Donut Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">Expense Distribution</h3>
              <p className="chart-subtitle">Breakdown by category for current month</p>
            </div>
          </div>
          <CategoryDonutChart categoryData={categoryData} height={230} showLegend={true} />
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className="card-glass" style={{ padding: '24px' }}>
        <div className="section-header">
          <h3 className="section-title">
            <TrendingUp size={20} style={{ color: 'var(--accent-primary)' }} />
            <span>Recent Transactions</span>
          </h3>
          <Link to="/transactions" className="link-btn">
            <span>View All Transactions</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <TransactionList
          transactions={recentTransactions}
          emptyMessage="No transactions recorded yet"
          onAddNew={openAddTransaction}
        />
      </div>
    </div>
  );
}

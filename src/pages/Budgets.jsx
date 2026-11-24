import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import BudgetCard from '../components/budget/BudgetCard';
import BudgetModal from '../components/budget/BudgetModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { formatCurrency } from '../utils/currency';
import {
  Target,
  Plus,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  ShieldAlert,
} from 'lucide-react';

export default function Budgets() {
  const { metrics, currency, deleteCategoryBudget } = useFinance();
  const [modalState, setModalState] = useState({ isOpen: false, data: null });
  const [deletingCategory, setDeletingCategory] = useState(null);

  const { budgetList, totalBudgetLimit, totalBudgetSpent } = metrics;
  const overallPercent =
    totalBudgetLimit > 0 ? Math.round((totalBudgetSpent / totalBudgetLimit) * 100) : 0;
  const overallRemaining = Math.max(0, totalBudgetLimit - totalBudgetSpent);
  const overBudgetCategories = budgetList.filter((b) => b.isOverBudget);

  return (
    <div className="animate-fade">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-wrap">
          <h1 className="page-title">Budget Management</h1>
          <p className="page-subtitle">
            Establish category limits, monitor spending ceilings, and prevent budget overruns.
          </p>
        </div>

        <div className="page-actions">
          <button
            className="btn btn-primary"
            onClick={() => setModalState({ isOpen: true, data: null })}
          >
            <Plus size={18} />
            <span>Set New Budget</span>
          </button>
        </div>
      </div>

      {/* Over-Budget Alert Banner if any category exceeded */}
      {overBudgetCategories.length > 0 && (
        <div
          style={{
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.2)',
              color: '#f87171',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ShieldAlert size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ color: '#f87171', fontSize: '0.96rem', fontWeight: 700, marginBottom: '2px' }}>
              Budget Threshold Exceeded in {overBudgetCategories.length}{' '}
              {overBudgetCategories.length === 1 ? 'Category' : 'Categories'}!
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>
              You have exceeded the set ceiling for{' '}
              <strong style={{ color: '#ffffff' }}>
                {overBudgetCategories.map((c) => c.category).join(', ')}
              </strong>
              . Reallocate funds or reduce discretionary expenses.
            </p>
          </div>
        </div>
      )}

      {/* Overall Monthly Budget Progress Card */}
      <div className="card-glass" style={{ padding: '24px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dim)', fontWeight: 700 }}>
              Monthly Cap Overview
            </span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '2px' }}>
              {formatCurrency(totalBudgetSpent, currency)}{' '}
              <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                spent of {formatCurrency(totalBudgetLimit, currency)} total limit
              </span>
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              className={`badge ${
                overallPercent >= 100
                  ? 'badge-danger'
                  : overallPercent >= 80
                  ? 'badge-warning'
                  : 'badge-income'
              }`}
              style={{ fontSize: '0.85rem', padding: '6px 12px' }}
            >
              {overallPercent}% Utilized
            </span>
          </div>
        </div>

        {/* Global Progress Track */}
        <div className="progress-track" style={{ height: '12px' }}>
          <div
            className={`progress-fill ${
              overallPercent >= 100
                ? 'danger'
                : overallPercent >= 80
                ? 'warning'
                : 'normal'
            }`}
            style={{ width: `${Math.min(overallPercent, 100)}%` }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '8px' }}>
          <span>0%</span>
          <span>
            Remaining Total: <strong style={{ color: 'var(--text-highlight)' }}>{formatCurrency(overallRemaining, currency)}</strong>
          </span>
          <span>100%</span>
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div className="section-header">
        <h3 className="section-title">
          <Target size={20} style={{ color: 'var(--accent-primary)' }} />
          <span>Category Budgets ({budgetList.length})</span>
        </h3>
      </div>

      {budgetList.length === 0 ? (
        <div className="empty-state card-glass">
          <div className="empty-state-icon">
            <Target size={28} />
          </div>
          <h4 className="empty-state-title">No category budgets defined</h4>
          <p className="empty-state-desc">
            Set up limits for groceries, dining, shopping, and travel to keep your spending controlled.
          </p>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setModalState({ isOpen: true, data: null })}
          >
            <Plus size={16} />
            <span>Create First Budget</span>
          </button>
        </div>
      ) : (
        <div className="budget-grid">
          {budgetList.map((item) => (
            <BudgetCard
              key={item.category}
              category={item.category}
              limit={item.limit}
              spent={item.spent}
              remaining={item.remaining}
              percent={item.percent}
              status={item.status}
              onEdit={(cat, lim) =>
                setModalState({ isOpen: true, data: { category: cat, limit: lim } })
              }
              onDelete={(cat) => setDeletingCategory(cat)}
            />
          ))}
        </div>
      )}

      {/* Set / Edit Budget Modal */}
      <BudgetModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, data: null })}
        initialData={modalState.data}
      />

      {/* Delete Confirmation Modal */}
      {deletingCategory && (
        <ConfirmDialog
          isOpen={Boolean(deletingCategory)}
          onClose={() => setDeletingCategory(null)}
          onConfirm={() => deleteCategoryBudget(deletingCategory)}
          title="Remove Category Budget"
          message={`Are you sure you want to remove the budget for "${deletingCategory}"? Your transaction history will remain intact.`}
          confirmText="Remove Budget"
          isDanger={true}
        />
      )}
    </div>
  );
}

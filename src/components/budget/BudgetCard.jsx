import React from 'react';
import { formatCurrency } from '../../utils/currency';
import { getCategoryMeta } from '../../data/categories';
import CategoryIcon from '../common/CategoryIcon';
import { useFinance } from '../../context/FinanceContext';
import { AlertCircle, AlertTriangle, CheckCircle2, Edit2, Trash2 } from 'lucide-react';

export default function BudgetCard({
  category,
  limit,
  spent,
  remaining,
  percent,
  status,
  onEdit,
  onDelete,
}) {
  const { currency } = useFinance();
  const categoryMeta = getCategoryMeta(category, 'expense');

  // Status badges & text
  const isDanger = percent >= 100;
  const isWarning = percent >= 80 && percent < 100;

  return (
    <div className={`budget-card ${isDanger ? 'is-danger' : ''}`}>
      <div className="budget-card-header">
        <div className="budget-category-info">
          <div
            className="tx-icon-pill"
            style={{
              width: '40px',
              height: '40px',
              background: categoryMeta.bgSoft || 'rgba(255, 255, 255, 0.05)',
              color: categoryMeta.color,
            }}
          >
            <CategoryIcon name={categoryMeta.icon} size={18} />
          </div>
          <div>
            <div className="budget-category-name">{category}</div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
              Limit: {formatCurrency(limit, currency)}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {onEdit && (
            <button
              className="btn-icon-action"
              onClick={() => onEdit(category, limit)}
              title="Edit Budget Limit"
              aria-label="Edit Budget Limit"
            >
              <Edit2 size={13} />
            </button>
          )}
          {onDelete && (
            <button
              className="btn-icon-action delete"
              onClick={() => onDelete(category)}
              title="Remove Category Budget"
              aria-label="Remove Category Budget"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-track">
        <div
          className={`progress-fill ${status}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>

      {/* Stats and Remaining / Warning */}
      <div className="budget-stats">
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Spent: </span>
          <span className="budget-spent-val">{formatCurrency(spent, currency)}</span>
        </div>

        <div>
          {isDanger ? (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: '#fb7185',
                fontWeight: 700,
                fontSize: '0.8rem',
              }}
            >
              <AlertCircle size={13} />
              Exceeded by {formatCurrency(spent - limit, currency)}
            </span>
          ) : isWarning ? (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: '#fbbf24',
                fontWeight: 600,
                fontSize: '0.8rem',
              }}
            >
              <AlertTriangle size={13} />
              {percent}% Used ({formatCurrency(remaining, currency)} left)
            </span>
          ) : (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
              }}
            >
              <CheckCircle2 size={13} style={{ color: '#34d399' }} />
              {formatCurrency(remaining, currency)} left
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

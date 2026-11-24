import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import { formatDateDisplay } from '../../utils/dateUtils';
import { getCategoryMeta } from '../../data/categories';
import CategoryIcon from '../common/CategoryIcon';
import { useFinance } from '../../context/FinanceContext';

export default function TransactionItem({ transaction, onEdit, onDelete }) {
  const { currency } = useFinance();
  const isIncome = transaction.type === 'income';
  const categoryMeta = getCategoryMeta(transaction.category, transaction.type);

  return (
    <div className="tx-row">
      <div className="tx-left">
        <div
          className="tx-icon-pill"
          style={{
            background: categoryMeta.bgSoft || 'rgba(255, 255, 255, 0.05)',
            color: categoryMeta.color || 'var(--text-main)',
          }}
        >
          <CategoryIcon name={categoryMeta.icon} size={20} />
        </div>

        <div className="tx-info">
          <span className="tx-desc" title={transaction.description}>
            {transaction.description}
          </span>
          <div className="tx-meta">
            <span
              style={{
                color: categoryMeta.color,
                fontWeight: 600,
              }}
            >
              {transaction.category}
            </span>
            <span>•</span>
            <span className="tx-meta-date">{formatDateDisplay(transaction.date)}</span>
            {transaction.notes && (
              <>
                <span>•</span>
                <span
                  style={{
                    maxWidth: '160px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={transaction.notes}
                >
                  {transaction.notes}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="tx-right">
        <div className={`tx-amount ${isIncome ? 'income' : 'expense'}`}>
          {isIncome ? '+' : '-'}
          {formatCurrency(transaction.amount, currency)}
        </div>

        <div className="tx-actions">
          {onEdit && (
            <button
              className="btn-icon-action"
              onClick={() => onEdit(transaction)}
              title="Edit Transaction"
              aria-label="Edit Transaction"
            >
              <Edit2 size={14} />
            </button>
          )}

          {onDelete && (
            <button
              className="btn-icon-action delete"
              onClick={() => onDelete(transaction)}
              title="Delete Transaction"
              aria-label="Delete Transaction"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

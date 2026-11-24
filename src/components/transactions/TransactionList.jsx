import React, { useState } from 'react';
import TransactionItem from './TransactionItem';
import TransactionModal from './TransactionModal';
import ConfirmDialog from '../common/ConfirmDialog';
import { useFinance } from '../../context/FinanceContext';
import { ReceiptText, Plus } from 'lucide-react';

export default function TransactionList({
  transactions,
  emptyMessage = 'No transactions found',
  onAddNew,
}) {
  const { deleteTransaction } = useFinance();
  const [editingTx, setEditingTx] = useState(null);
  const [deletingTx, setDeletingTx] = useState(null);

  if (!transactions || transactions.length === 0) {
    return (
      <div className="empty-state card-glass">
        <div className="empty-state-icon">
          <ReceiptText size={28} />
        </div>
        <h4 className="empty-state-title">{emptyMessage}</h4>
        <p className="empty-state-desc">
          Keep track of every rupee and dollar you spend or earn.
        </p>
        {onAddNew && (
          <button className="btn btn-primary btn-sm" onClick={onAddNew}>
            <Plus size={16} />
            <span>Add Transaction</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="tx-list">
        {transactions.map((tx) => (
          <TransactionItem
            key={tx.id}
            transaction={tx}
            onEdit={(item) => setEditingTx(item)}
            onDelete={(item) => setDeletingTx(item)}
          />
        ))}
      </div>

      {/* Edit Transaction Modal */}
      {editingTx && (
        <TransactionModal
          isOpen={Boolean(editingTx)}
          onClose={() => setEditingTx(null)}
          initialData={editingTx}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingTx && (
        <ConfirmDialog
          isOpen={Boolean(deletingTx)}
          onClose={() => setDeletingTx(null)}
          onConfirm={() => deleteTransaction(deletingTx.id)}
          title="Delete Transaction"
          message={`Are you sure you want to delete "${deletingTx.description}"? This action cannot be undone.`}
          confirmText="Delete"
          isDanger={true}
        />
      )}
    </>
  );
}

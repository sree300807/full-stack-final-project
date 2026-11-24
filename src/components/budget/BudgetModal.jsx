import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useFinance } from '../../context/FinanceContext';
import { EXPENSE_CATEGORIES } from '../../data/categories';

export default function BudgetModal({ isOpen, onClose, initialData = null }) {
  const { setCategoryBudget, currency, budgets } = useFinance();

  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0].name);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setCategory(initialData.category || EXPENSE_CATEGORIES[0].name);
      setAmount(initialData.limit ? String(initialData.limit) : '');
    } else {
      // Find first category that hasn't been budgeted yet, or fallback to first
      const unbudgeted = EXPENSE_CATEGORIES.find((c) => !budgets[c.name]);
      setCategory(unbudgeted ? unbudgeted.name : EXPENSE_CATEGORIES[0].name);
      setAmount('');
    }
    setError('');
  }, [initialData, isOpen, budgets]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num <= 0) {
      setError('Please enter a valid budget amount greater than 0');
      return;
    }

    const success = setCategoryBudget(category, num);
    if (success) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? `Edit ${category} Budget` : 'Set Category Budget'}
    >
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            <span>Category</span>
          </label>
          <select
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={Boolean(initialData)} // lock category if editing
          >
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            <span>Monthly Budget Limit ({currency})</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>e.g. 15000</span>
          </label>
          <input
            type="number"
            step="any"
            min="1"
            className="form-control"
            placeholder="Enter monthly spending limit"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError('');
            }}
            autoFocus
          />
          {error && <span className="form-error">{error}</span>}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {initialData ? 'Update Budget' : 'Save Budget'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

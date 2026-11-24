import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useFinance } from '../../context/FinanceContext';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../data/categories';
import { getTodayDateString } from '../../utils/dateUtils';
import { ArrowDownLeft, ArrowUpRight, DollarSign, Calendar, FileText, Tag } from 'lucide-react';

export default function TransactionModal({ isOpen, onClose, initialData = null }) {
  const { addTransaction, updateTransaction, currency } = useFinance();

  const isEditing = Boolean(initialData && initialData.id);

  const [formData, setFormData] = useState({
    type: 'expense',
    description: '',
    amount: '',
    category: 'Food',
    date: getTodayDateString(),
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type || 'expense',
        description: initialData.description || '',
        amount: initialData.amount ? String(initialData.amount) : '',
        category: initialData.category || 'Food',
        date: initialData.date || getTodayDateString(),
        notes: initialData.notes || '',
      });
    } else {
      setFormData({
        type: 'expense',
        description: '',
        amount: '',
        category: 'Food',
        date: getTodayDateString(),
        notes: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleTypeChange = (newType) => {
    const defaultCategory = newType === 'income' ? INCOME_CATEGORIES[0].name : EXPENSE_CATEGORIES[0].name;
    setFormData((prev) => ({
      ...prev,
      type: newType,
      category: defaultCategory,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    const num = parseFloat(formData.amount);
    if (!formData.amount || isNaN(num) || num <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditing) {
      updateTransaction(initialData.id, formData);
    } else {
      addTransaction(formData);
    }

    onClose();
  };

  const currentCategories = formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Transaction' : 'Add New Transaction'}
    >
      <form onSubmit={handleSubmit}>
        {/* Income / Expense Toggle */}
        <div className="type-selector">
          <button
            type="button"
            className={`type-btn ${formData.type === 'expense' ? 'active type-expense' : ''}`}
            onClick={() => handleTypeChange('expense')}
          >
            <ArrowUpRight size={16} />
            <span>Expense</span>
          </button>
          <button
            type="button"
            className={`type-btn ${formData.type === 'income' ? 'active type-income' : ''}`}
            onClick={() => handleTypeChange('income')}
          >
            <ArrowDownLeft size={16} />
            <span>Income</span>
          </button>
        </div>

        {/* Description Field */}
        <div className="form-group">
          <label className="form-label">
            <span>Description</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>e.g. Grocery store, Salary</span>
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="What was this transaction for?"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            autoFocus={isOpen}
          />
          {errors.description && <span className="form-error">{errors.description}</span>}
        </div>

        {/* Amount Field */}
        <div className="form-group">
          <label className="form-label">
            <span>Amount ({currency})</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>e.g. 2499.50</span>
          </label>
          <input
            type="number"
            step="any"
            min="0"
            className="form-control"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />
          {errors.amount && <span className="form-error">{errors.amount}</span>}
        </div>

        {/* Category & Date Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">
              <span>Category</span>
            </label>
            <select
              className="form-control"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {currentCategories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.category && <span className="form-error">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Date</span>
            </label>
            <input
              type="date"
              className="form-control"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
            {errors.date && <span className="form-error">{errors.date}</span>}
          </div>
        </div>

        {/* Notes Field */}
        <div className="form-group">
          <label className="form-label">
            <span>Notes (Optional)</span>
          </label>
          <textarea
            className="form-control"
            placeholder="Add extra details, merchant, or payment method..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={2}
          />
        </div>

        {/* Modal Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Save Changes' : 'Add Transaction'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

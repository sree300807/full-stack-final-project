import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionList from '../components/transactions/TransactionList';
import TransactionModal from '../components/transactions/TransactionModal';
import { formatCurrency } from '../utils/currency';
import { exportTransactionsToCsv } from '../utils/exportCsv';
import { useToast } from '../context/ToastContext';
import { Plus, ArrowDownLeft, ArrowUpRight, Scale } from 'lucide-react';

export default function Transactions() {
  const { transactions, currency } = useFinance();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter and Sort Transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        // Search filter
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase();
          const matchDesc = tx.description?.toLowerCase().includes(query);
          const matchNotes = tx.notes?.toLowerCase().includes(query);
          const matchCat = tx.category?.toLowerCase().includes(query);
          if (!matchDesc && !matchNotes && !matchCat) return false;
        }

        // Type filter
        if (selectedType !== 'all' && tx.type !== selectedType) {
          return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && tx.category !== selectedCategory) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
        if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
        if (sortBy === 'amount-desc') return b.amount - a.amount;
        if (sortBy === 'amount-asc') return a.amount - b.amount;
        return 0;
      });
  }, [transactions, searchTerm, selectedCategory, selectedType, sortBy]);

  // Filtered Totals
  const filteredMetrics = useMemo(() => {
    let income = 0;
    let expense = 0;
    filteredTransactions.forEach((tx) => {
      const amt = Number(tx.amount) || 0;
      if (tx.type === 'income') income += amt;
      else expense += amt;
    });
    return {
      income,
      expense,
      net: income - expense,
    };
  }, [filteredTransactions]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedType('all');
    setSortBy('date-desc');
  };

  const handleExportCsv = () => {
    const success = exportTransactionsToCsv(filteredTransactions, currency);
    if (success) {
      showToast('Exported filtered transactions to CSV!', 'success');
    } else {
      showToast('No transactions to export', 'error');
    }
  };

  return (
    <div className="animate-fade">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-wrap">
          <h1 className="page-title">Transaction Ledger</h1>
          <p className="page-subtitle">
            Search, filter, categorize, and manage all your cash inflows and outflows.
          </p>
        </div>

        <div className="page-actions">
          <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={18} />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Filter Summary Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div className="metric-pill-card">
          <div className="metric-pill-icon" style={{ color: '#34d399' }}>
            <ArrowDownLeft size={20} />
          </div>
          <div className="metric-pill-info">
            <span className="metric-pill-label">Filtered Inflow</span>
            <span className="metric-pill-value" style={{ color: '#34d399' }}>
              {formatCurrency(filteredMetrics.income, currency)}
            </span>
          </div>
        </div>

        <div className="metric-pill-card">
          <div className="metric-pill-icon" style={{ color: '#fb7185' }}>
            <ArrowUpRight size={20} />
          </div>
          <div className="metric-pill-info">
            <span className="metric-pill-label">Filtered Outflow</span>
            <span className="metric-pill-value" style={{ color: '#fb7185' }}>
              {formatCurrency(filteredMetrics.expense, currency)}
            </span>
          </div>
        </div>

        <div className="metric-pill-card">
          <div className="metric-pill-icon" style={{ color: '#818cf8' }}>
            <Scale size={20} />
          </div>
          <div className="metric-pill-info">
            <span className="metric-pill-label">Net Filtered Flow</span>
            <span
              className="metric-pill-value"
              style={{ color: filteredMetrics.net >= 0 ? '#34d399' : '#fb7185' }}
            >
              {formatCurrency(filteredMetrics.net, currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <TransactionFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onReset={handleResetFilters}
        onExportCsv={handleExportCsv}
        totalCount={filteredTransactions.length}
      />

      {/* Transactions List */}
      <div className="card-glass" style={{ padding: '24px' }}>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Showing <strong style={{ color: 'var(--text-highlight)' }}>{filteredTransactions.length}</strong> of{' '}
            {transactions.length} total entries
          </span>
        </div>

        <TransactionList
          transactions={filteredTransactions}
          emptyMessage={
            transactions.length === 0
              ? 'Your transaction register is empty.'
              : 'No transactions match the selected filters.'
          }
          onAddNew={() => setIsAddModalOpen(true)}
        />
      </div>

      {/* Add Transaction Modal */}
      <TransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}

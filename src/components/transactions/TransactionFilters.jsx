import React from 'react';
import { Search, Download, RotateCcw, Filter } from 'lucide-react';
import { ALL_CATEGORIES } from '../../data/categories';

export default function TransactionFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedType,
  onTypeChange,
  sortBy,
  onSortChange,
  onReset,
  onExportCsv,
  totalCount,
}) {
  const hasActiveFilters =
    searchTerm !== '' ||
    selectedCategory !== 'all' ||
    selectedType !== 'all' ||
    sortBy !== 'date-desc';

  return (
    <div className="filters-bar">
      <div className="filters-group">
        {/* Search Input */}
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search by description or note..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Type Filter Pills */}
        <div className="filter-pill-group">
          <button
            type="button"
            className={`filter-pill ${selectedType === 'all' ? 'active' : ''}`}
            onClick={() => onTypeChange('all')}
          >
            All
          </button>
          <button
            type="button"
            className={`filter-pill ${selectedType === 'expense' ? 'active' : ''}`}
            onClick={() => onTypeChange('expense')}
          >
            Expenses
          </button>
          <button
            type="button"
            className={`filter-pill ${selectedType === 'income' ? 'active' : ''}`}
            onClick={() => onTypeChange('income')}
          >
            Income
          </button>
        </div>

        {/* Category Dropdown */}
        <select
          className="form-control filter-select"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="all">All Categories</option>
          {ALL_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Sort Dropdown */}
        <select
          className="form-control filter-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Highest Amount</option>
          <option value="amount-asc">Lowest Amount</option>
        </select>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onReset}
            title="Reset filters"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={onExportCsv}
          title="Export to CSV"
        >
          <Download size={14} />
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  );
}

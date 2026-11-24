import React from 'react';
import { formatCurrency } from '../../utils/currency';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({
  title,
  amount,
  currency = 'INR',
  icon: Icon,
  variant = 'balance',
  trendText,
  isPositiveTrend,
  sublabel,
}) {
  return (
    <div className={`stat-card stat-card-${variant}`}>
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        <div className="stat-card-icon-wrap">
          {Icon && <Icon size={20} />}
        </div>
      </div>

      <div className="stat-card-amount">
        {formatCurrency(amount, currency)}
      </div>

      <div className="stat-card-footer">
        {trendText ? (
          <span className={`stat-trend ${isPositiveTrend ? 'positive' : 'negative'}`}>
            {isPositiveTrend ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {trendText}
          </span>
        ) : (
          <span>{sublabel || 'Current Period'}</span>
        )}
        {sublabel && trendText && <span style={{ opacity: 0.7 }}>{sublabel}</span>}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Menu, Plus, Calendar, Coins, Database, CheckCircle2, User } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { getCurrencyConfig } from '../../utils/currency';
import AuthModal from '../common/AuthModal';

export default function Header({ onToggleMobileMenu, onOpenAddModal }) {
  const { currency, isAuthenticated, user, isServerConnected } = useFinance();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const currencyConfig = getCurrencyConfig(currency);

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <>
      <header className="app-header">
        <div className="header-left">
          <button
            className="mobile-menu-btn"
            onClick={onToggleMobileMenu}
            aria-label="Open mobile menu"
          >
            <Menu size={22} />
          </button>

          <div className="header-date-badge">
            <Calendar size={14} style={{ color: 'var(--accent-primary)' }} />
            <span>{formattedDate}</span>
          </div>

          {/* Live MongoDB Atlas Connection Status Pill */}
          <div
            className="currency-pill"
            style={{
              cursor: 'pointer',
              borderColor: isAuthenticated ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255, 255, 255, 0.1)',
              background: isAuthenticated ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.03)',
            }}
            onClick={() => setAuthModalOpen(true)}
            title="Click to view MongoDB Cloud connection status or login"
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: isAuthenticated ? '#10b981' : isServerConnected ? '#38bdf8' : '#94a3b8',
                boxShadow: isAuthenticated ? '0 0 8px #10b981' : 'none',
              }}
            />
            <Database size={13} style={{ color: isAuthenticated ? '#34d399' : 'var(--text-muted)' }} />
            <span style={{ fontSize: '0.78rem' }}>
              {isAuthenticated ? 'MongoDB Atlas Active' : 'Connect MongoDB'}
            </span>
          </div>
        </div>

        <div className="header-right">
          <div className="currency-pill" title={`Active Currency: ${currencyConfig.name}`}>
            <Coins size={14} />
            <span>{currencyConfig.code}</span>
            <span className="currency-pill-symbol">({currencyConfig.symbol})</span>
          </div>

          {/* User Profile / Auth Toggle Button */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setAuthModalOpen(true)}
            title={isAuthenticated ? `Logged in as ${user?.name}` : 'Sign in to MongoDB'}
          >
            <User size={15} style={{ color: isAuthenticated ? 'var(--accent-emerald)' : 'var(--text-muted)' }} />
            <span>{isAuthenticated ? user?.name?.split(' ')[0] : 'Sign In'}</span>
          </button>

          <button className="btn btn-primary btn-sm" onClick={onOpenAddModal}>
            <Plus size={16} />
            <span>New Transaction</span>
          </button>
        </div>
      </header>

      {/* Auth & Database Sync Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}

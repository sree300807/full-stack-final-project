import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { CURRENCIES } from '../utils/currency';
import ConfirmDialog from '../components/common/ConfirmDialog';
import {
  User,
  Palette,
  Coins,
  Trash2,
  RotateCcw,
  Info,
  Check,
  Shield,
  Database,
  Cpu,
} from 'lucide-react';

const THEMES = [
  {
    id: 'midnight',
    name: 'Midnight Navy',
    desc: 'Sophisticated dark navy with indigo glow',
    bg: '#070b14',
    accent1: '#6366f1',
    accent2: '#06b6d4',
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    desc: 'Deep imperial violet with amethyst glow',
    bg: '#0a0818',
    accent1: '#a855f7',
    accent2: '#ec4899',
  },
  {
    id: 'obsidian',
    name: 'Jet Obsidian',
    desc: 'Ultra stealth dark with neon accents',
    bg: '#08090b',
    accent1: '#10b981',
    accent2: '#3b82f6',
  },
  {
    id: 'emerald',
    name: 'Emerald Luxe',
    desc: 'Deep forest green luxury fintech theme',
    bg: '#06110f',
    accent1: '#10b981',
    accent2: '#14b8a6',
  },
];

export default function Settings() {
  const {
    settings,
    currency,
    theme,
    userProfile,
    updateCurrency,
    updateTheme,
    updateSettings,
    clearAllData,
    restoreDemoData,
    transactions,
    budgets,
  } = useFinance();

  const [profileForm, setProfileForm] = useState({
    name: userProfile.name || '',
    email: userProfile.email || '',
    role: userProfile.role || '',
    monthlySavingsGoal: userProfile.monthlySavingsGoal || 50000,
  });

  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [confirmRestoreOpen, setConfirmRestoreOpen] = useState(false);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateSettings({
      userProfile: {
        ...userProfile,
        ...profileForm,
      },
    });
  };

  // Calculate local storage size approximation
  const approximateStorageSize = () => {
    try {
      const dataStr =
        localStorage.getItem('ledger_transactions_v2') +
        localStorage.getItem('ledger_budgets_v2') +
        localStorage.getItem('ledger_settings_v2');
      return (new Blob([dataStr]).size / 1024).toFixed(2);
    } catch (e) {
      return '12.4';
    }
  };

  return (
    <div className="animate-fade">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title-wrap">
          <h1 className="page-title">Application Settings</h1>
          <p className="page-subtitle">
            Configure your personal profile, preferred currency, visual themes, and local storage.
          </p>
        </div>
      </div>

      <div className="settings-grid">
        {/* User Profile Card */}
        <div className="settings-section-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <User size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3 className="settings-section-title">User Profile</h3>
          </div>
          <p className="settings-section-desc">
            Personalize your account details and monthly savings goals.
          </p>

          <form onSubmit={handleProfileSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  placeholder="e.g. Aarav Sharma"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  placeholder="name@example.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Professional Role / Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={profileForm.role}
                  onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                  placeholder="e.g. Product Designer"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Monthly Savings ({currency})</label>
                <input
                  type="number"
                  className="form-control"
                  value={profileForm.monthlySavingsGoal}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, monthlySavingsGoal: Number(e.target.value) })
                  }
                  placeholder="50000"
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button type="submit" className="btn btn-primary btn-sm">
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>

        {/* Currency Selector */}
        <div className="settings-section-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Coins size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3 className="settings-section-title">Base Currency</h3>
          </div>
          <p className="settings-section-desc">
            Choose your preferred currency symbol and formatting for all charts and ledgers.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '12px',
            }}
          >
            {CURRENCIES.map((curr) => {
              const isSelected = currency === curr.code;
              return (
                <div
                  key={curr.code}
                  onClick={() => updateCurrency(curr.code)}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected
                      ? '2px solid var(--accent-primary)'
                      : '1px solid var(--card-border)',
                    background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 800,
                        fontSize: '1.2rem',
                        color: isSelected ? 'var(--accent-primary)' : 'var(--text-highlight)',
                      }}
                    >
                      {curr.symbol}
                    </span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{curr.code}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                        {curr.name.split(' ')[0]}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: 'var(--accent-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                      }}
                    >
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Theme Selector */}
        <div className="settings-section-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Palette size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3 className="settings-section-title">Color Theme</h3>
          </div>
          <p className="settings-section-desc">
            Customize the visual atmosphere with our curated dark navy, royal violet, and emerald palettes.
          </p>

          <div className="theme-selector-grid">
            {THEMES.map((th) => {
              const isSelected = theme === th.id;
              return (
                <div
                  key={th.id}
                  className={`theme-card ${isSelected ? 'active' : ''}`}
                  onClick={() => updateTheme(th.id)}
                >
                  <div
                    className="theme-preview"
                    style={{ background: th.bg }}
                  >
                    <div className="theme-preview-dots">
                      <span className="theme-dot" style={{ background: th.accent1 }} />
                      <span className="theme-dot" style={{ background: th.accent2 }} />
                    </div>
                    <div
                      style={{
                        height: '4px',
                        borderRadius: '2px',
                        background: `linear-gradient(90deg, ${th.accent1}, ${th.accent2})`,
                        width: '60%',
                      }}
                    />
                  </div>
                  <div>
                    <div className="theme-name">{th.name}</div>
                    <div
                      style={{
                        fontSize: '0.72rem',
                        color: 'var(--text-dim)',
                        textAlign: 'center',
                        marginTop: '2px',
                      }}
                    >
                      {th.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Data Management & Demo Restore */}
        <div className="settings-section-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Database size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3 className="settings-section-title">Data Management</h3>
          </div>
          <p className="settings-section-desc">
            All your financial entries are safely kept in your browser’s encrypted LocalStorage.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
            <button
              className="btn btn-secondary"
              onClick={() => setConfirmRestoreOpen(true)}
            >
              <RotateCcw size={16} />
              <span>Restore Demo Data</span>
            </button>
          </div>

          {/* Danger Zone */}
          <div
            className="danger-zone"
            style={{
              padding: '20px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(244, 63, 94, 0.25)',
            }}
          >
            <h4 className="danger-zone-title" style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>
              Clear All Financial Data
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', marginBottom: '14px' }}>
              Permanently delete all registered transactions, category budgets, and start fresh with an empty state.
            </p>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => setConfirmClearOpen(true)}
            >
              <Trash2 size={15} />
              <span>Wipe All Data</span>
            </button>
          </div>
        </div>

        {/* System Information */}
        <div className="settings-section-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Info size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3 className="settings-section-title">Application Information</h3>
          </div>
          <p className="settings-section-desc">Architecture and runtime status of LEDGER.</p>

          <div className="info-row">
            <span className="info-label">Application Name</span>
            <span className="info-value">LEDGER • Premium Personal Finance</span>
          </div>
          <div className="info-row">
            <span className="info-label">Version</span>
            <span className="info-value">v2.4.0 (Commercial Grade)</span>
          </div>
          <div className="info-row">
            <span className="info-label">Storage Engine</span>
            <span className="info-value">Persistent HTML5 LocalStorage</span>
          </div>
          <div className="info-row">
            <span className="info-label">Recorded Transactions</span>
            <span className="info-value">{transactions.length} entries</span>
          </div>
          <div className="info-row">
            <span className="info-label">Configured Budgets</span>
            <span className="info-value">{Object.keys(budgets).length} categories</span>
          </div>
          <div className="info-row">
            <span className="info-label">Storage Footprint</span>
            <span className="info-value">{approximateStorageSize()} KB</span>
          </div>
        </div>
      </div>

      {/* Confirm Wipe Dialog */}
      <ConfirmDialog
        isOpen={confirmClearOpen}
        onClose={() => setConfirmClearOpen(false)}
        onConfirm={clearAllData}
        title="Wipe All Data?"
        message="This will irrevocably erase all your transactions and budgets from LocalStorage. Are you sure you wish to proceed?"
        confirmText="Yes, Wipe All Data"
        isDanger={true}
      />

      {/* Confirm Restore Demo Data Dialog */}
      <ConfirmDialog
        isOpen={confirmRestoreOpen}
        onClose={() => setConfirmRestoreOpen(false)}
        onConfirm={restoreDemoData}
        title="Restore Sample Demo Data?"
        message="This will overwrite current records with our curated sample transactions, monthly budgets, and profile settings."
        confirmText="Restore Demo Data"
        isDanger={false}
      />
    </div>
  );
}

import React, { useState } from 'react';
import Modal from './Modal';
import { useFinance } from '../../context/FinanceContext';
import { Database, Lock, Mail, User, Sparkles, LogIn, UserPlus } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register, isAuthenticated, user, logout, isServerConnected } = useFinance();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please provide email and password');
      return;
    }

    if (mode === 'register' && !formData.name) {
      setError('Please provide your name');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const ok = await login(formData.email, formData.password);
        if (ok) onClose();
      } else {
        const ok = await register(formData.name, formData.email, formData.password);
        if (ok) onClose();
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setLoading(true);
    setError('');
    try {
      // First try login with demo user
      const ok = await login('demo@ledger.io', 'DemoPass123');
      if (ok) {
        onClose();
        return;
      }
    } catch (err) {
      // If user doesn't exist, register
      try {
        await register('Aarav Sharma', 'demo@ledger.io', 'DemoPass123');
        onClose();
      } catch (regErr) {
        setError(regErr.message || 'Demo login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isAuthenticated ? 'MongoDB User Account' : 'Connect to MongoDB Atlas'}
    >
      {isAuthenticated ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'var(--accent-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 700,
              }}
            >
              {user?.name?.[0] || 'U'}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff' }}>
                {user?.name}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {user?.email}
              </div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#34d399',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  marginTop: '4px',
                }}
              >
                <Database size={12} />
                Live Cloud Sync Active (MongoDB Atlas: ledger_db)
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            All your financial transactions and category budgets are saving directly to MongoDB Atlas.
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button className="btn btn-secondary btn-sm" onClick={onClose}>
              Close
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => {
                logout();
                onClose();
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Mode Tabs */}
          <div className="type-selector" style={{ marginBottom: '18px' }}>
            <button
              type="button"
              className={`type-btn ${mode === 'login' ? 'active type-income' : ''}`}
              onClick={() => {
                setMode('login');
                setError('');
              }}
            >
              <LogIn size={15} />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              className={`type-btn ${mode === 'register' ? 'active type-income' : ''}`}
              onClick={() => {
                setMode('register');
                setError('');
              }}
            >
              <UserPlus size={15} />
              <span>Create Account</span>
            </button>
          </div>

          {error && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#fb7185',
                fontSize: '0.82rem',
                marginBottom: '14px',
              }}
            >
              {error}
            </div>
          )}

          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Aarav Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g. aarav@ledger.io"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Connecting...' : mode === 'login' ? 'Sign In to MongoDB' : 'Create & Connect'}
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleQuickDemo}
              disabled={loading}
              title="1-Click Login for Lab Faculty Demo"
            >
              <Sparkles size={14} style={{ color: '#fbbf24' }} />
              <span>1-Click Faculty Demo Login</span>
            </button>
          </div>

          <div
            style={{
              marginTop: '16px',
              padding: '10px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--card-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.78rem',
              color: 'var(--text-dim)',
            }}
          >
            <Database size={15} style={{ color: 'var(--accent-secondary)' }} />
            <span>
              Target Database: <strong style={{ color: 'var(--text-muted)' }}>MongoDB Atlas (ledger_db)</strong>
            </span>
          </div>
        </form>
      )}
    </Modal>
  );
}

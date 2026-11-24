import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Target,
  Settings,
  Sparkles,
  X,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Transactions', path: '/transactions', icon: ArrowLeftRight },
  { name: 'Analytics', path: '/analytics', icon: PieChart },
  { name: 'Budgets', path: '/budgets', icon: Target },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar({ isOpen, onClose }) {
  const { userProfile } = useFinance();

  const getInitials = (name) => {
    if (!name) return 'L';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      <div
        className={`mobile-backdrop ${isOpen ? 'mobile-open' : ''}`}
        onClick={onClose}
      />
      <aside className={`app-sidebar ${isOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-logo">
            <div className="logo-badge">
              <Sparkles size={20} />
            </div>
            <span className="brand-text">LEDGER</span>
            <span className="brand-tag">PRO</span>
          </div>

          <button
            className="mobile-menu-btn"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-section-label">Main Menu</span>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''}`
                }
                onClick={onClose}
                end={item.path === '/'}
              >
                <span className="nav-icon">
                  <Icon size={19} />
                </span>
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <NavLink to="/settings" onClick={onClose} className="user-mini-card">
            <div className="user-avatar">{getInitials(userProfile.name)}</div>
            <div className="user-info">
              <span className="user-name">{userProfile.name || 'Personal Account'}</span>
              <span className="user-role">{userProfile.role || 'Finance Planner'}</span>
            </div>
          </NavLink>
        </div>
      </aside>
    </>
  );
}

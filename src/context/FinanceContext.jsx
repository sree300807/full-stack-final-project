import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { INITIAL_TRANSACTIONS, INITIAL_BUDGETS, INITIAL_SETTINGS } from '../data/initialData';
import { useToast } from './ToastContext';
import { getLastNMonths, getTodayDateString } from '../utils/dateUtils';
import { authApi, transactionsApi, budgetsApi, checkServerHealth } from '../services/api';

const STORAGE_KEYS = {
  TRANSACTIONS: 'ledger_transactions_v2',
  BUDGETS: 'ledger_budgets_v2',
  SETTINGS: 'ledger_settings_v2',
  AUTH_TOKEN: 'ledger_auth_token',
  USER_DATA: 'ledger_user_data',
};

const FinanceContext = createContext(null);

export function FinanceProvider({ children }) {
  const { showToast } = useToast();

  const [isServerConnected, setIsServerConnected] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || '');
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Local Transactions Cache
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed reading transactions from localStorage', e);
    }
    return INITIAL_TRANSACTIONS;
  });

  // Local Budgets Cache
  const [budgets, setBudgets] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BUDGETS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed reading budgets from localStorage', e);
    }
    return INITIAL_BUDGETS;
  });

  // Local Settings Cache
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed reading settings from localStorage', e);
    }
    return INITIAL_SETTINGS;
  });

  // Check Backend Server Status on mount
  useEffect(() => {
    checkServerHealth().then(({ isConnected }) => {
      setIsServerConnected(isConnected);
    });
  }, []);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed saving transactions', e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
    } catch (e) {
      console.error('Failed saving budgets', e);
    }
  }, [budgets]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed saving settings', e);
    }

    if (settings.theme) {
      document.documentElement.setAttribute('data-theme', settings.theme);
    }
  }, [settings]);

  // Fetch data from MongoDB Atlas when user is authenticated
  const fetchRemoteData = useCallback(async () => {
    try {
      const [txRes, bgtRes] = await Promise.all([
        transactionsApi.getAll(),
        budgetsApi.getAll(),
      ]);

      if (txRes.success && Array.isArray(txRes.data)) {
        // Map MongoDB _id to id for seamless UI compatibility
        const mappedTx = txRes.data.map((t) => ({
          ...t,
          id: t._id || t.id,
          date: t.date ? t.date.slice(0, 10) : getTodayDateString(),
        }));
        setTransactions(mappedTx);
      }

      if (bgtRes.success && Array.isArray(bgtRes.data)) {
        const bgtMap = {};
        bgtRes.data.forEach((b) => {
          bgtMap[b.category] = b.limit;
        });
        setBudgets(bgtMap);
      }
    } catch (err) {
      console.warn('Could not sync with MongoDB Atlas:', err.message);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchRemoteData();
    }
  }, [token, fetchRemoteData]);

  // Authentication Actions
  const login = async (email, password) => {
    try {
      const res = await authApi.login({ email, password });
      if (res.success && res.data.token) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, res.data.token);
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(res.data));
        setToken(res.data.token);
        setUser(res.data);
        setIsServerConnected(true);
        showToast('Signed in! Connected to MongoDB Atlas.', 'success');
        return true;
      }
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
      throw err;
    }
    return false;
  };

  const register = async (name, email, password) => {
    try {
      const res = await authApi.register({ name, email, password });
      if (res.success && res.data.token) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, res.data.token);
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(res.data));
        setToken(res.data.token);
        setUser(res.data);
        setIsServerConnected(true);
        showToast('Account created & connected to MongoDB Atlas!', 'success');
        return true;
      }
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
      throw err;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    setToken('');
    setUser(null);
    showToast('Signed out of MongoDB account.', 'info');
  };

  // Transaction Actions (with live MongoDB sync)
  const addTransaction = async (tx) => {
    if (!tx.description || !tx.amount || !tx.category || !tx.date) {
      showToast('Please fill in all required fields.', 'error');
      return false;
    }

    const tempId = `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newTx = {
      id: tempId,
      description: tx.description.trim(),
      amount: parseFloat(tx.amount),
      type: tx.type || 'expense',
      category: tx.category,
      date: tx.date || getTodayDateString(),
      notes: (tx.notes || '').trim(),
      createdAt: new Date().toISOString(),
    };

    // Optimistically update local state
    setTransactions((prev) => [newTx, ...prev]);

    // If authenticated, sync with MongoDB Atlas
    if (token) {
      try {
        const res = await transactionsApi.create(newTx);
        if (res.success && res.data) {
          // Replace temporary ID with MongoDB ObjectID
          setTransactions((prev) =>
            prev.map((t) => (t.id === tempId ? { ...t, id: res.data._id, _id: res.data._id } : t))
          );
          showToast(`Saved to MongoDB Atlas!`, 'success');
          return true;
        }
      } catch (err) {
        console.warn('MongoDB Atlas write fallback:', err.message);
      }
    }

    showToast(`${tx.type === 'income' ? 'Income' : 'Expense'} added!`, 'success');
    return true;
  };

  const updateTransaction = async (id, updatedData) => {
    if (!id) return false;

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id || t._id === id
          ? {
              ...t,
              ...updatedData,
              amount: parseFloat(updatedData.amount),
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );

    if (token) {
      try {
        await transactionsApi.update(id, updatedData);
        showToast('Updated in MongoDB Atlas!', 'success');
        return true;
      } catch (err) {
        console.warn('MongoDB Atlas update fallback:', err.message);
      }
    }

    showToast('Transaction updated!', 'success');
    return true;
  };

  const deleteTransaction = async (id) => {
    if (!id) return false;

    setTransactions((prev) => prev.filter((t) => t.id !== id && t._id !== id));

    if (token) {
      try {
        await transactionsApi.delete(id);
        showToast('Deleted from MongoDB Atlas!', 'info');
        return true;
      } catch (err) {
        console.warn('MongoDB Atlas delete fallback:', err.message);
      }
    }

    showToast('Transaction deleted.', 'info');
    return true;
  };

  // Budget Actions (with live MongoDB sync)
  const setCategoryBudget = async (category, amount) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 0) {
      showToast('Please enter a valid budget amount', 'error');
      return false;
    }

    setBudgets((prev) => ({
      ...prev,
      [category]: numAmount,
    }));

    if (token) {
      try {
        await budgetsApi.set(category, numAmount);
        showToast(`Budget saved to MongoDB Atlas!`, 'success');
        return true;
      } catch (err) {
        console.warn('MongoDB budget save fallback:', err.message);
      }
    }

    showToast(`Budget for ${category} updated!`, 'success');
    return true;
  };

  const deleteCategoryBudget = async (category) => {
    setBudgets((prev) => {
      const copy = { ...prev };
      delete copy[category];
      return copy;
    });

    showToast(`Budget for ${category} removed`, 'info');
    return true;
  };

  // Settings Actions
  const updateSettings = (newSettings) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
    showToast('Settings saved successfully!', 'success');
  };

  const updateCurrency = (currency) => {
    setSettings((prev) => ({ ...prev, currency }));
    showToast(`Currency changed to ${currency}`, 'info');
  };

  const updateTheme = (theme) => {
    setSettings((prev) => ({ ...prev, theme }));
    showToast(`Theme updated to ${theme}`, 'info');
  };

  const clearAllData = () => {
    setTransactions([]);
    setBudgets({});
    showToast('All financial data has been wiped.', 'info');
  };

  const restoreDemoData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setBudgets(INITIAL_BUDGETS);
    setSettings(INITIAL_SETTINGS);
    showToast('Demo financial data restored successfully!', 'success');
  };

  // Financial Calculations & Metrics
  const metrics = useMemo(() => {
    let totalIncome = 0;
    let totalExpenses = 0;

    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    let currentMonthIncome = 0;
    let currentMonthExpenses = 0;

    const categorySpendMonth = {};
    const categorySpendAllTime = {};

    transactions.forEach((tx) => {
      const amt = Number(tx.amount) || 0;
      const txMonthKey = tx.date ? tx.date.slice(0, 7) : '';

      if (tx.type === 'income') {
        totalIncome += amt;
        if (txMonthKey === currentMonthKey) {
          currentMonthIncome += amt;
        }
      } else {
        totalExpenses += amt;
        categorySpendAllTime[tx.category] = (categorySpendAllTime[tx.category] || 0) + amt;

        if (txMonthKey === currentMonthKey) {
          currentMonthExpenses += amt;
          categorySpendMonth[tx.category] = (categorySpendMonth[tx.category] || 0) + amt;
        }
      }
    });

    const totalBalance = totalIncome - totalExpenses;
    const monthlySavings = currentMonthIncome - currentMonthExpenses;
    const savingsRate = currentMonthIncome > 0 ? Math.round((monthlySavings / currentMonthIncome) * 100) : 0;

    const last6Months = getLastNMonths(6);
    const monthlyTrends = last6Months.map(({ key, label, fullLabel }) => {
      let income = 0;
      let expenses = 0;
      transactions.forEach((tx) => {
        if (tx.date && tx.date.startsWith(key)) {
          if (tx.type === 'income') income += Number(tx.amount) || 0;
          else expenses += Number(tx.amount) || 0;
        }
      });
      const savings = income - expenses;
      return {
        month: label,
        fullLabel,
        key,
        income,
        expenses,
        savings,
      };
    });

    const budgetList = Object.entries(budgets).map(([category, limit]) => {
      const spent = categorySpendMonth[category] || 0;
      const remaining = Math.max(0, limit - spent);
      const percent = limit > 0 ? Math.round((spent / limit) * 100) : 0;
      let status = 'normal';
      if (percent >= 100) status = 'danger';
      else if (percent >= 80) status = 'warning';

      return {
        category,
        limit,
        spent,
        remaining,
        percent,
        status,
        isOverBudget: percent > 100,
      };
    });

    budgetList.sort((a, b) => b.percent - a.percent);

    const totalBudgetLimit = Object.values(budgets).reduce((acc, curr) => acc + curr, 0);
    const totalBudgetSpent = budgetList.reduce((acc, curr) => acc + curr.spent, 0);

    return {
      totalBalance,
      totalIncome,
      totalExpenses,
      currentMonthKey,
      currentMonthIncome,
      currentMonthExpenses,
      monthlySavings,
      savingsRate,
      monthlyTrends,
      categorySpendMonth,
      categorySpendAllTime,
      budgetList,
      totalBudgetLimit,
      totalBudgetSpent,
    };
  }, [transactions, budgets]);

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions]);

  const recentTransactions = useMemo(() => {
    return sortedTransactions.slice(0, 6);
  }, [sortedTransactions]);

  const value = {
    transactions: sortedTransactions,
    rawTransactions: transactions,
    budgets,
    settings,
    currency: settings.currency || 'INR',
    theme: settings.theme || 'midnight',
    userProfile: user || settings.userProfile || {},
    metrics,
    recentTransactions,
    // Database & Auth state
    user,
    token,
    isAuthenticated: Boolean(token),
    isServerConnected,
    login,
    register,
    logout,
    // CRUD Actions
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setCategoryBudget,
    deleteCategoryBudget,
    updateSettings,
    updateCurrency,
    updateTheme,
    clearAllData,
    restoreDemoData,
    fetchRemoteData,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}

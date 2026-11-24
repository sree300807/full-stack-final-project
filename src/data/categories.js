// Category definitions with icons, vibrant colors, and gradients

export const EXPENSE_CATEGORIES = [
  {
    id: 'food',
    name: 'Food',
    type: 'expense',
    color: '#f59e0b', // Amber
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    icon: 'UtensilsCrossed',
    bgSoft: 'rgba(245, 158, 11, 0.15)',
  },
  {
    id: 'shopping',
    name: 'Shopping',
    type: 'expense',
    color: '#ec4899', // Pink
    gradient: 'linear-gradient(135deg, #ec4899, #be185d)',
    icon: 'ShoppingBag',
    bgSoft: 'rgba(236, 72, 153, 0.15)',
  },
  {
    id: 'travel',
    name: 'Travel',
    type: 'expense',
    color: '#3b82f6', // Blue
    gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    icon: 'Car',
    bgSoft: 'rgba(59, 130, 246, 0.15)',
  },
  {
    id: 'education',
    name: 'Education',
    type: 'expense',
    color: '#8b5cf6', // Violet
    gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    icon: 'GraduationCap',
    bgSoft: 'rgba(139, 92, 246, 0.15)',
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    type: 'expense',
    color: '#a855f7', // Purple
    gradient: 'linear-gradient(135deg, #a855f7, #7e22ce)',
    icon: 'Film',
    bgSoft: 'rgba(168, 85, 247, 0.15)',
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    type: 'expense',
    color: '#ef4444', // Red
    gradient: 'linear-gradient(135deg, #ef4444, #b91c1c)',
    icon: 'HeartPulse',
    bgSoft: 'rgba(239, 68, 68, 0.15)',
  },
  {
    id: 'bills',
    name: 'Bills',
    type: 'expense',
    color: '#06b6d4', // Cyan
    gradient: 'linear-gradient(135deg, #06b6d4, #0e7490)',
    icon: 'Receipt',
    bgSoft: 'rgba(6, 182, 212, 0.15)',
  },
  {
    id: 'others',
    name: 'Others',
    type: 'expense',
    color: '#64748b', // Slate
    gradient: 'linear-gradient(135deg, #64748b, #475569)',
    icon: 'MoreHorizontal',
    bgSoft: 'rgba(100, 116, 139, 0.15)',
  },
];

export const INCOME_CATEGORIES = [
  {
    id: 'salary',
    name: 'Salary',
    type: 'income',
    color: '#10b981', // Emerald
    gradient: 'linear-gradient(135deg, #10b981, #047857)',
    icon: 'Briefcase',
    bgSoft: 'rgba(16, 185, 129, 0.15)',
  },
  {
    id: 'freelance',
    name: 'Freelance',
    type: 'income',
    color: '#14b8a6', // Teal
    gradient: 'linear-gradient(135deg, #14b8a6, #0f766e)',
    icon: 'Laptop',
    bgSoft: 'rgba(20, 184, 166, 0.15)',
  },
  {
    id: 'investment',
    name: 'Investment',
    type: 'income',
    color: '#6366f1', // Indigo
    gradient: 'linear-gradient(135deg, #6366f1, #4338ca)',
    icon: 'TrendingUp',
    bgSoft: 'rgba(99, 102, 241, 0.15)',
  },
  {
    id: 'other_income',
    name: 'Other Income',
    type: 'income',
    color: '#84cc16', // Lime
    gradient: 'linear-gradient(135deg, #84cc16, #4d7c0f)',
    icon: 'Coins',
    bgSoft: 'rgba(132, 204, 22, 0.15)',
  },
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export function getCategoryMeta(categoryName, type = 'expense') {
  if (!categoryName) {
    return {
      name: 'Uncategorized',
      color: '#94a3b8',
      gradient: 'linear-gradient(135deg, #94a3b8, #64748b)',
      icon: 'HelpCircle',
      bgSoft: 'rgba(148, 163, 184, 0.15)',
    };
  }

  const match = ALL_CATEGORIES.find(
    (c) => c.name.toLowerCase() === categoryName.toLowerCase()
  );

  if (match) return match;

  return {
    name: categoryName,
    color: type === 'income' ? '#10b981' : '#f59e0b',
    gradient: type === 'income' 
      ? 'linear-gradient(135deg, #10b981, #047857)' 
      : 'linear-gradient(135deg, #6366f1, #4338ca)',
    icon: type === 'income' ? 'ArrowDownLeft' : 'ArrowUpRight',
    bgSoft: type === 'income' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
  };
}

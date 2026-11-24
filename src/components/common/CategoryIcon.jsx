import React from 'react';
import {
  UtensilsCrossed,
  ShoppingBag,
  Car,
  GraduationCap,
  Film,
  HeartPulse,
  Receipt,
  MoreHorizontal,
  Briefcase,
  Laptop,
  TrendingUp,
  Coins,
  ArrowUpRight,
  ArrowDownLeft,
  HelpCircle,
  Tag,
} from 'lucide-react';

const iconMap = {
  UtensilsCrossed,
  ShoppingBag,
  Car,
  GraduationCap,
  Film,
  HeartPulse,
  Receipt,
  MoreHorizontal,
  Briefcase,
  Laptop,
  TrendingUp,
  Coins,
  ArrowUpRight,
  ArrowDownLeft,
  HelpCircle,
  Tag,
};

export default function CategoryIcon({ name, size = 18, className = '' }) {
  const IconComponent = iconMap[name] || Tag;
  return <IconComponent size={size} className={className} />;
}

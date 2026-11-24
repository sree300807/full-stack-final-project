# LEDGER • Premium Personal Finance Web Application

A commercial-grade, responsive personal finance management dashboard built with React, Vite, CSS3, Lucide Icons, and Recharts.

![LEDGER Banner](https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80)

---

## ✨ Features Overview

### 1. 📊 Executive Dashboard
- **Real-Time Financial Health Metrics**: Total Balance, Total Income, Total Expenses, and Monthly Savings with savings rate calculations.
- **Interactive Recharts Visualizations**:
  - Multi-bar **Income vs Expense Trend** across months with custom currency-aware tooltips.
  - Donut **Expense Distribution** with percentage share and category badges.
- **Quick Add Transaction**: Instant modal popup from header or dashboard.
- **Recent Activity Ledger**: Immediate view of latest transactions with category styling.

### 2. 💳 Transaction Register & Management
- Full **CRUD** operations: Create, Read, Update, Delete transactions with validation.
- Dual Transaction Types: **Income** (Emerald) & **Expense** (Rose).
- **Search & Deep Filtering**:
  - Free-text search by description or notes.
  - Type toggle (All / Expense / Income).
  - Category selector.
  - Sort by Newest, Oldest, Highest Amount, or Lowest Amount.
- **One-Click CSV Export**: Download filtered transaction histories directly into Excel/Google Sheets.

### 3. 📈 Financial Analytics & Deep Insights
- **Monthly Spending Trends**: Area flow and multi-bar cashflow charts.
- **Category-wise Spending Breakdown**: Interactive donut chart paired with proportional progress bars.
- **Savings Analysis**: Instant savings rate calculation and trajectory indicator.
- **Monthly Financial Ledger Table**: Month-by-month tabular breakdown of inflows, outflows, and net savings.

### 4. 🎯 Budget Management & Over-Spend Guard
- **Monthly Budget Limits**: Set custom spending caps for each category (Food, Shopping, Travel, Bills, Entertainment, Healthcare, Education, Others).
- **Real-Time Utilization Bars**: Color-coded progress indicators:
  - 🟢 **Normal**: < 80% utilized.
  - 🟡 **Warning**: 80% – 100% utilized.
  - 🔴 **Danger**: > 100% exceeded.
- **Over-Budget Alert Banners**: Highlights exact rupee/dollar amount exceeded.

### 5. ⚙️ Settings & Customization
- **User Profile Management**: Update full name, email, job title, and monthly savings goal.
- **Multi-Currency Engine**: Choose between **INR (₹)**, **USD ($)**, **EUR (€)**, **GBP (£)**, **JPY (¥)**, **CAD (CA$)**, **AUD (AU$)**, and **AED (AED)**.
- **4 Premium FinTech Themes**:
  - 🌌 **Midnight Navy** (Default)
  - 👑 **Royal Purple**
  - ⚡ **Jet Obsidian**
  - 🌿 **Emerald Luxe**
- **Data Safeguards**: One-click **Demo Data Restoration** and secure **Data Wipe** with modal confirmation.

---

## 🛠️ Technology Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM (v6)
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Storage**: Browser HTML5 `localStorage` (Zero external database required)
- **Styling**: Modular CSS3 with CSS Custom Properties and Glassmorphism

---

## 🚀 Running the Project

```bash
# Navigate to project folder
cd /Users/bookpro/.gemini/antigravity/scratch/ledger-finance-app

# Install dependencies (already installed)
npm install

# Start Vite dev server (port 3000)
npm run dev

# Create production build
npm run build
```

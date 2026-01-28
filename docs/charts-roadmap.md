# Charts & Data Visualization Roadmap

**Created:** January 27, 2026
**Status:** Living Document

---

## Overview

This document outlines the data visualization strategy for Cash Flow Forecaster, including implemented charts and future priorities.

---

## Implemented Charts

### 1. Payoff Timeline Chart
- **Location:** `/dashboard/debt-payoff`
- **Component:** `components/charts/payoff-timeline-chart.tsx`
- **Purpose:** Visualize debt decreasing over time with card payoff milestones
- **Features:**
  - Area chart showing total balance declining
  - Green dashed reference lines marking when each card is paid off
  - Custom tooltip with balance and payoff celebrations
  - Legend showing payoff dates for each card

### 2. Forecast Balance Chart ✨ NEW
- **Location:** Dashboard home (3-Month Forecast section)
- **Component:** `components/charts/forecast-balance-chart.tsx`
- **Purpose:** Show projected cash flow balance over the forecast period
- **Features:**
  - Area chart with teal (healthy) or rose (negative) coloring
  - Highlighted dot marking the lowest balance point
  - Yellow dashed line showing safety buffer threshold
  - Red dashed line at $0 if balance goes negative
  - Responsive design, samples data points for performance

---

## Priority Chart Roadmap

| Priority | Chart | Location | Purpose | Effort | Status |
|----------|-------|----------|---------|--------|--------|
| 1 | **Forecast Balance** | Dashboard | Show cash flow trend over time | Medium | ✅ Done |
| 2 | **Income vs Expenses** | Dashboard | Monthly comparison visual | Low | Pending |
| 3 | **Category Spending** | Bills Page | Spending breakdown by category | Low | Pending |
| 4 | **Account Distribution** | Accounts Page | Balance breakdown across accounts | Low | Pending |
| 5 | **CC Balance Projection** | CC Simulator | Payment impact over time | Medium | Pending |
| 6 | **Invoice Status** | Invoices Page | Paid/Pending/Overdue breakdown | Low | Pending |
| 7 | **Income by Client** | Income Page | Revenue breakdown by source | Low | Pending |

---

## Chart Specifications

### Priority 2: Income vs Expenses Bar Chart

**Location:** Dashboard home page (below KPI cards or in forecast section)

**Design:**
```
Monthly Cash Flow
┌─────────────────────────────────────────┐
│                                         │
│  ████████████████████  $53,300 Income   │
│  ████████████         $35,411 Bills     │
│                                         │
│  Net: +$17,889/mo                       │
└─────────────────────────────────────────┘
```

**Data Source:** `forecastMetrics.totalIncome` and `forecastMetrics.totalBills`

**Implementation Notes:**
- Simple horizontal bar chart
- Green for income, rose for bills
- Show net surplus/deficit below

---

### Priority 3: Category Spending Chart

**Location:** Bills page (`/dashboard/bills`)

**Design:**
```
Spending by Category
┌─────────────────────────────────────────┐
│ Housing      ████████████████  $2,500   │
│ Utilities    ████████         $800      │
│ Insurance    ██████           $450      │
│ Subscriptions ████            $200      │
│ Other        ██               $100      │
└─────────────────────────────────────────┘
```

**Data Source:** Bills table with `category` field

**Implementation Notes:**
- Horizontal bar chart sorted by amount (descending)
- Use category colors if available
- Link bars to filtered bill list

---

### Priority 4: Account Distribution Donut

**Location:** Accounts page (`/dashboard/accounts`)

**Design:**
```
      Account Balances
         ┌─────┐
       ╱         ╲
      │  $3,422   │
      │   Total   │
       ╲         ╱
         └─────┘

  ● Checking  $2,100  (61%)
  ● Savings   $1,322  (39%)
```

**Data Source:** Accounts table with `current_balance`

**Implementation Notes:**
- Donut chart with total in center
- Legend below with percentages
- Handle negative balances (credit cards) appropriately

---

### Priority 5: CC Balance Projection

**Location:** Credit card payment simulator modal

**Design:**
```
Balance Over Time
┌─────────────────────────────────────────┐
│ $5k ┤                                   │
│ $4k ┤──╲                                │
│ $3k ┤    ╲──╲                           │
│ $2k ┤        ╲──╲                       │
│ $1k ┤            ╲──╲                   │
│  $0 ┼────────────────╲──────────────    │
│     Month 1     6     12    18    24    │
└─────────────────────────────────────────┘
```

**Data Source:** Payment simulation calculations

**Implementation Notes:**
- Show balance declining with different payment amounts
- Multiple lines for comparison (min payment vs proposed)
- Highlight payoff month

---

## Design Guidelines

### Colors
- **Positive/Income:** Teal (`#14b8a6`) or Emerald (`#10b981`)
- **Negative/Bills:** Rose (`#f43f5e`)
- **Warning:** Amber (`#f59e0b`)
- **Neutral:** Zinc (`#71717a`, `#a1a1aa`)

### Gradients
```tsx
<linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
</linearGradient>
```

### Typography
- Axis labels: `text-xs` (10-11px), `text-zinc-400`
- Tooltip headers: `text-sm font-medium text-zinc-100`
- Values: `text-sm` with appropriate color

### Responsiveness
- Use `ResponsiveContainer` for all charts
- Reduce data points on mobile if needed
- Hide less important elements on small screens

---

## Technical Notes

### Library
Using **Recharts** (`recharts@3.6.0`)
- Popular, well-maintained
- Good TypeScript support
- Works well with Tailwind

### Component Structure
```
components/
  charts/
    forecast-balance-chart.tsx    ✅ Implemented
    payoff-timeline-chart.tsx     ✅ Implemented
    income-vs-expenses-chart.tsx  (future)
    category-spending-chart.tsx   (future)
    account-distribution-chart.tsx (future)
```

### Performance Considerations
- Sample data points for large datasets (e.g., 365 days → ~30 points)
- Define tooltip components outside render functions
- Use `useMemo` for expensive calculations
- Memoize formatters with `useCallback`

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| Jan 2026 | Recharts as chart library | Popular, TypeScript support, Tailwind-compatible |
| Jan 2026 | Forecast chart as first dashboard chart | Highest impact, shows core value proposition |
| Jan 2026 | Area charts for trends, bars for comparisons | Industry standard for financial data |
| Jan 2026 | Sample data points for performance | 365 days of data would slow rendering |

---

**Document Version:** 1.0
**Last Updated:** January 27, 2026
**Next Review:** February 2026

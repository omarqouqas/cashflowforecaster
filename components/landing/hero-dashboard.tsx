'use client';

import React, { useState, useEffect } from 'react';
import { Pencil } from 'lucide-react';

// Interactive Hero Dashboard for Landing Page
// Design: Premium fintech with bold focal points and breathing room

export default function HeroDashboard() {
  const [isVisible, setIsVisible] = useState(false);
  const [chartHovered, setChartHovered] = useState<number | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Sample data matching the screenshots
  const stats = {
    safeToSpend: 203.5,
    buffer: 200,
    starting: 1000,
    lowest: 403.5,
    lowestDate: 'Thu, Jan 29',
    income: 183400,
    bills: 147092,
    endBalance: 37308,
    netChange: 36346.2,
  };

  const weekDays = [
    { day: 'TODAY', date: 19, balance: 811, change: -189, expense: 'Marriott', items: 1, status: 'safe' },
    { day: 'Tue', date: 20, balance: 811, change: null, expense: null, items: 0, status: 'safe' },
    { day: 'Wed', date: 21, balance: 811, change: null, expense: null, items: 0, status: 'safe' },
    { day: 'Thu', date: 22, balance: 811, change: null, expense: null, items: 0, status: 'safe' },
    { day: 'Fri', date: 23, balance: 603.5, change: -207.5, expense: 'Racket...', items: 1, status: 'caution' },
    { day: 'Sat', date: 24, balance: 603.5, change: null, expense: null, items: 0, status: 'caution' },
    { day: 'Sun', date: 25, balance: 603.5, change: null, expense: null, items: 0, status: 'caution' },
  ];

  // Chart data points for SVG path
  const chartPoints = [
    { x: 0, y: 85, label: 'Jan 21', value: 8500 },
    { x: 8, y: 75, label: 'Feb 16', value: 12000 },
    { x: 16, y: 65, label: 'Mar 14', value: 18000 },
    { x: 24, y: 58, label: 'Apr 8', value: 22000 },
    { x: 32, y: 52, label: 'May 2', value: 25000 },
    { x: 40, y: 48, label: 'May 28', value: 27000 },
    { x: 48, y: 42, label: 'Jun 24', value: 30000 },
    { x: 56, y: 38, label: 'Jul 19', value: 32000 },
    { x: 64, y: 33, label: 'Aug 13', value: 35000 },
    { x: 72, y: 28, label: 'Sep 7', value: 38000 },
    { x: 80, y: 23, label: 'Oct 1', value: 40000 },
    { x: 88, y: 18, label: 'Oct 26', value: 43000 },
    { x: 96, y: 12, label: 'Nov 21', value: 46000 },
    { x: 100, y: 10, label: 'Dec 17', value: 47000 },
  ];

  const formatCurrency = (amount: number, compact = false) => {
    if (compact && amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe':
        return 'bg-emerald-500/10 border-emerald-500/20';
      case 'caution':
        return 'bg-amber-500/10 border-amber-500/20';
      case 'low':
        return 'bg-orange-500/10 border-orange-500/20';
      case 'danger':
        return 'bg-rose-500/10 border-rose-500/20';
      default:
        return 'bg-zinc-800/50 border-zinc-700/50';
    }
  };

  return (
    <div
      className={`transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* HERO CARD - Safe to Spend (THE FOCAL POINT) */}
      <div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 via-zinc-900 to-zinc-900 border border-emerald-500/20 p-8 mb-4 transition-all duration-500 delay-100 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Subtle glow effect */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Safe to Spend</span>
            <div className="group relative">
              <svg
                className="w-4 h-4 text-zinc-500 cursor-help"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-zinc-800 rounded-lg text-xs text-zinc-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Amount you can spend without going below your buffer
              </div>
            </div>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-6xl md:text-7xl font-bold text-zinc-50 tracking-tight tabular-nums">
              ${stats.safeToSpend.toFixed(2).split('.')[0]}
            </span>
            <span className="text-3xl md:text-4xl font-semibold text-zinc-400">
              .{stats.safeToSpend.toFixed(2).split('.')[1]}
            </span>
          </div>

          <p className="text-zinc-500 mt-2 text-sm">
            Without going below your{' '}
            <span className="inline-flex items-center gap-1 text-zinc-400 hover:text-emerald-400 cursor-pointer transition-colors">
              ${stats.buffer.toFixed(2)} buffer
              <Pencil className="w-3 h-3" />
            </span>
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div
        className={`grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 transition-all duration-500 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {[
          { label: 'Starting', value: formatCurrency(stats.starting), sub: 'Today', warn: false, isExpense: false },
          { label: 'Lowest', value: formatCurrency(stats.lowest), sub: stats.lowestDate, warn: true, isExpense: false },
          { label: 'Income', value: formatCurrency(stats.income, true), sub: 'Next 60 days', warn: false, isExpense: false },
          {
            label: 'Bills',
            value: formatCurrency(stats.bills, true),
            sub: `End: ${formatCurrency(stats.endBalance, true)}`,
            warn: false,
            isExpense: true,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="group bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-5 hover:border-zinc-700 hover:bg-zinc-900 transition-all cursor-default"
          >
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">{stat.label}</p>
            <p
              className={`text-xl font-semibold tabular-nums ${
                stat.isExpense ? 'text-rose-400' : stat.warn ? 'text-amber-400' : 'text-zinc-100'
              }`}
            >
              {stat.value}
            </p>
            <p className="text-xs text-zinc-600 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Balance Forecast Chart */}
      <div
        className={`bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-4 transition-all duration-500 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">Balance Forecast</h2>
            <p className="text-sm text-zinc-500 mt-0.5">365-day projection</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <div className="text-right">
              <p className="text-xl font-bold text-emerald-400 tabular-nums">+{formatCurrency(stats.netChange)}</p>
              <p className="text-xs text-emerald-400/60">Net change</p>
            </div>
          </div>
        </div>

        {/* SVG Chart with Y-axis */}
        <div className="flex">
          {/* Y-axis labels */}
          <div className="w-12 flex flex-col justify-between text-xs text-zinc-500 pr-2 py-1">
            <span>$60K</span>
            <span>$45K</span>
            <span>$30K</span>
            <span>$15K</span>
            <span>$0</span>
          </div>

          {/* Chart container */}
          <div className="flex-1 relative h-48">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="w-full h-full"
              onMouseLeave={() => setChartHovered(null)}
            >
              {/* Grid lines */}
              <defs>
                <linearGradient id="heroAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgb(16 185 129)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="rgb(16 185 129)" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="heroLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgb(16 185 129)" />
                  <stop offset="100%" stopColor="rgb(45 212 191)" />
                </linearGradient>
              </defs>

              {/* Horizontal grid lines */}
              {[20, 40, 60, 80].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="100"
                  y2={y}
                  stroke="rgb(63 63 70)"
                  strokeWidth="0.2"
                  strokeDasharray="2 2"
                />
              ))}

              {/* Zero line (safety buffer) */}
              <line x1="0" y1="95" x2="100" y2="95" stroke="rgb(234 179 8)" strokeWidth="0.3" strokeDasharray="3 2" />

              {/* Area fill */}
              <path
                d={`M0,100 ${chartPoints.map((p) => `L${p.x},${p.y}`).join(' ')} L100,100 Z`}
                fill="url(#heroAreaGradient)"
              />

              {/* Main line */}
              <path
                d={`M${chartPoints.map((p) => `${p.x},${p.y}`).join(' L')}`}
                fill="none"
                stroke="url(#heroLineGradient)"
                strokeWidth="0.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive points */}
              {chartPoints.map((point, i) => (
                <g key={i} onMouseEnter={() => setChartHovered(i)}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={chartHovered === i ? '1.5' : '0.8'}
                    fill="rgb(16 185 129)"
                    className="transition-all duration-200"
                  />
                  {chartHovered === i && (
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="3"
                      fill="none"
                      stroke="rgb(16 185 129)"
                      strokeWidth="0.3"
                      opacity="0.5"
                    />
                  )}
                </g>
              ))}
            </svg>

            {/* Tooltip */}
            {chartHovered !== null && chartPoints[chartHovered] && (
              <div
                className="absolute bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm pointer-events-none shadow-xl z-10"
                style={{
                  left: `${chartPoints[chartHovered]!.x}%`,
                  top: `${chartPoints[chartHovered]!.y - 15}%`,
                  transform: 'translate(-50%, -100%)',
                }}
              >
                <p className="text-zinc-400 text-xs">{chartPoints[chartHovered]!.label}</p>
                <p className="text-emerald-400 font-semibold">{formatCurrency(chartPoints[chartHovered]!.value)}</p>
              </div>
            )}
          </div>
        </div>

        {/* X-axis labels */}
        <div className="flex justify-between text-xs text-zinc-500 mt-2 ml-12">
          <span>Jan 21</span>
          <span>Apr 8</span>
          <span>Jun 24</span>
          <span>Sep 7</span>
          <span>Dec 17</span>
        </div>
      </div>

      {/* Weekly Calendar Strip */}
      <div
        className={`transition-all duration-500 delay-[400ms] ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <h3 className="text-base font-semibold text-zinc-100 mb-3">January 2026</h3>

        {/* Mobile: horizontal scroll with snap, Desktop: grid */}
        <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-7 sm:gap-1.5 sm:overflow-visible sm:pb-0">
          {weekDays.map((day, i) => (
            <div
              key={i}
              className={`relative rounded-xl border min-w-[72px] sm:min-w-0 px-3 sm:px-4 py-2.5 transition-all hover:scale-[1.02] cursor-pointer snap-start ${getStatusColor(
                day.status
              )} ${day.day === 'TODAY' ? 'ring-2 ring-emerald-500/50' : ''}`}
            >
              {/* Mobile: stacked vertically, Desktop: side by side */}
              <div className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-between mb-1.5">
                <span className={`text-xs font-medium ${day.day === 'TODAY' ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  {day.day}
                </span>
                <span className="text-lg sm:text-sm font-semibold text-zinc-300">{day.date}</span>
              </div>

              <p className={`text-base font-bold tabular-nums text-center sm:text-left ${day.status === 'safe' ? 'text-zinc-100' : 'text-amber-400'}`}>
                ${day.balance.toFixed(0)}
              </p>

              {day.change && (
                <div className="mt-1.5 pt-1.5 border-t border-zinc-800/50">
                  <p className="text-xs text-rose-400 tabular-nums font-medium text-center sm:text-left">-${Math.abs(day.change).toFixed(0)}</p>
                  {/* Hide transaction name on mobile, show on sm+ */}
                  <p className="hidden sm:block text-xs text-zinc-400 truncate mt-0.5">{day.expense}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

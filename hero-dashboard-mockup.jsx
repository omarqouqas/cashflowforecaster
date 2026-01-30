import React, { useState, useEffect } from 'react';

// Refined Hero Dashboard for Cash Flow Forecaster Landing Page
// Design Direction: Premium fintech with bold focal points and breathing room

export default function HeroDashboardMockup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [chartHovered, setChartHovered] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Sample data matching the screenshots
  const stats = {
    safeToSpend: 203.50,
    buffer: 200,
    starting: 1000,
    lowest: 403.50,
    lowestDate: 'Thu, Jan 29',
    income: 183400,
    bills: 147092,
    endBalance: 37308,
    netChange: 36346.20,
  };

  const weekDays = [
    { day: 'TODAY', date: 19, balance: 811, change: -189, expense: 'Marriott', items: 1, status: 'safe' },
    { day: 'Tue', date: 20, balance: 811, change: null, expense: null, items: 0, status: 'safe' },
    { day: 'Wed', date: 21, balance: 811, change: null, expense: null, items: 0, status: 'safe' },
    { day: 'Thu', date: 22, balance: 811, change: null, expense: null, items: 0, status: 'safe' },
    { day: 'Fri', date: 23, balance: 603.50, change: -207.50, expense: 'Racket...', items: 1, status: 'caution' },
    { day: 'Sat', date: 24, balance: 603.50, change: null, expense: null, items: 0, status: 'caution' },
    { day: 'Sun', date: 25, balance: 603.50, change: null, expense: null, items: 0, status: 'caution' },
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

  const formatCurrency = (amount, compact = false) => {
    if (compact && amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'safe': return 'bg-emerald-500/10 border-emerald-500/20';
      case 'caution': return 'bg-amber-500/10 border-amber-500/20';
      case 'low': return 'bg-orange-500/10 border-orange-500/20';
      case 'danger': return 'bg-rose-500/10 border-rose-500/20';
      default: return 'bg-zinc-800/50 border-zinc-700/50';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8 font-sans">
      {/* Container with max-width for landing page context */}
      <div 
        className={`max-w-5xl mx-auto transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight">
              Cash Flow Calendar
            </h1>
            <p className="text-sm text-zinc-500 mt-0.5">365-day projection</p>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 text-sm hover:bg-zinc-800 hover:border-zinc-600 transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            Filters
          </button>
        </div>

        {/* HERO CARD - Safe to Spend (THE FOCAL POINT) */}
        <div 
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 via-zinc-900 to-zinc-900 border border-emerald-500/20 p-8 mb-6 transition-all duration-500 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Subtle glow effect */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-emerald-400/80 uppercase tracking-wider">
                Safe to Spend
              </span>
              <div className="group relative">
                <svg className="w-4 h-4 text-zinc-500 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
              <span className="text-zinc-400 hover:text-emerald-400 cursor-pointer transition-colors">
                ${stats.buffer.toFixed(2)} buffer ✎
              </span>
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div 
          className={`grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 transition-all duration-500 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {[
            { label: 'Starting', value: formatCurrency(stats.starting), sub: 'Today' },
            { label: 'Lowest', value: formatCurrency(stats.lowest), sub: stats.lowestDate, warn: true },
            { label: 'Income', value: formatCurrency(stats.income, true), sub: 'Next 60 days' },
            { label: 'Bills', value: formatCurrency(stats.bills, true), sub: `End: ${formatCurrency(stats.endBalance, true)}`, isExpense: true },
          ].map((stat, i) => (
            <div 
              key={stat.label}
              className="group bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 hover:bg-zinc-900 transition-all cursor-default"
            >
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
                {stat.label}
              </p>
              <p className={`text-xl font-semibold tabular-nums ${
                stat.isExpense ? 'text-rose-400' : stat.warn ? 'text-amber-400' : 'text-zinc-100'
              }`}>
                {stat.value}
              </p>
              <p className="text-xs text-zinc-600 mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Balance Forecast Chart */}
        <div 
          className={`bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-6 transition-all duration-500 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-zinc-100">Balance Forecast</h2>
              <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <div className="text-right">
                <p className="text-xl font-bold text-emerald-400 tabular-nums">
                  +{formatCurrency(stats.netChange)}
                </p>
                <p className="text-xs text-emerald-400/60">Net change</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-zinc-500 mb-4">
            365-day projection • Hover & click chart to view day
          </p>

          {/* SVG Chart */}
          <div className="relative h-64 w-full">
            <svg 
              viewBox="0 0 100 100" 
              preserveAspectRatio="none" 
              className="w-full h-full"
              onMouseLeave={() => setChartHovered(null)}
            >
              {/* Grid lines */}
              <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgb(16 185 129)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="rgb(16 185 129)" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgb(16 185 129)" />
                  <stop offset="100%" stopColor="rgb(45 212 191)" />
                </linearGradient>
              </defs>

              {/* Horizontal grid lines */}
              {[20, 40, 60, 80].map(y => (
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
              <line 
                x1="0" 
                y1="95" 
                x2="100" 
                y2="95" 
                stroke="rgb(234 179 8)" 
                strokeWidth="0.3"
                strokeDasharray="3 2"
              />

              {/* Area fill */}
              <path
                d={`M0,100 ${chartPoints.map(p => `L${p.x},${p.y}`).join(' ')} L100,100 Z`}
                fill="url(#areaGradient)"
              />

              {/* Main line */}
              <path
                d={`M${chartPoints.map(p => `${p.x},${p.y}`).join(' L')}`}
                fill="none"
                stroke="url(#lineGradient)"
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
                    r={chartHovered === i ? "1.5" : "0.8"}
                    fill={chartHovered === i ? "rgb(16 185 129)" : "rgb(16 185 129)"}
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

            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-zinc-500 -translate-x-full pr-3">
              <span>$60K</span>
              <span>$45K</span>
              <span>$30K</span>
              <span>$15K</span>
              <span>$0</span>
            </div>

            {/* Tooltip */}
            {chartHovered !== null && (
              <div 
                className="absolute bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm pointer-events-none shadow-xl z-10"
                style={{
                  left: `${chartPoints[chartHovered].x}%`,
                  top: `${chartPoints[chartHovered].y - 15}%`,
                  transform: 'translate(-50%, -100%)'
                }}
              >
                <p className="text-zinc-400 text-xs">{chartPoints[chartHovered].label}</p>
                <p className="text-emerald-400 font-semibold">{formatCurrency(chartPoints[chartHovered].value)}</p>
              </div>
            )}
          </div>

          {/* X-axis labels */}
          <div className="flex justify-between text-xs text-zinc-500 mt-2 px-1">
            <span>Jan 21</span>
            <span>Apr 8</span>
            <span>Jun 24</span>
            <span>Sep 7</span>
            <span>Dec 17</span>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-8 mt-6 text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
              <span>Balance trend</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 border-t-2 border-dashed border-amber-500/60" />
              <span>Safety buffer</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 border-t-2 border-dotted border-rose-500/60" />
              <span>Zero line</span>
            </div>
          </div>
        </div>

        {/* Quick Summary Row */}
        <div 
          className={`grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 transition-all duration-500 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-xs font-medium uppercase tracking-wider">Next Income</span>
            </div>
            <p className="text-2xl font-bold text-zinc-100 tabular-nums">$9,900.00</p>
            <p className="text-sm text-zinc-500 mt-1">In 11 days • Jan 30</p>
          </div>

          <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-5">
            <div className="flex items-center gap-2 text-orange-400 mb-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-medium uppercase tracking-wider">Bills This Week</span>
            </div>
            <p className="text-2xl font-bold text-zinc-100 tabular-nums">2 bills</p>
            <p className="text-sm text-zinc-500 mt-1">$396.50 total</p>
          </div>
        </div>

        {/* Balance Status Legend */}
        <div 
          className={`flex flex-wrap gap-3 mb-6 transition-all duration-500 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-sm font-medium text-zinc-400 mr-2">Balance Status</p>
          {[
            { label: 'Safe', color: 'emerald', threshold: '$400.00+' },
            { label: 'Caution', color: 'amber', threshold: '$300.00+' },
            { label: 'Low', color: 'orange', threshold: '$200.00+' },
            { label: 'Danger', color: 'rose', threshold: 'Below $200.00' },
          ].map((status) => (
            <div 
              key={status.label}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-${status.color}-500/10 border border-${status.color}-500/20`}
            >
              <div className={`w-2 h-2 rounded-full bg-${status.color}-500`} />
              <span className={`text-xs font-medium text-${status.color}-400`}>{status.label}</span>
              <span className="text-xs text-zinc-500">{status.threshold}</span>
            </div>
          ))}
        </div>

        {/* Weekly Calendar Strip */}
        <div 
          className={`transition-all duration-500 delay-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h3 className="text-lg font-semibold text-zinc-100 mb-4">January 2026</h3>
          
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, i) => (
              <div
                key={i}
                className={`relative rounded-xl border p-3 transition-all hover:scale-[1.02] cursor-pointer ${
                  getStatusColor(day.status)
                } ${day.day === 'TODAY' ? 'ring-2 ring-emerald-500/50' : ''}`}
                onMouseEnter={() => setHoveredDay(i)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-medium ${
                    day.day === 'TODAY' ? 'text-emerald-400' : 'text-zinc-500'
                  }`}>
                    {day.day}
                  </span>
                  <span className="text-sm font-semibold text-zinc-300">{day.date}</span>
                </div>
                
                <p className={`text-lg font-bold tabular-nums ${
                  day.status === 'safe' ? 'text-zinc-100' : 'text-amber-400'
                }`}>
                  ${day.balance.toFixed(2)}
                </p>

                {day.change && (
                  <div className="mt-2 pt-2 border-t border-zinc-800/50">
                    <p className="text-xs text-rose-400 tabular-nums">▼ ${Math.abs(day.change).toFixed(2)}</p>
                    <p className="text-xs text-zinc-500 truncate mt-0.5">{day.expense}</p>
                  </div>
                )}

                {day.items > 0 && (
                  <div className="absolute bottom-2 right-2">
                    <span className="text-xs px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-400">
                      {day.items} item{day.items > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

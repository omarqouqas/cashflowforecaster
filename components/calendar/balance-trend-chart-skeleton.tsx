/**
 * Loading skeleton for BalanceTrendChart
 * Displays an animated placeholder while chart data loads
 */
export function BalanceTrendChartSkeleton() {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-6 mb-6 backdrop-blur-sm animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="h-6 bg-zinc-800 rounded w-48 mb-2"></div>
          <div className="h-4 bg-zinc-800/60 rounded w-64"></div>
        </div>
        <div className="bg-zinc-800/40 rounded-lg px-4 py-2 border border-zinc-700/50 w-32 h-16"></div>
      </div>

      {/* Chart skeleton */}
      <div className="w-full h-80 bg-zinc-800/30 rounded-lg mb-6 relative overflow-hidden">
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-zinc-700/20 to-transparent"></div>
      </div>

      {/* Legend skeleton */}
      <div className="grid grid-cols-3 gap-3 text-xs">
        <div className="h-10 bg-zinc-800/30 rounded-lg"></div>
        <div className="h-10 bg-zinc-800/30 rounded-lg"></div>
        <div className="h-10 bg-zinc-800/30 rounded-lg"></div>
      </div>
    </div>
  );
}

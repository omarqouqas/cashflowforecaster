export function CalendarSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-900">
      {/* Sticky header skeleton */}
      <div className="sticky top-0 z-20 bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-800 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-4">
            <div className="h-12 bg-zinc-800 rounded overflow-hidden relative">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
            </div>
            <div className="h-12 bg-zinc-800 rounded overflow-hidden relative">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite_0.2s] bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
            </div>
            <div className="h-12 bg-zinc-800 rounded overflow-hidden relative">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite_0.4s] bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart skeleton */}
      <div className="px-4 pt-4">
        <div className="bg-zinc-800 border border-zinc-800 rounded-lg p-6 h-64 overflow-hidden relative">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite_0.6s] bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
        </div>
      </div>

      {/* Timeline skeleton */}
      <div className="flex-1">
        <div className="space-y-2 p-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center px-4 py-3 rounded-lg border border-zinc-800 bg-zinc-800 overflow-hidden relative">
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent"
                style={{
                  animation: `shimmer 2s infinite ${0.8 + i * 0.1}s`
                }}
              />
              <div className="w-1 h-10 rounded-full bg-zinc-700 mr-3" />
              <div className="w-16">
                <div className="h-3 w-8 bg-zinc-700 rounded mb-1" />
                <div className="h-4 w-12 bg-zinc-700 rounded" />
              </div>
              <div className="flex-1 px-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-zinc-700" />
                  <div className="w-2 h-2 rounded-full bg-zinc-700" />
                </div>
              </div>
              <div className="h-5 w-20 bg-zinc-700 rounded" />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  )
}

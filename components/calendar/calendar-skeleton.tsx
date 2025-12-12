export function CalendarSkeleton() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky header skeleton */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-zinc-200 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-4">
            <div className="h-12 bg-zinc-200 rounded animate-pulse" />
            <div className="h-12 bg-zinc-200 rounded animate-pulse" />
            <div className="h-12 bg-zinc-200 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Timeline skeleton */}
      <div className="flex-1">
        <div className="divide-y divide-zinc-100">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center px-4 py-3">
              <div className="w-1 h-10 rounded-full bg-zinc-200 animate-pulse mr-3" />
              <div className="w-16">
                <div className="h-3 w-8 bg-zinc-200 rounded animate-pulse mb-1" />
                <div className="h-4 w-12 bg-zinc-200 rounded animate-pulse" />
              </div>
              <div className="flex-1 px-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-zinc-200 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-zinc-200 animate-pulse" />
                </div>
              </div>
              <div className="h-5 w-20 bg-zinc-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

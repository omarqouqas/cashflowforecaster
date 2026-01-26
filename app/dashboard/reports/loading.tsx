export default function ReportsLoading() {
  return (
    <>
      {/* Breadcrumb skeleton */}
      <div className="mb-6">
        <div className="h-5 w-36 bg-zinc-800 rounded animate-pulse" />
      </div>

      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <div className="h-8 w-48 bg-zinc-800 rounded animate-pulse mb-2" />
          <div className="h-4 w-64 bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-zinc-800 rounded-lg animate-pulse" />
      </div>

      {/* Quick Reports skeleton */}
      <section className="mb-8">
        <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex flex-col items-center p-6 rounded-xl border border-zinc-800 bg-zinc-900"
            >
              <div className="w-12 h-12 rounded-xl bg-zinc-800 animate-pulse mb-3" />
              <div className="h-5 w-24 bg-zinc-800 rounded animate-pulse mb-2" />
              <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </section>

      {/* Export History skeleton */}
      <section>
        <div className="h-6 w-36 bg-zinc-800 rounded animate-pulse mb-4" />
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-zinc-800 rounded animate-pulse mb-3" />
            <div className="h-4 w-24 bg-zinc-800 rounded animate-pulse" />
          </div>
        </div>
      </section>
    </>
  );
}

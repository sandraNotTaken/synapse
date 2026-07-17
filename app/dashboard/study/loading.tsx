export default function StudyLoading() {
  return (
    <main className="space-y-8 px-4 py-8 sm:px-6 lg:px-8 animate-pulse">
      {/* Title skeleton */}
      <div className="space-y-3">
        <div className="h-10 w-44 rounded-2xl bg-white/5" />
        <div className="h-4 w-64 rounded-xl bg-white/5" />
      </div>

      {/* Stats Cards Row */}
      <div className="grid gap-6 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-3xl border border-white/5 bg-white/5 p-6 h-[110px] flex items-center justify-between"
          >
            <div className="space-y-2">
              <div className="h-4 w-20 rounded-xl bg-white/5" />
              <div className="h-7 w-12 rounded-xl bg-white/5" />
            </div>
            <div className="h-12 w-12 rounded-2xl bg-white/5" />
          </div>
        ))}
      </div>

      {/* Main Review Section */}
      <div className="space-y-4">
        <div className="h-6 w-36 rounded-xl bg-white/5" />
        <div className="rounded-3xl border border-white/5 bg-white/5 p-8 h-[200px] flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-6 w-1/4 rounded-xl bg-white/5" />
            <div className="h-4 w-1/2 rounded-xl bg-white/5" />
          </div>
          <div className="h-10 w-32 rounded-xl bg-white/5" />
        </div>
      </div>
    </main>
  );
}

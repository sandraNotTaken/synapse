export default function DashboardLoading() {
  return (
    <main className="w-full space-y-8 animate-pulse">
      {/* Title / Header skeleton */}
      <div className="space-y-3">
        <div className="h-10 w-64 rounded-2xl bg-white/5" />
        <div className="h-4 w-96 rounded-xl bg-white/5" />
      </div>

      {/* Main Grid skeleton */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left main content block skeleton (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-white/5 bg-white/5 p-8 h-[500px] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-6 w-1/4 rounded-xl bg-white/5" />
              <div className="h-4 w-full rounded-xl bg-white/5" />
              <div className="h-4 w-5/6 rounded-xl bg-white/5" />
              <div className="h-4 w-4/6 rounded-xl bg-white/5" />
            </div>
            <div className="flex justify-between items-center">
              <div className="h-6 w-20 rounded-full bg-white/5" />
              <div className="h-10 w-32 rounded-xl bg-white/5" />
            </div>
          </div>
        </div>

        {/* Right sidebar block skeleton (1/3 width) */}
        <div className="lg:col-span-1 space-y-6">
          {/* AI study tools card skeleton */}
          <div className="rounded-3xl border border-white/5 bg-white/5 p-6 h-[300px] space-y-4">
            <div className="h-6 w-1/2 rounded-xl bg-white/5" />
            <div className="space-y-3">
              <div className="h-14 w-full rounded-2xl bg-white/5" />
              <div className="h-14 w-full rounded-2xl bg-white/5" />
              <div className="h-14 w-full rounded-2xl bg-white/5" />
            </div>
          </div>

          {/* Additional cards skeletons */}
          <div className="rounded-2xl border border-white/5 bg-white/5 p-6 h-[150px] space-y-3">
            <div className="h-5 w-1/3 rounded-xl bg-white/5" />
            <div className="h-4 w-full rounded-xl bg-white/5" />
            <div className="h-4 w-2/3 rounded-xl bg-white/5" />
          </div>
        </div>
      </div>
    </main>
  );
}

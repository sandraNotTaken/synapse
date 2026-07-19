import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <main className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-10 w-64 rounded-2xl" />
        <Skeleton className="h-4 w-80 rounded-xl" />
      </div>

      {/* Stats Cards Row (4 cards) */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-3xl border border-border bg-card/60 p-5 flex items-center justify-between h-[110px]"
          >
            <div className="space-y-2">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-7 w-12 rounded" />
            </div>
            <Skeleton className="h-12 w-12 rounded-2xl" />
          </div>
        ))}
      </div>

      {/* Recent Courses Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32 rounded" />
          <Skeleton className="h-9 w-28 rounded-xl" />
        </div>

        {/* Courses cards grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-3xl border border-border bg-card/60 p-6 h-[250px] flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-24 rounded-full" />
                  <Skeleton className="h-4 w-12 rounded" />
                </div>
                <Skeleton className="h-6 w-3/4 rounded" />
                <Skeleton className="h-4 w-5/6 rounded" />
              </div>
              <div className="flex justify-between items-center border-t border-border/40 pt-4">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

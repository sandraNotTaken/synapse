import { Skeleton } from "@/components/ui/skeleton";

export default function StudyLoading() {
  return (
    <main className="space-y-8 animate-pulse">
      {/* Title skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-10 w-44 rounded-2xl" />
        <Skeleton className="h-4 w-64 rounded-xl" />
      </div>

      {/* Confidence Map Skeleton */}
      <div className="rounded-3xl border border-border bg-card/60 p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-border/40 pb-3">
          <Skeleton className="h-6 w-52 rounded" />
          <Skeleton className="h-9 w-36 rounded-xl" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-[76px] rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid gap-6 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-3xl border border-border bg-card/60 p-6 h-[110px] flex items-center justify-between"
          >
            <div className="space-y-2">
              <Skeleton className="h-4 w-20 rounded" />
              <Skeleton className="h-7 w-12 rounded" />
            </div>
            <Skeleton className="h-12 w-12 rounded-2xl" />
          </div>
        ))}
      </div>

      {/* Main Review Section */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-36 rounded" />
        <div className="rounded-3xl border border-border bg-card/60 p-8 h-[200px] flex flex-col justify-between">
          <div className="space-y-3">
            <Skeleton className="h-6 w-1/4 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
          </div>
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>
    </main>
  );
}

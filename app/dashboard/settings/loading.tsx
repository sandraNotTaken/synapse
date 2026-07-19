import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 animate-pulse">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-3">
          <Skeleton className="h-10 w-40 rounded-2xl" />
          <Skeleton className="h-4 w-96 rounded-xl" />
        </div>
        <Skeleton className="h-11 w-32 rounded-xl" />
      </div>

      <div className="grid gap-8 md:grid-cols-4">
        {/* Sidebar Navigation Skeletons */}
        <div className="md:col-span-1 flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-full rounded-xl" />
          ))}
        </div>

        {/* Form Panel Skeleton */}
        <div className="md:col-span-3">
          <div className="rounded-3xl border border-border bg-card/60 p-6 space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-7 w-48 rounded" />
              <Skeleton className="h-4 w-72 rounded" />
            </div>

            <div className="flex items-center gap-4 border-b border-border pb-6">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32 rounded" />
                <Skeleton className="h-3 w-48 rounded" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
              <div className="flex justify-between items-center pt-2">
                <div />
                <Skeleton className="h-10 w-44 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

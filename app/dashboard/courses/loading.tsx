import { Skeleton } from "@/components/ui/skeleton";

export default function CoursesLoading() {
  return (
    <main className="space-y-8 animate-pulse">
      {/* Title skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <Skeleton className="h-10 w-48 rounded-2xl" />
          <Skeleton className="h-4 w-72 rounded-xl" />
        </div>
        <Skeleton className="h-11 w-36 rounded-xl" />
      </div>

      {/* Course Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-3xl border border-border bg-card/60 p-6 h-[250px] flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-20 rounded-full" />
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
    </main>
  );
}

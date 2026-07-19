import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export default function CourseDetailsLoading() {
  return (
    <main className="space-y-8 animate-pulse">
      {/* Back button */}
      <div>
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground opacity-50">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </div>
      </div>

      {/* Course Banner Card */}
      <div className="rounded-3xl border border-border bg-card/60 p-6 sm:p-8 backdrop-blur-xl space-y-4">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-10 w-2/3 rounded-2xl" />
        <Skeleton className="h-4 w-5/6 rounded-xl" />
      </div>

      {/* Topics grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-36 rounded" />
          <Skeleton className="h-9 w-28 rounded-xl" />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-3xl border border-border bg-card/60 p-6 flex flex-col justify-between h-[180px]"
            >
              <div className="space-y-3">
                <Skeleton className="h-6 w-2/3 rounded" />
                <Skeleton className="h-4 w-5/6 rounded" />
              </div>
              <div className="flex justify-between items-center border-t border-border/40 pt-4">
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export default function TopicLoading() {
  return (
    <main className="space-y-6 animate-pulse">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground opacity-50">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Course</span>
          </div>
          <Skeleton className="h-9 w-64 rounded-xl" />
        </div>
        <Skeleton className="h-10 w-28 rounded-xl" />
      </div>

      {/* Editor & Panel Split Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Editor (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl border border-border bg-card/60 p-6 space-y-4 h-[500px]">
            <div className="flex justify-between items-center border-b border-border/40 pb-3">
              <Skeleton className="h-6 w-32 rounded" />
              <Skeleton className="h-4 w-40 rounded" />
            </div>
            {/* Editor body content */}
            <Skeleton className="h-[360px] w-full rounded-2xl" />
          </div>
        </div>

        {/* AI Sidebar Panel (1 col) */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-card/60 p-6 space-y-4 h-[500px] flex flex-col justify-between">
            <div className="space-y-4 flex-1">
              <div className="flex justify-between items-center border-b border-border/40 pb-3">
                <Skeleton className="h-6 w-36 rounded" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
              {/* Messages list */}
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Skeleton className="h-6 w-6 rounded-full shrink-0" />
                  <Skeleton className="h-12 w-4/5 rounded-2xl" />
                </div>
                <div className="flex items-start gap-2 justify-end">
                  <Skeleton className="h-16 w-3/4 rounded-2xl" />
                  <Skeleton className="h-6 w-6 rounded-full shrink-0" />
                </div>
              </div>
            </div>
            {/* Input area */}
            <div className="flex gap-2 border-t border-border/40 pt-4">
              <Skeleton className="h-10 flex-1 rounded-xl" />
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

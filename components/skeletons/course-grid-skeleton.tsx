import { Skeleton } from "@/components/ui/skeleton";

export function CourseGridSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton
          key={index}
          className="h-24 w-full rounded-xl"
        />
      ))}
    </div>
  );
}
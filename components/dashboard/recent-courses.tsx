import { BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface RecentCoursesProps {
  courses: {
    id: string;
    title: string;
    color: string;
  }[];
}

export default function RecentCourses({ courses }: RecentCoursesProps) {
  return (
    <Card className="border-white/10 bg-white/5 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.7)]">
      <CardContent className="p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Recent courses</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
              A calm, elegant overview of your latest learning tracks and progress.
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/60 text-slate-300">
            <BookOpen className="h-5 w-5" />
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-6 text-sm text-slate-400">
            No courses yet.
          </div>
        ) : (
          <div className="grid gap-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="group flex items-center gap-4 rounded-3xl border border-white/10 bg-slate-950/40 p-4 transition hover:border-indigo-400/40 hover:bg-slate-900/70"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-slate-200">
                  <BookOpen className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-white">{course.title}</p>
                  <div className="mt-1 flex items-center gap-2 text-sm text-slate-400">
                    <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: course.color }} />
                    <span>Course</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

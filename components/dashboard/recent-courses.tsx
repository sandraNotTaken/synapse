import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { NewCourseDialog }  from "./new-course-dialog";

interface RecentCoursesProps {
  courses: {
    id: string;
    title: string;
    description: string | null;
    color: string;
    progress: number;
    topics: number;
    updatedAt: Date;
  }[];
}

export default function RecentCourses({
  courses,
}: RecentCoursesProps) {
  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
      <CardContent className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
              <h2 className="text-xl font-semibold text-white">
                  Continue Learning
              </h2>

              <p className="text-sm text-slate-400">
                  Pick up where you left off.
              </p>
          </div>

          <div className="flex items-center gap-3">
              <NewCourseDialog />
              <BookOpen className="h-5 w-5 text-slate-400" />
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 py-10 text-center text-slate-400">
            No courses yet.
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/dashboard/courses/${course.id}`}
                className="block rounded-2xl border border-white/10 bg-slate-900/60 p-5 transition-all hover:border-indigo-500/40 hover:bg-slate-900"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor: course.color,
                        }}
                      />

                      <h3 className="font-semibold text-white">
                        {course.title}
                      </h3>
                    </div>

                    <p className="text-sm text-slate-400">
                      {course.description ?? "No description yet"}
                    </p>

                    <div className="text-sm text-slate-400">
                      {course.topics} Topics
                    </div>

                    <Progress
                      value={course.progress}
                      className="h-2"
                    />

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        {course.progress}% completed
                      </span>

                      <span className="text-xs text-slate-500">
                        Updated{" "}
                        {new Date(course.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, FolderOpen, ArrowRight } from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NewCourseDialog } from "@/components/dashboard/new-course-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default async function CoursesPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const courses = await prisma.course.findMany({
    where: {
      user: {
        email: session.user.email,
      },
    },
    include: {
      topics: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Your Courses
          </h1>
          <p className="mt-2 text-slate-400">
            Manage your subjects, notes, and study tracks.
          </p>
        </div>
        <NewCourseDialog />
      </div>

      {courses.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-16 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-slate-500" />
          <h3 className="mt-4 text-lg font-semibold text-white">
            No courses created yet
          </h3>
          <p className="mt-2 text-slate-400">
            Create your first course to start organizing your study notes.
          </p>
          <div className="mt-6">
            <NewCourseDialog />
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {courses.map((course) => {
            const progress = course.topics.length === 0
              ? 0
              : Math.min(course.topics.length * 20, 100);

            return (
              <Link
                key={course.id}
                href={`/dashboard/courses/${course.id}`}
                className="group relative block overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 p-6 transition-all hover:border-indigo-500/40 hover:bg-slate-900/80 hover:shadow-[0_20px_50px_-20px_rgba(99,102,241,0.2)]"
              >
                <div
                  className="absolute left-0 top-0 h-full w-1.5 transition-all group-hover:w-2"
                  style={{ backgroundColor: course.color }}
                />

                <div className="space-y-4 pl-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white transition group-hover:text-indigo-400">
                        {course.title}
                      </h3>
                      {course.description && (
                        <p className="mt-1 text-sm text-slate-400 line-clamp-2">
                          {course.description}
                        </p>
                      )}
                    </div>
                    <ArrowRight className="h-5 w-5 text-slate-500 transition group-hover:translate-x-1 group-hover:text-white" />
                  </div>

                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <FolderOpen className="h-4 w-4 text-indigo-400" />
                      {course.topics.length} {course.topics.length === 1 ? 'Topic' : 'Topics'}
                    </span>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Course Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}

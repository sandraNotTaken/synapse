import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, FolderOpen, ArrowRight } from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NewCourseDialog } from "@/components/dashboard/new-course-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import DeleteButton from "@/components/dashboard/delete-button";

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Your Courses
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your subjects, notes, and study tracks.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <NewCourseDialog />
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card/40 p-16 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold text-foreground">
            No courses created yet
          </h3>
          <p className="mt-2 text-muted-foreground">
            Create your first course to start adding topics and study notes.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
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
                className="group relative block overflow-hidden rounded-3xl border border-border bg-card/40 p-6 transition-all hover:border-indigo-500/40 hover:bg-card/85 hover:shadow-[0_20px_50px_-20px_rgba(99,102,241,0.15)]"
              >
                <div
                  className="absolute left-0 top-0 h-full w-1.5 transition-all group-hover:w-2"
                  style={{ backgroundColor: course.color }}
                />

                <div className="space-y-4 pl-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-foreground transition group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {course.title}
                      </h3>
                      {course.description && (
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                          {course.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <DeleteButton type="course" id={course.id} />
                      <ArrowRight className="h-5 w-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-foreground shrink-0" />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <FolderOpen className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                      {course.topics.length} {course.topics.length === 1 ? 'Topic' : 'Topics'}
                    </span>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
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

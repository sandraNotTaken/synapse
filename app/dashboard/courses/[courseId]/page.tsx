import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react"
import { NewTopicDialog } from "@/components/dashboard/new-topic-dialog";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CoursePage({ params }: PageProps) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const { courseId } = await params;

  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      user: {
        email: session.user.email,
      },
    },
    include: {
      topics: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!course) {
    redirect("/dashboard");
  }

  return (
    <main className="space-y-8">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-white">
            {course.title}
          </h1>

          {course.description && (
            <p className="mt-2 text-slate-400">
              {course.description}
            </p>
          )}
        </div>

        <NewTopicDialog courseId={course.id} />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-4 text-xl font-semibold text-white">
          Topics
        </h2>

        {course.topics.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-indigo-500/40 p-10 text-center">
            <h3 className="text-lg font-semibold text-white">
              Your course is ready
            </h3>

            <p className="mt-2 text-slate-400">
              Add your first topic to start studying.
            </p>

            <div className="mt-6 flex justify-center">
              <NewTopicDialog courseId={course.id} />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {course.topics.map((topic) => (
              <Link
                key={topic.id}
                href={`/dashboard/topics/${topic.id}`}
                className="group flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 p-5 transition hover:border-indigo-500/40 hover:bg-slate-900"
              >
                <div>
                  <h3 className="font-semibold text-white">
                    {topic.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    Start studying this topic
                  </p>
                </div>

                <ArrowRight className="h-5 w-5 text-slate-500 transition group-hover:translate-x-1 group-hover:text-white" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
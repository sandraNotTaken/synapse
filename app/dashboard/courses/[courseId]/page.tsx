import { redirect } from "next/navigation";

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
      <div>
        <h1 className="text-3xl font-bold text-white">
          {course.title}
        </h1>

        {course.description && (
          <p className="mt-2 text-slate-400">
            {course.description}
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-4 text-xl font-semibold text-white">
          Topics
        </h2>

        {course.topics.length === 0 ? (
          <p className="text-slate-400">
            No topics yet.
          </p>
        ) : (
          <div className="space-y-3">
            {course.topics.map((topic) => (
              <div
                key={topic.id}
                className="rounded-xl border border-white/10 bg-slate-900/60 p-4"
              >
                {topic.title}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
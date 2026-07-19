import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react"
import { NewTopicDialog } from "@/components/dashboard/new-topic-dialog";
import DeleteButton from "@/components/dashboard/delete-button";

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
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">
              {course.title}
            </h1>
            <DeleteButton type="course" id={course.id} />
          </div>

          {course.description && (
            <p className="text-muted-foreground">
              {course.description}
            </p>
          )}
        </div>

        <NewTopicDialog courseId={course.id} />
      </div>

      <div className="rounded-2xl border border-border bg-card/60 p-6">
        <h2 className="mb-4 text-xl font-semibold text-foreground">
          Topics
        </h2>

        {course.topics.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-indigo-500/40 p-10 text-center">
            <h3 className="text-lg font-semibold text-foreground">
              Your course is ready
            </h3>

            <p className="mt-2 text-muted-foreground">
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
                className="group flex items-center justify-between rounded-2xl border border-border bg-card/40 p-5 transition hover:border-indigo-500/40 hover:bg-card/75"
              >
                <div>
                  <h3 className="font-semibold text-foreground">
                    {topic.title}
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Start studying this topic
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <DeleteButton type="topic" id={topic.id} />
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-foreground shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
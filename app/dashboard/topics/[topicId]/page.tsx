import { redirect } from "next/navigation";
import Link from "next/link";
import TopicEditor from "@/components/editor/topic-editor";
import { ArrowLeft, FileText } from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{
    topicId: string;
  }>;
}

export default async function TopicPage({ params }: Props) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const { topicId } = await params;

  const topic = await prisma.topic.findFirst({
    where: {
      id: topicId,
      course: {
        user: {
          email: session.user.email,
        },
      },
    },
    include: {
      course: true,
    },
  });

  if (!topic) {
    redirect("/dashboard");
  }

  return (
    <main className="space-y-8">
      <Link
        href={`/dashboard/courses/${topic.courseId}`}
        className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {topic.course.title}
      </Link>

      <div>
        <h1 className="text-4xl font-bold text-white">
          {topic.title}
        </h1>

        <p className="mt-2 text-slate-400">
          Create notes, flashcards and quizzes for this topic.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <FileText className="mb-4 h-8 w-8 text-indigo-400" />

          <h2 className="text-lg font-semibold text-white">
            Notes
          </h2>

          <TopicEditor
            topicId={topic.id}
            initialContent={topic.content ?? ""}
          />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">
            Flashcards
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Coming soon.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">
            Quiz
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Coming soon.
          </p>
        </div>
      </div>
    </main>
  );
}
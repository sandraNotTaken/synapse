import { redirect } from "next/navigation";
import Link from "next/link";
import AIToolbar from "@/components/dashboard/ai-toolbar";
import TopicEditor from "@/components/dashboard/topic-editor";
import { ArrowLeft } from "lucide-react";

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
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href={`/dashboard/courses/${topic.courseId}`}
        className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {topic.course.title}
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Notes Editor (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {topic.title}
            </h1>

            <p className="mt-2 text-slate-400">
              Write notes, organize your ideas, and use AI to study faster.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0d1117]/80 p-8 shadow-2xl backdrop-blur-sm">
            <TopicEditor
              topicId={topic.id}
              initialContent={topic.content ?? ""}
            />
          </div>
        </div>

        {/* Right Column - Sidebar (1/3 width) */}
        <div className="lg:col-span-1 space-y-6">
          <AIToolbar />

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <h2 className="text-lg font-semibold text-white">
              Flashcards
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Create flashcards to test your retention. Generate cards instantly using AI.
            </p>
            <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4 text-xs text-slate-500">
              <span>0 Cards</span>
              <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 font-medium text-indigo-400">
                Coming Soon
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <h2 className="text-lg font-semibold text-white">
              Quiz
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Generate self-testing quizzes from your notes. Track your scores here.
            </p>
            <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4 text-xs text-slate-500">
              <span>Status: Not Generated</span>
              <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 font-medium text-indigo-400">
                Coming Soon
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
import { redirect } from "next/navigation";
import Link from "next/link";
import { Layers3, BookOpen, Brain, ChevronRight } from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function DecksPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Fetch all user decks with their cards, topics, and courses
  const decks = await prisma.deck.findMany({
    where: {
      topic: {
        course: {
          user: {
            email: session.user.email,
          },
        },
      },
    },
    include: {
      topic: {
        include: {
          course: true,
        },
      },
      cards: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Flashcard Decks
        </h1>
        <p className="mt-2 text-slate-400">
          Manage, browse, and edit your custom flashcards and practice decks.
        </p>
      </div>

      {decks.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-16 text-center">
          <Layers3 className="mx-auto h-12 w-12 text-slate-500" />
          <h3 className="mt-4 text-lg font-semibold text-white">
            No decks available
          </h3>
          <p className="mt-2 text-slate-400">
            Decks are automatically generated when you use AI or create custom cards inside topics.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard"
              className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              Go to Notes
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {decks.map((deck) => (
            <div
              key={deck.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 p-6 transition-all hover:border-indigo-500/40 hover:bg-slate-900/80 hover:shadow-[0_20px_50px_-20px_rgba(99,102,241,0.25)]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    style={{
                      backgroundColor: `${deck.topic.course.color}20`,
                      color: deck.topic.course.color,
                    }}
                  >
                    {deck.topic.course.title}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Brain className="h-3 w-3 text-indigo-400" />
                    {deck.cards.length} cards
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-400">
                    {deck.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Topic: {deck.topic.title}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                <Link
                  href={`/dashboard/study/review/${deck.id}`}
                  className="text-sm font-semibold text-white hover:text-indigo-400 transition"
                >
                  Start Review
                </Link>
                <ChevronRight className="h-4 w-4 text-slate-500 transition group-hover:translate-x-1 group-hover:text-white" />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

import { redirect } from "next/navigation";
import Link from "next/link";
import { Brain, Flame, Calendar, Award, Play } from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function StudyPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Get user's decks
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
          Study Hub
        </h1>
        <p className="mt-2 text-slate-400">
          Supercharge your retention with spaced repetition and practice quizzes.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-2xl bg-orange-500/10 p-3 text-orange-400">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Daily Streak</p>
              <h3 className="text-2xl font-bold text-white">0 Days</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-2xl bg-indigo-500/10 p-3 text-indigo-400">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Reviews Today</p>
              <h3 className="text-2xl font-bold text-white">0 Cards</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-400">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Daily Goal</p>
              <h3 className="text-2xl font-bold text-white">45 min</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-2xl bg-green-500/10 p-3 text-green-400">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Mastered Decks</p>
              <h3 className="text-2xl font-bold text-white">0 Decks</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Decks to Study */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-white">Decks Ready for Review</h2>
        <p className="mt-1 text-sm text-slate-400">
          Spaced repetition automatically lists flashcards that are due for revision.
        </p>

        {decks.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-white/10 p-12 text-center text-slate-400">
            <Brain className="mx-auto h-12 w-12 text-slate-600" />
            <h3 className="mt-4 text-lg font-semibold text-white">All caught up!</h3>
            <p className="mt-2 text-sm text-slate-500">
              No decks are currently due for review. Create a deck in one of your topics to start.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {decks.map((deck) => (
              <div
                key={deck.id}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#090b11] p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: deck.topic.course.color }}
                    />
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                      {deck.topic.course.title} &middot; {deck.topic.title}
                    </span>
                  </div>
                  <h3 className="mt-1.5 text-lg font-bold text-white">
                    {deck.title}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {deck.cards.length} {deck.cards.length === 1 ? 'card' : 'cards'} available
                  </p>
                </div>

                <Link
                  href={`/dashboard/study/review/${deck.id}`}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 active:scale-[0.98]"
                >
                  <Play className="h-4 w-4 fill-white" />
                  Study Now
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

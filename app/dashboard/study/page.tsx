import { redirect } from "next/navigation";
import Link from "next/link";
import { Brain, Flame, Calendar, Award, Play } from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import DeleteButton from "@/components/dashboard/delete-button";
import ConfidenceMap from "@/components/dashboard/confidence-map";
import RetentionPredictor from "@/components/dashboard/retention-predictor";
import { getDashboardData } from "@/lib/dashboard";

export default async function StudyPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Get dashboard data metrics
  const dashboardData = await getDashboardData();
  if (!dashboardData) {
    redirect("/login");
  }

  const { streak, reviewsToday, studyMinutesToday, dailyGoal } = dashboardData;

  // Calculate total cards count for retention predictor
  const totalCards = await prisma.card.count({
    where: { deck: { topic: { course: { user: { email: session.user.email } } } } },
  });

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

  // Calculate mastered decks (where all cards have confidence === 4)
  const masteredDecksCount = decks.filter(
    (deck) =>
      deck.cards.length > 0 && deck.cards.every((card) => card.confidence === 4)
  ).length;

  // Get courses and calculate confidence map data
  const courses = await prisma.course.findMany({
    where: {
      user: {
        email: session.user.email,
      },
    },
    include: {
      topics: {
        include: {
          decks: {
            include: {
              cards: true,
            },
          },
        },
      },
    },
  });

  const confidenceData = courses.flatMap((course) =>
    course.topics.map((topic) => {
      let cardCount = 0;
      let confidenceSum = 0;
      const ratingsBreakdown = { again: 0, hard: 0, good: 0, easy: 0 };

      topic.decks.forEach((deck) => {
        deck.cards.forEach((card) => {
          cardCount++;
          confidenceSum += card.confidence;

          if (card.confidence === 1) ratingsBreakdown.again++;
          else if (card.confidence === 2) ratingsBreakdown.hard++;
          else if (card.confidence === 3) ratingsBreakdown.good++;
          else if (card.confidence === 4) ratingsBreakdown.easy++;
        });
      });

      const avgConfidence = cardCount > 0 ? Number((confidenceSum / cardCount).toFixed(2)) : 0;

      return {
        id: topic.id,
        title: topic.title,
        courseTitle: course.title,
        courseColor: course.color,
        cardCount,
        avgConfidence,
        ratingsBreakdown,
      };
    })
  );

  return (
    <main className="space-y-8 px-2 py-4 sm:px-4 sm:py-6 lg:px-6">
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
          Study Hub
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Supercharge your retention with spaced repetition and practice quizzes.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card/60 backdrop-blur-xl transition hover:scale-[1.02] duration-300">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-2xl bg-orange-500/10 p-3 text-orange-600 dark:text-orange-400">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Daily Streak</p>
              <h3 className="text-xl font-bold text-foreground mt-0.5">{streak} {streak === 1 ? 'Day' : 'Days'}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/60 backdrop-blur-xl transition hover:scale-[1.02] duration-300">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-2xl bg-indigo-500/10 p-3 text-indigo-600 dark:text-indigo-400">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reviews Today</p>
              <h3 className="text-xl font-bold text-foreground mt-0.5">{reviewsToday} {reviewsToday === 1 ? 'Card' : 'Cards'}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/60 backdrop-blur-xl transition hover:scale-[1.02] duration-300">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-600 dark:text-cyan-400">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Daily Goal</p>
              <h3 className="text-xl font-bold text-foreground mt-0.5">{studyMinutesToday} / {dailyGoal} min</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/60 backdrop-blur-xl transition hover:scale-[1.02] duration-300">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-2xl bg-green-500/10 p-3 text-green-600 dark:text-green-400">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mastered Decks</p>
              <h3 className="text-xl font-bold text-foreground mt-0.5">{masteredDecksCount} {masteredDecksCount === 1 ? 'Deck' : 'Decks'}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Memory Retention Predictor */}
      <RetentionPredictor totalCards={totalCards} dueCardsCount={reviewsToday} />

      {/* Confidence Map */}
      <ConfidenceMap topics={confidenceData} />

      {/* Decks to Study */}
      <div className="rounded-3xl border border-border bg-card/40 p-5 sm:p-8">
        <h2 className="text-xl font-bold text-foreground sm:text-2xl">Decks Ready for Review</h2>
        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
          Spaced repetition automatically lists flashcards that are due for revision.
        </p>

        {decks.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            <Brain className="mx-auto h-12 w-12 text-muted-foreground/60" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">All caught up!</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              No decks are currently due for review. Create a deck in one of your topics to start.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {decks.map((deck) => (
              <div
                key={deck.id}
                className="flex flex-col gap-4 rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] hover:border-indigo-500/20 md:flex-row md:items-center md:justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0 animate-pulse"
                      style={{ backgroundColor: deck.topic.course.color }}
                    />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400">
                      {deck.topic.course.title} &middot; {deck.topic.title}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground leading-tight">
                    {deck.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {deck.cards.length} {deck.cards.length === 1 ? 'card' : 'cards'} ready for study
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  <DeleteButton type="deck" id={deck.id} />
                  <Link
                    href={`/dashboard/study/review/${deck.id}`}
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 px-6 py-3.5 text-sm font-semibold text-indigo-500 dark:text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-600 dark:hover:text-indigo-300 hover:border-indigo-500 transition-all duration-300 active:scale-[0.98] w-full md:w-auto"
                  >
                    <Play className="h-4 w-4 fill-indigo-500 dark:fill-indigo-400 text-indigo-500 dark:text-indigo-400" />
                    Study Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

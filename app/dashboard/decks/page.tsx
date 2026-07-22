import { redirect } from "next/navigation";
import Link from "next/link";
import { Layers3, BookOpen, Brain, ChevronRight } from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DeleteButton from "@/components/dashboard/delete-button";
import ExportAnkiButton from "@/components/dashboard/export-anki-button";

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
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
          Flashcard Decks
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Manage, browse, and edit your custom flashcards and practice decks.
        </p>
      </div>

      {decks.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card/40 p-16 text-center">
          <Layers3 className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold text-foreground">
            No decks available
          </h3>
          <p className="mt-2 text-muted-foreground">
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
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/30 hover:bg-card/90 hover:shadow-xl space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className="inline-block rounded-lg px-2.5 py-1 text-[11px] font-bold"
                    style={{
                      backgroundColor: `${deck.topic.course.color}20`,
                      color: deck.topic.course.color,
                    }}
                  >
                    {deck.topic.course.title}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-indigo-500">
                    <Brain className="h-3.5 w-3.5" />
                    {deck.cards.length} {deck.cards.length === 1 ? 'card' : 'cards'}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {deck.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Topic: {deck.topic.title}
                  </p>
                </div>

                {/* Card Sample Preview Snippet */}
                {deck.cards.length > 0 && (
                  <div className="rounded-xl border border-border/60 bg-muted/30 p-3 text-xs text-muted-foreground space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 block">
                      Sample Question:
                    </span>
                    <p className="line-clamp-2 font-medium text-foreground text-[11px] leading-relaxed">
                      "{deck.cards[0].front}"
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-border/60">
                <Link
                  href={`/dashboard/study/review/${deck.id}`}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <span>Start Review</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>

                <div className="flex items-center gap-2">
                  <ExportAnkiButton deckId={deck.id} />
                  <DeleteButton type="deck" id={deck.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

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
    <div className="space-y-8">
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
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/dashboard/courses"
              className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-xs font-semibold text-white transition shadow-md shadow-indigo-600/10 cursor-pointer"
            >
              Go to Courses
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {decks.map((deck) => (
            <div
              key={deck.id}
              className="flex flex-col justify-between rounded-3xl border border-border bg-card/40 p-6 transition hover:border-indigo-500/40 hover:bg-card/85"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: deck.topic.course.color }}
                  />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {deck.topic.course.title} • {deck.topic.title}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {deck.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {deck.cards.length} {deck.cards.length === 1 ? "card" : "cards"}
                  </p>
                </div>
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
    </div>
  );
}

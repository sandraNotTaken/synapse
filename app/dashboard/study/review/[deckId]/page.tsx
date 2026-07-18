import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import FlashcardReviewSession from "./flashcard-review-session";

export default async function DeckReviewPage({
  params,
}: {
  params: Promise<{ deckId: string }>;
}) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const { deckId } = await params;

  // Fetch the deck and its cards, ensuring the current user owns them
  const deck = await prisma.deck.findFirst({
    where: {
      id: deckId,
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
  });

  if (!deck) {
    redirect("/dashboard/study");
  }

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <FlashcardReviewSession
        deckTitle={deck.title}
        courseTitle={deck.topic.course.title}
        courseColor={deck.topic.course.color}
        cards={deck.cards.map((c) => ({ id: c.id, front: c.front, back: c.back }))}
      />
    </main>
  );
}

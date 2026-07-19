"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function exportDeckToAnki(deckId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const deck = await prisma.deck.findUnique({
    where: { id: deckId },
    include: { cards: true },
  });

  if (!deck) {
    throw new Error("Deck not found");
  }

  // Format as Tab-Separated Values (TSV) for Anki import: Question \t Answer \t Explanation
  const tsvLines = deck.cards.map((card) => {
    const cleanFront = card.front.replace(/\t/g, " ").replace(/\n/g, "<br>");
    const cleanBack = card.back.replace(/\t/g, " ").replace(/\n/g, "<br>");
    const cleanExp = (card.explanation || "").replace(/\t/g, " ").replace(/\n/g, "<br>");
    return `${cleanFront}\t${cleanBack}\t${cleanExp}`;
  });

  const tsvContent = `#separator:Tab\n#html:true\n#tags:synapse ${deck.title.replace(/\s+/g, "_")}\n` + tsvLines.join("\n");

  return {
    success: true,
    deckTitle: deck.title,
    content: tsvContent,
  };
}

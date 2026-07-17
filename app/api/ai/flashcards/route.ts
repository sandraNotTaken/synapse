import { NextRequest, NextResponse } from "next/server";
import { createGroq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, topicId } = await req.json();

    if (!content || content.trim().replace(/<[^>]*>/g, "").length === 0) {
      return NextResponse.json(
        { error: "Notes content is too empty to generate flashcards." },
        { status: 400 }
      );
    }

    if (!topicId) {
      return NextResponse.json({ error: "Topic ID is required" }, { status: 400 });
    }

    // Verify ownership of the topic
    const topic = await prisma.topic.findFirst({
      where: {
        id: topicId,
        course: {
          user: {
            email: session.user.email,
          },
        },
      },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    // Generate flashcards using Llama 3
    const { object } = await generateObject({
      model: groq("llama-3.3-70b-versatile"),
      schema: z.object({
        cards: z.array(
          z.object({
            front: z.string().describe("The question or term on the front of the card"),
            back: z.string().describe("The answer or definition on the back of the card"),
          })
        ),
      }),
      system:
        "You are an expert study aid generator. Extract the key terms, definitions, formulas, and concepts from the user's study notes and convert them into high-quality flashcards (Question/Front and Answer/Back pairs). Ensure questions are clear and answers are concise.",
      prompt: `Study Notes:\n${content}`,
    });

    if (!object.cards || object.cards.length === 0) {
      return NextResponse.json(
        { error: "No flashcards could be generated from the content." },
        { status: 422 }
      );
    }

    // Save cards to a new deck
    const deck = await prisma.deck.create({
      data: {
        title: `AI Generated Deck - ${new Date().toLocaleDateString()}`,
        topicId: topicId,
        cards: {
          create: object.cards.map((card) => ({
            front: card.front,
            back: card.back,
          })),
        },
      },
      include: {
        cards: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully generated ${deck.cards.length} flashcards!`,
      deckId: deck.id,
      cardCount: deck.cards.length,
    });
  } catch (error) {
    console.error("AI Flashcards error:", error);
    return NextResponse.json(
      { error: "Failed to generate flashcards. Please try again." },
      { status: 500 }
    );
  }
}

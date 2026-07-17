import { NextRequest, NextResponse } from "next/server";
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { promises as fs } from "fs";
import { join } from "path";

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

    // Extract image URLs from note content
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/g;
    let match;
    const imageUrls: string[] = [];
    while ((match = imgRegex.exec(content)) !== null) {
      imageUrls.push(match[1]);
    }

    const systemPrompt =
      "You are an expert study aid generator. Extract the key terms, definitions, formulas, and concepts from the user's study notes and convert them into high-quality flashcards (Question/Front and Answer/Back pairs). Ensure questions are clear and answers are concise. Your response must be a single raw JSON object matching the requested schema, with no markdown code blocks, preambles, or formatting.";

    const promptText = `Extract flashcards from these study notes and any attached images.
Output schema:
{
  "cards": [
    {
      "front": "The question or term",
      "back": "The answer or definition"
    }
  ]
}

Study Notes:
${content.replace(/<img[^>]+>/g, "")}`;

    let textResult = "";

    if (imageUrls.length > 0) {
      // Use Groq Vision model if there are images
      const messageContent: any[] = [
        {
          type: "text",
          text: promptText,
        },
      ];

      for (const url of imageUrls) {
        try {
          if (url.startsWith("/uploads/")) {
            const filePath = join(process.cwd(), "public", url);
            const buffer = await fs.readFile(filePath);
            const ext = url.split(".").pop()?.toLowerCase();
            const mimeType = ext === "png" ? "image/png" : ext === "gif" ? "image/gif" : "image/jpeg";

            messageContent.push({
              type: "image",
              image: buffer,
              mimeType: mimeType,
            });
          }
        } catch (err) {
          console.error("Failed to read image file for flashcards:", url, err);
        }
      }

      const { text } = await generateText({
        model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: messageContent,
          },
        ],
      });
      textResult = text;
    } else {
      // Use Llama 3.3 70B for text-only flashcards
      const { text } = await generateText({
        model: groq("llama-3.3-70b-versatile"),
        system: systemPrompt,
        prompt: promptText,
      });
      textResult = text;
    }

    let object: { cards?: Array<{ front: string; back: string }> } = {};
    try {
      const cleanedText = textResult.replace(/```json/g, "").replace(/```/g, "").trim();
      object = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse JSON response:", textResult);
      return NextResponse.json(
        { error: "AI generated an invalid response format. Please try again." },
        { status: 500 }
      );
    }

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

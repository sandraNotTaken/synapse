import { NextRequest, NextResponse } from "next/server";
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();

    if (!content || content.trim().replace(/<[^>]*>/g, "").length === 0) {
      return NextResponse.json(
        { error: "Notes content is too empty to explain." },
        { status: 400 }
      );
    }

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      system:
        "You are an elite academic tutor. Break down and explain the key technical concepts in the user's study notes. Elaborate on complex terms, provide clear analogies, and list common pitfalls or questions students encounter. Format the output in gorgeous Markdown.",
      prompt: `Study Notes:\n${content}`,
    });

    return NextResponse.json({ explanation: text });
  } catch (error) {
    console.error("AI Explain error:", error);
    return NextResponse.json(
      { error: "Failed to generate explanation. Please try again." },
      { status: 500 }
    );
  }
}

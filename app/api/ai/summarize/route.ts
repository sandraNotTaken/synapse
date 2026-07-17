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
        { error: "Notes content is too empty to summarize." },
        { status: 400 }
      );
    }

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      system:
        "You are an expert academic summarizer. Summarize the user's study notes. Focus on high-yield concepts, definitions, and key takeaways. Format the output in clean, easy-to-read Markdown with headings, bullet points, and bold text.",
      prompt: `Notes:\n${content}`,
    });

    return NextResponse.json({ summary: text });
  } catch (error) {
    console.error("AI Summarize error:", error);
    return NextResponse.json(
      { error: "Failed to generate summary. Please check your AI configuration." },
      { status: 500 }
    );
  }
}

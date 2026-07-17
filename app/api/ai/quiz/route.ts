import { NextRequest, NextResponse } from "next/server";
import { createGroq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { z } from "zod";
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

    const { content } = await req.json();

    if (!content || content.trim().replace(/<[^>]*>/g, "").length === 0) {
      return NextResponse.json(
        { error: "Notes content is too empty to generate a quiz." },
        { status: 400 }
      );
    }

    // Generate quiz questions using Llama 3
    const { object } = await generateObject({
      model: groq("llama-3.3-70b-versatile"),
      schema: z.object({
        questions: z.array(
          z.object({
            question: z.string().describe("The quiz question text"),
            options: z.array(z.string()).min(4).max(4).describe("List of exactly 4 multiple choice options"),
            correctIndex: z.number().min(0).max(3).describe("0-indexed position of the correct option in options"),
            explanation: z.string().describe("Detailed explanation for why the correct option is right"),
          })
        ),
      }),
      system:
        "You are an expert exam designer. Generate 5 multiple-choice questions (MCQs) based on the user's study notes. Ensure questions are challenging, clear, and test actual understanding. Include exactly 4 options per question, index the correct answer (0-3), and write a clear explanatory rationale.",
      prompt: `Study Notes:\n${content}`,
    });

    if (!object.questions || object.questions.length === 0) {
      return NextResponse.json(
        { error: "No quiz questions could be generated." },
        { status: 422 }
      );
    }

    return NextResponse.json({ questions: object.questions });
  } catch (error) {
    console.error("AI Quiz error:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz. Please try again." },
      { status: 500 }
    );
  }
}

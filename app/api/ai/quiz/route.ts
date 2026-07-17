import { NextRequest, NextResponse } from "next/server";
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
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
    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      system:
        "You are an expert exam designer. Generate 5 multiple-choice questions (MCQs) based on the user's study notes. Ensure questions are challenging, clear, and test actual understanding. Include exactly 4 options per question, index the correct answer (0-3), and write a clear explanatory rationale. Your response must be a single raw JSON object matching the requested schema, with no markdown code blocks, preambles, or formatting.",
      prompt: `Generate a quiz from these study notes.
Output schema:
{
  "questions": [
    {
      "question": "The quiz question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why Option A is correct"
    }
  ]
}

Study Notes:
${content}`,
    });

    let object: {
      questions?: Array<{
        question: string;
        options: string[];
        correctIndex: number;
        explanation: string;
      }>;
    } = {};

    try {
      const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
      object = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse JSON response:", text);
      return NextResponse.json(
        { error: "AI generated an invalid response format. Please try again." },
        { status: 500 }
      );
    }

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

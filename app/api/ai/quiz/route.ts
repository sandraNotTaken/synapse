import { NextRequest, NextResponse } from "next/server";
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
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

    const { content, count, difficulty } = await req.json();

    if (!content || content.trim().replace(/<[^>]*>/g, "").length === 0) {
      return NextResponse.json(
        { error: "Notes content is too empty to generate a quiz." },
        { status: 400 }
      );
    }

    const quizCount = typeof count === "number" ? count : 5;
    const diffLevel = typeof difficulty === "string" ? difficulty : "intermediate";

    // Extract image URLs from note content
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/g;
    let match;
    const imageUrls: string[] = [];
    while ((match = imgRegex.exec(content)) !== null) {
      imageUrls.push(match[1]);
    }

    const systemPrompt =
      `You are an expert exam designer. Generate exactly ${quizCount} multiple-choice questions (MCQs) of ${diffLevel} difficulty based on the user's study notes and any attached images. Ensure questions are challenging, clear, and test actual understanding at a ${diffLevel} level. Include exactly 4 options per question, index the correct answer (0-3), and write a clear explanatory rationale. Your response must be a single raw JSON object matching the requested schema, with no markdown code blocks, preambles, or formatting.`;

    const promptText = `Generate a quiz of exactly ${quizCount} questions with a ${diffLevel} difficulty level from these study notes and any attached images.
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
          console.error("Failed to read image file for quiz:", url, err);
        }
      }

      const { text } = await generateText({
        model: groq("llama-3.2-11b-vision-preview"),
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
      // Use Llama 3.3 70B for text-only quiz
      const { text } = await generateText({
        model: groq("llama-3.3-70b-versatile"),
        system: systemPrompt,
        prompt: promptText,
      });
      textResult = text;
    }

    let object: {
      questions?: Array<{
        question: string;
        options: string[];
        correctIndex: number;
        explanation: string;
      }>;
    } = {};

    try {
      const match = textResult.match(/\{[\s\S]*\}/);
      const jsonString = match ? match[0] : textResult;
      object = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Failed to parse JSON response:", textResult);
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

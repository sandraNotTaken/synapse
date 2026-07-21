import { NextRequest, NextResponse } from "next/server";
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { promises as fs } from "fs";
import { join } from "path";
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
        { error: "Notes content is too empty to explain." },
        { status: 400 }
      );
    }

    // Extract image URLs from note content
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/g;
    let match;
    const imageUrls: string[] = [];
    while ((match = imgRegex.exec(content)) !== null) {
      imageUrls.push(match[1]);
    }

    const systemPrompt =
      "You are an elite academic tutor. Break down and explain the key technical concepts in the user's study notes. Elaborate on complex terms, provide clear analogies, and list common pitfalls or questions students encounter. Format the output in gorgeous Markdown.";

    let textResult = "";

    if (imageUrls.length > 0) {
      // Use Groq Vision model if there are images
      const messageContent: any[] = [
        {
          type: "text",
          text: `Explain these study notes in detail. Read, transcribe, and break down any text, key diagrams, formulas, or graphs contained in the attached images as well.\n\nStudy Notes:\n${content.replace(/<img[^>]+>/g, "")}`,
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
          console.error("Failed to read image file for tutoring explanation:", url, err);
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
      // Use Llama 3.3 70B for text-only explanation
      const { text } = await generateText({
        model: groq("llama-3.3-70b-versatile"),
        system: systemPrompt,
        prompt: `Study Notes:\n${content}`,
      });
      textResult = text;
    }

    return NextResponse.json({ explanation: textResult });
  } catch (error) {
    console.error("AI Explain error:", error);
    return NextResponse.json(
      { error: "Failed to generate explanation. Please try again." },
      { status: 500 }
    );
  }
}

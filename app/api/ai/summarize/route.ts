import { NextRequest, NextResponse } from "next/server";
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { promises as fs } from "fs";
import { join } from "path";

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

    // Extract image URLs from note content
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/g;
    let match;
    const imageUrls: string[] = [];
    while ((match = imgRegex.exec(content)) !== null) {
      imageUrls.push(match[1]);
    }

    const systemPrompt =
      "You are an expert academic summarizer. Summarize the user's study notes. Focus on high-yield concepts, definitions, and key takeaways. Format the output in clean, easy-to-read Markdown with headings, bullet points, and bold text.";

    let textResult = "";

    if (imageUrls.length > 0) {
      // Use Groq Vision model if there are images
      const messageContent: any[] = [
        {
          type: "text",
          text: `Summarize the following study notes. Also read and extract any text, key diagrams, formulas, or notes contained in the attached images to incorporate into your summary.\n\nNotes:\n${content.replace(/<img[^>]+>/g, "")}`,
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
          console.error("Failed to read image file for summary:", url, err);
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
      // Use Llama 3.3 70B for text-only summary
      const { text } = await generateText({
        model: groq("llama-3.3-70b-versatile"),
        system: systemPrompt,
        prompt: `Notes:\n${content}`,
      });
      textResult = text;
    }

    return NextResponse.json({ summary: textResult });
  } catch (error) {
    console.error("AI Summarize error:", error);
    return NextResponse.json(
      { error: "Failed to generate summary. Please check your AI configuration." },
      { status: 500 }
    );
  }
}

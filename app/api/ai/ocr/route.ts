import { NextRequest, NextResponse } from "next/server";
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "Groq API key is not configured on the server. Please add GROQ_API_KEY to your environment variables." },
        { status: 500 }
      );
    }

    const groq = createGroq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const { imageBase64 } = await req.json();
    if (!imageBase64) {
      return NextResponse.json({ error: "No image content provided" }, { status: 400 });
    }

    const response = await generateText({
      model: groq("qwen/qwen3.6-27b"),
      system: "You are an expert OCR transcription assistant. Transcribe all readable text from this document image. Output only the transcribed text, formatting headers and bullet points neatly in Markdown. Do not include preambles, explanations, or code blocks.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Transcribe all text from this image:",
            },
            {
              type: "image",
              image: imageBase64,
            },
          ],
        },
      ],
    });

    return NextResponse.json({ text: response.text });
  } catch (err: any) {
    console.error("OCR error:", err);
    return NextResponse.json({ error: err.message || "Failed to process image OCR" }, { status: 500 });
  }
}

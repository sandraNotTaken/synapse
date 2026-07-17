"use server";

import { generateText } from "ai";
import { groq } from "@/lib/ai";

export async function summarizeNotes(content: string) {
  if (!content.trim()) {
    throw new Error("No notes to summarize.");
  }

  const { text } = await generateText({
    model: groq("llama-3.3-70b-versatile"),

    system: `
You are an expert study assistant.

Summarize notes clearly.

Use bullet points.

Keep important definitions.

Do not invent facts.
`,

    prompt: content,
  });

  return text;
}
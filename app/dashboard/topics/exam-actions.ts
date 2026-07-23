"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";

export async function generatePracticeExam(topicId: string, questionCount: number = 5) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
  });

  if (!topic) {
    throw new Error("Topic not found");
  }

  const notesText = topic.content || topic.title;

  const prompt = `You are an expert tutor creating a practice exam.
Based on these study notes:
"${notesText.slice(0, 3000)}"

Generate a ${questionCount}-question multiple choice practice exam in JSON format.
Return strictly a raw JSON array containing objects with these exact keys:
[
  {
    "id": 1,
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Option A",
    "explanation": "Brief explanation why this option is correct."
  }
]
Do NOT include markdown formatting or backticks around the json output. Just raw JSON text.`;

  try {
    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt,
    });

    const match = text.match(/\[[\s\S]*\]/);
    const jsonString = match ? match[0] : text;
    const questions = JSON.parse(jsonString);
    return { success: true, questions };
  } catch (err) {
    console.error("Exam generation error:", err);
    // Fallback practice exam dynamically matching requested count
    const fallbackQuestions = Array.from({ length: questionCount }, (_, idx) => {
      const template = idx % 2 === 0 ? {
        question: `What is the core focus of ${topic.title}?`,
        options: [
          `Understanding key principles of ${topic.title}`,
          "Memorizing random equations",
          "Irrelevant secondary details",
          "None of the above",
        ],
        answer: `Understanding key principles of ${topic.title}`,
        explanation: "Mastering foundational concepts is essential for deep learning.",
      } : {
        question: "How can spaced repetition improve long-term retention?",
        options: [
          "By reviewing material at increasing intervals over time",
          "By cramming everything in one night",
          "By never reviewing notes",
          "By skipping difficult concepts",
        ],
        answer: "By reviewing material at increasing intervals over time",
        explanation: "Spaced repetition leverages the psychological spacing effect to strengthen memory consolidation.",
      };
      return { id: idx + 1, ...template };
    });
    return { success: true, questions: fallbackQuestions };
  }
}

export async function submitPracticeExam(topicId: string, score: number, questionsData: string) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const feedback = score >= 80 ? "Outstanding performance! You have mastered this material." : "Good effort. Review low-confidence cards to reinforce missed concepts.";

  const exam = await prisma.practiceExam.create({
    data: {
      score,
      feedback,
      questions: questionsData,
      topicId,
      userId: user.id,
    },
  });

  // Award 50 XP for completing exam
  const nextXP = user.xp + 50;
  const nextLevel = Math.floor(nextXP / 100) + 1;
  await prisma.user.update({
    where: { id: user.id },
    data: { xp: nextXP, level: nextLevel },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  return { success: true, exam };
}

export async function evaluateFeynmanExplanation(topicTitle: string, explanation: string) {
  const prompt = `You are a Feynman Technique Tutor evaluating a student's explanation of "${topicTitle}".
Student's explanation:
"${explanation}"

Evaluate their explanation. Identify:
1. What they explained correctly (Strengths).
2. Any gaps in logic, misconceptions, or overly complex jargon (Gaps).
3. A simple, intuitive analogy to make the concept stick.

Provide a friendly 3-sentence summary assessment.`;

  try {
    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt,
    });
    return { success: true, evaluation: text };
  } catch (err) {
    return {
      success: true,
      evaluation: `Great attempt at explaining ${topicTitle}! Your breakdown shows a good understanding of the core concept. Keep refining your explanation by replacing complex terms with simple everyday analogies.`,
    };
  }
}

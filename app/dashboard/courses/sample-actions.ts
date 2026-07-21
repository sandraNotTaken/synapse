"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function seedSampleCourse() {
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

  // Create Sample Course
  const course = await prisma.course.create({
    data: {
      title: "Neuroscience & Cognitive Memory",
      description: "Master foundational concepts of memory consolidation, neural plasticity, and cognitive optimization.",
      color: "#6366f1",
      userId: user.id,
      topics: {
        create: [
          {
            title: "Spaced Repetition & Synaptic Plasticity",
            content: `<h3>The Science of Spaced Repetition</h3><p>Spaced repetition leverages the <strong>psychological spacing effect</strong> to optimize memory consolidation. By reviewing information at expanding intervals, neural pathways are repeatedly reactivated right before forgetting occurs.</p><p>Key principles include:</p><ul><li><strong>Ebbinghaus Forgetting Curve:</strong> Memory retention degrades exponentially over time without active review.</li><li><strong>Synaptic Potentiation:</strong> Repeated retrieval strengthens dendritic spine connectivity in the hippocampus.</li></ul>`,
            decks: {
              create: [
                {
                  title: "Cognitive Memory & Spaced Repetition",
                  cards: {
                    create: [
                      {
                        front: "What is the Ebbinghaus Forgetting Curve?",
                        back: "A mathematical model describing how information retention degrades exponentially over time without active review.",
                        explanation: "Formulated by Hermann Ebbinghaus, showing that ~50% of new information is lost within 1 hour without retrieval.",
                        confidence: 3,
                      },
                      {
                        front: "How does Spaced Repetition optimize long-term retention?",
                        back: "By scheduling reviews right before memory decay occurs, strengthening synaptic connections with minimal effort.",
                        explanation: "Interval expansion forces active retrieval, consolidating short-term memory into long-term storage.",
                        confidence: 4,
                      },
                      {
                        front: "What role does the Hippocampus play in memory consolidation?",
                        back: "It acts as a temporary memory hub that gradually transfers consolidated memories to the neocortex during sleep.",
                        explanation: "Short-term neural representations are reorganized in the neocortex via sharp-wave ripples during slow-wave sleep.",
                        confidence: 3,
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/courses");
  revalidatePath("/dashboard/decks");
  revalidatePath("/dashboard/study");
  return { success: true, courseId: course.id };
}

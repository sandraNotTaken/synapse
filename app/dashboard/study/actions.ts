"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function logStudySession(durationSeconds: number) {
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

  const studySession = await prisma.studySession.create({
    data: {
      duration: durationSeconds,
      userId: user.id,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/study");
  return studySession;
}

export async function updateCardConfidence(
  cardId: string,
  rating: "again" | "hard" | "good" | "easy"
) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const confidenceMap = {
    again: 1,
    hard: 2,
    good: 3,
    easy: 4,
  };

  const confidence = confidenceMap[rating];

  const card = await prisma.card.update({
    where: { id: cardId },
    data: { confidence },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/study");
  return card;
}

export async function updateDailyGoal(minutes: number) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.update({
    where: { email: session.user.email },
    data: { dailyGoal: minutes },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/study");
  revalidatePath("/dashboard/settings");
  return user;
}

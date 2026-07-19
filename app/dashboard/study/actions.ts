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

  // Award 10 XP per minute of focus study
  const earnedXP = Math.max(5, Math.round((durationSeconds / 60) * 10));
  const newXP = user.xp + earnedXP;
  const newLevel = Math.floor(newXP / 100) + 1;

  await prisma.user.update({
    where: { id: user.id },
    data: { xp: newXP, level: newLevel },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/study");
  revalidatePath("/dashboard/settings");
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

  const qualityMap = {
    again: 1,
    hard: 2,
    good: 4,
    easy: 5,
  };

  const confidence = confidenceMap[rating];
  const quality = qualityMap[rating];

  // Fetch current card SM-2 metrics
  const currentCard = await prisma.card.findUnique({
    where: { id: cardId },
  });

  if (!currentCard) {
    throw new Error("Card not found");
  }

  let interval = currentCard.interval || 1;
  let easeFactor = currentCard.easeFactor || 2.5;
  let repetitions = currentCard.repetitions || 0;

  // SuperMemo-2 (SM-2) Interval Calculation
  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  // Update Ease Factor formula
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + interval);

  const updatedCard = await prisma.card.update({
    where: { id: cardId },
    data: {
      confidence,
      interval,
      easeFactor,
      repetitions,
      dueDate,
    },
  });

  // Award XP to user for reviewing cards
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (user) {
    const gainedXP = quality >= 3 ? 15 : 5;
    const nextXP = user.xp + gainedXP;
    const nextLevel = Math.floor(nextXP / 100) + 1;
    await prisma.user.update({
      where: { id: user.id },
      data: { xp: nextXP, level: nextLevel },
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/study");
  revalidatePath("/dashboard/settings");
  return updatedCard;
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

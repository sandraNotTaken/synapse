"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUserNotifications() {
  const session = await auth();
  if (!session?.user?.email) {
    return [];
  }

  return prisma.notification.findMany({
    where: {
      user: {
        email: session.user.email,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function markNotificationAsRead(id: string) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const notification = await prisma.notification.update({
    where: { id },
    data: { read: true },
  });

  revalidatePath("/dashboard");
  return notification;
}

export async function clearAllNotifications() {
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

  await prisma.notification.deleteMany({
    where: { userId: user.id },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function createNotification(title: string, body: string, type: "goal" | "streak" | "review" | "system") {
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

  const newNotif = await prisma.notification.create({
    data: {
      title,
      body,
      type,
      userId: user.id,
    },
  });

  revalidatePath("/dashboard");
  return newNotif;
}

export async function generateSimulatedNotifications() {
  const session = await auth();
  if (!session?.user?.email) return { success: false };

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      notifications: true,
      studySessions: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) return { success: false };

  const unreadCount = user.notifications.filter(n => !n.read).length;
  if (unreadCount > 2) return { success: true }; // Don't flood them

  // 1. Goal Notification Simulation
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);
  const todaysSessions = user.studySessions.filter(s => s.createdAt >= startOfToday);
  const totalSecondsToday = todaysSessions.reduce((sum, s) => sum + s.duration, 0);
  const studyMinutesToday = Math.round(totalSecondsToday / 60);

  const hasGoalNotif = user.notifications.some(n => n.type === "goal" && n.createdAt >= startOfToday);

  if (studyMinutesToday >= user.dailyGoal && !hasGoalNotif) {
    await prisma.notification.create({
      data: {
        title: "Daily Goal Reached! 🎉",
        body: `Congratulations! You've achieved your daily target of ${user.dailyGoal} minutes of focused learning today.`,
        type: "goal",
        userId: user.id,
      },
    });
  }

  // 2. Review notification if they have unreviewed decks
  const totalCards = await prisma.card.count({
    where: { deck: { topic: { course: { userId: user.id } } } }
  });

  const hasReviewNotif = user.notifications.some(n => n.type === "review" && n.createdAt >= startOfToday);

  if (totalCards > 0 && !hasReviewNotif && Math.random() > 0.4) {
    await prisma.notification.create({
      data: {
        title: "Decks Ready for Review 🧠",
        body: "You have cards waiting to be reviewed. Keep them fresh with a quick spaced repetition session!",
        type: "review",
        userId: user.id,
      },
    });
  }

  revalidatePath("/dashboard");
  return { success: true };
}

"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUserNotifications() {
  const session = await auth();
  if (!session?.user?.email) {
    return [];
  }

  try {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Notification Query Timeout")), 1500)
    );
    const query = prisma.notification.findMany({
      where: {
        user: {
          email: session.user.email,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return (await Promise.race([query, timeout])) as any[];
  } catch (err) {
    return [];
  }
}

export async function markNotificationAsRead(id: string) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  try {
    const notification = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    revalidatePath("/dashboard");
    return notification;
  } catch (err) {
    console.error("Failed to mark notification as read:", err);
    return null;
  }
}

export async function clearAllNotifications() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  try {
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
  } catch (err) {
    console.error("Failed to clear notifications:", err);
    return { success: false };
  }
}

export async function createNotification(title: string, body: string, type: "goal" | "streak" | "review" | "system") {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  try {
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
  } catch (err) {
    console.error("Failed to create notification:", err);
    return null;
  }
}

export async function generateSimulatedNotifications() {
  const session = await auth();
  if (!session?.user?.email) return { success: false };

  try {
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

    const unreadCount = user.notifications.filter((n) => !n.read).length;
    if (unreadCount >= 3) return { success: true };

    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);

    // 1. STREAK NOTIFICATION WIDGET TRIGGER
    const hasStreakNotif = user.notifications.some(
      (n) => n.type === "streak" && n.createdAt >= startOfToday
    );

    // Calculate active streak count
    let streakCount = 1;
    if (user.studySessions.length > 0) {
      const dates = user.studySessions.map((s) => {
        const d = new Date(s.createdAt);
        d.setUTCHours(0, 0, 0, 0);
        return d.getTime();
      });
      const uniqueDates = Array.from(new Set(dates)).sort((a, b) => b - a);
      streakCount = uniqueDates.length > 0 ? Math.max(1, uniqueDates.length) : 1;
    }

    if (!hasStreakNotif && streakCount >= 1) {
      await prisma.notification.create({
        data: {
          title: `🔥 ${streakCount}-Day Study Streak Active!`,
          body: `Keep the fire burning! You've logged active learning sessions for ${streakCount} consecutive days.`,
          type: "streak",
          userId: user.id,
        },
      });
    }

    // 2. GOAL NOTIFICATION TRIGGER
    const todaysSessions = user.studySessions.filter((s) => s.createdAt >= startOfToday);
    const totalSecondsToday = todaysSessions.reduce((sum, s) => sum + s.duration, 0);
    const studyMinutesToday = Math.round(totalSecondsToday / 60);

    const hasGoalNotif = user.notifications.some(
      (n) => n.type === "goal" && n.createdAt >= startOfToday
    );

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

    // 3. REVIEW NOTIFICATION TRIGGER
    const totalCards = await prisma.card.count({
      where: { deck: { topic: { course: { userId: user.id } } } },
    });

    const hasReviewNotif = user.notifications.some(
      (n) => n.type === "review" && n.createdAt >= startOfToday
    );

    if (totalCards > 0 && !hasReviewNotif) {
      await prisma.notification.create({
        data: {
          title: "Decks Ready for Review 🧠",
          body: "You have cards waiting to be reviewed. Keep them fresh with a quick spaced repetition session!",
          type: "review",
          userId: user.id,
        },
      });
    }

    // 4. XP LEVEL-UP NOTIFICATION TRIGGER
    const hasLevelNotif = user.notifications.some(
      (n) => n.title.includes("Level Up") && n.createdAt >= startOfToday
    );

    if (user.xp >= 100 && !hasLevelNotif) {
      await prisma.notification.create({
        data: {
          title: `⚡ Level ${user.level} Thinker Milestone!`,
          body: `Awesome progress! You've accumulated ${user.xp} total XP points across your study sessions.`,
          type: "system",
          userId: user.id,
        },
      });
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    console.error("Failed to generate simulated notifications:", err);
    return { success: false };
  }
}

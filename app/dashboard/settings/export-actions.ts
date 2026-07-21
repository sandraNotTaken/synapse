"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function exportUserData() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      courses: {
        include: {
          topics: {
            include: {
              decks: {
                include: {
                  cards: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error("User data not found");
  }

  const backupData = {
    exportedAt: new Date().toISOString(),
    user: {
      name: user.name,
      email: user.email,
      xp: user.xp,
      level: user.level,
      dailyGoal: user.dailyGoal,
    },
    courses: user.courses,
  };

  return JSON.stringify(backupData, null, 2);
}

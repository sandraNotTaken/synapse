"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(name: string) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const updatedUser = await prisma.user.update({
    where: { email: session.user.email },
    data: { name },
  });

  revalidatePath("/dashboard/settings");
  return { success: true, user: updatedUser };
}

export async function resetAccountData() {
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

  // Deleting courses will trigger cascading deletes on topics, decks, and cards
  await prisma.course.deleteMany({
    where: { userId: user.id },
  });

  // Delete study sessions
  await prisma.studySession.deleteMany({
    where: { userId: user.id },
  });

  // Delete notifications
  await prisma.notification.deleteMany({
    where: { userId: user.id },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

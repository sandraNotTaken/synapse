"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function createCourse(formData: FormData) {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title")?.toString();

  if (!title) {
    throw new Error("Title is required");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.course.create({
    data: {
      title,
      userId: user.id,
    },
  });
}
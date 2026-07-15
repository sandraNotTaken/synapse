"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCourse(formData: FormData) {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title")?.toString().trim();

  if (!title) {
    throw new Error("Title is required");
  }

  const description =
    formData.get("description")?.toString().trim() || "";

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
      color: "#6366F1",
      userId: user.id,
    },
  });

  revalidatePath("/dashboard");
}
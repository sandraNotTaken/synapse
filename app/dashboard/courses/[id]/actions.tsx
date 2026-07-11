"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  createCourseSchema,
  type CreateCourseInput,
} from "@/lib/validations/course";

export async function createCourse(data: CreateCourseInput) {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const validated = createCourseSchema.parse(data);

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
      title: validated.title,
      description: validated.description || null,
      color: validated.color,
      userId: user.id,
    },
  });

  revalidatePath("/dashboard/courses");
}
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTopic(formData: FormData) {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title")?.toString().trim();
  const courseId = formData.get("courseId")?.toString();

  if (!title || !courseId) {
    throw new Error("Missing required fields.");
  }

  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      user: {
        email: session.user.email,
      },
    },
  });

  if (!course) {
    throw new Error("Course not found.");
  }

  await prisma.topic.create({
    data: {
      title,
      courseId,
    },
  });

  revalidatePath(`/dashboard/courses/${courseId}`);
}

export async function updateTopicContent(
  topicId: string,
  content: string
) {
  await prisma.topic.update({
    where: {
      id: topicId,
    },
    data: {
      content,
    },
  });

  revalidatePath(`/dashboard/topics/${topicId}`);
}
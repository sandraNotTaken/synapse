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
      title: validated.title.trim(),
      color: validated.color,
      userId: user.id,
    },
  });

  revalidatePath("/dashboard/courses");
}

export async function deleteCourse(courseId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
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
    throw new Error("Course not found or unauthorized");
  }

  await prisma.course.delete({
    where: {
      id: courseId,
    },
  });

  revalidatePath("/dashboard/courses");
  revalidatePath("/dashboard");
}

export async function deleteTopic(topicId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const topic = await prisma.topic.findFirst({
    where: {
      id: topicId,
      course: {
        user: {
          email: session.user.email,
        },
      },
    },
    include: {
      course: true,
    },
  });

  if (!topic) {
    throw new Error("Topic not found or unauthorized");
  }

  await prisma.topic.delete({
    where: {
      id: topicId,
    },
  });

  revalidatePath(`/dashboard/courses/${topic.courseId}`);
  revalidatePath("/dashboard");
}

export async function deleteDeck(deckId: string) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const deck = await prisma.deck.findFirst({
    where: {
      id: deckId,
      topic: {
        course: {
          user: {
            email: session.user.email,
          },
        },
      },
    },
  });

  if (!deck) {
    throw new Error("Deck not found or unauthorized");
  }

  await prisma.deck.delete({
    where: {
      id: deckId,
    },
  });

  revalidatePath("/dashboard/decks");
  revalidatePath("/dashboard/study");
}
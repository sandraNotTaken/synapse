"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function searchAllUserContent(query: string) {
  const session = await auth();
  if (!session?.user?.email || !query.trim()) {
    return { courses: [], topics: [], decks: [] };
  }

  const cleanQuery = query.trim();

  // Find user with case-insensitive email match
  const user = await prisma.user.findFirst({
    where: { email: { equals: session.user.email, mode: "insensitive" } },
  });

  if (!user) {
    return { courses: [], topics: [], decks: [] };
  }

  // Search user courses
  const courses = await prisma.course.findMany({
    where: {
      userId: user.id,
      OR: [
        { title: { contains: cleanQuery, mode: "insensitive" } },
        { description: { contains: cleanQuery, mode: "insensitive" } },
      ],
    },
    take: 5,
    select: {
      id: true,
      title: true,
      color: true,
    },
  });

  // Search user topics
  const topics = await prisma.topic.findMany({
    where: {
      course: { userId: user.id },
      OR: [
        { title: { contains: cleanQuery, mode: "insensitive" } },
        { content: { contains: cleanQuery, mode: "insensitive" } },
      ],
    },
    take: 5,
    select: {
      id: true,
      title: true,
      courseId: true,
      course: { select: { title: true, color: true } },
    },
  });

  // Search user decks
  const decks = await prisma.deck.findMany({
    where: {
      topic: { course: { userId: user.id } },
      title: { contains: cleanQuery, mode: "insensitive" },
    },
    take: 5,
    select: {
      id: true,
      title: true,
      topic: { select: { title: true, course: { select: { color: true } } } },
    },
  });

  return { courses, topics, decks };
}

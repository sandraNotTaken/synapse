import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getDashboardData() {
  const session = await auth();

  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      courses: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          topics: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  const totalTopics = user.courses.reduce(
    (count, course) => count + course.topics.length,
    0,
  );

  const recentCourses = user.courses.slice(0, 5).map((course) => ({
    id: course.id,
    title: course.title,
    color: course.color,
    topics: course.topics.length,
    progress: 0, // we'll calculate this later
  }));

  return {
    user,
    totalCourses: user.courses.length,
    totalTopics,
    reviewsToday: 0,
    streak: 0,
    recentCourses,
  };
}
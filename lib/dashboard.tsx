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

  return {
    user,
    totalCourses: user.courses.length,
    totalTopics,
    reviewsToday: 0,
    streak: 0,
    recentCourses: user.courses.slice(0, 5),
  };
}
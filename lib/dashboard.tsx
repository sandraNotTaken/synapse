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
    return null;
  }

  // Calculate total topics
  const totalTopics = user.courses.reduce(
    (count, course) => count + course.topics.length,
    0,
  );

  // Calculate today's study minutes
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);

  const sessionsToday = await prisma.studySession.findMany({
    where: {
      userId: user.id,
      createdAt: {
        gte: startOfToday,
      },
    },
  });

  const totalSecondsToday = sessionsToday.reduce((sum, s) => sum + s.duration, 0);
  const studyMinutesToday = Math.round(totalSecondsToday / 60);

  // Calculate streak based on logged sessions
  const allSessions = await prisma.studySession.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  });

  let streak = 0;
  if (allSessions.length > 0) {
    const uniqueDays = new Set<string>();
    allSessions.forEach((s) => {
      const dateStr = s.createdAt.toISOString().split("T")[0];
      uniqueDays.add(dateStr);
    });

    const sortedDays = Array.from(uniqueDays).sort((a, b) => b.localeCompare(a));
    const todayStr = new Date().toISOString().split("T")[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    const mostRecentStudyDate = sortedDays[0];
    const isActive = mostRecentStudyDate === todayStr || 
                     mostRecentStudyDate === yesterdayStr || 
                     mostRecentStudyDate === tomorrowStr;

    if (isActive) {
      let checkDate = new Date(mostRecentStudyDate + "T00:00:00.000Z");
      while (true) {
        const checkStr = checkDate.toISOString().split("T")[0];
        if (sortedDays.includes(checkStr)) {
          streak++;
          checkDate.setUTCDate(checkDate.getUTCDate() - 1);
        } else {
          break;
        }
      }
    }
  }

  // Calculate cards that have low confidence (<= 2) or are new/unrated (default 3 but let's count cards with confidence <= 2 as active reviews)
  const reviewsToday = await prisma.card.count({
    where: {
      deck: {
        topic: {
          course: {
            userId: user.id,
          },
        },
      },
      confidence: {
        lte: 2,
      },
    },
  });

  // Calculate recent courses progress
  const recentCourses = user.courses.slice(0, 5).map((course) => {
    // Average confidence across all cards in the course
    let totalCardsCount = 0;
    let totalConfidenceSum = 0;

    course.topics.forEach((topic) => {
      topic.decks.forEach((deck) => {
        deck.cards.forEach((card) => {
          totalCardsCount++;
          totalConfidenceSum += card.confidence;
        });
      });
    });

    const avgConfidence = totalCardsCount > 0 ? (totalConfidenceSum / totalCardsCount) : 0;
    // Map progress to dynamic completion
    const progress = course.topics.length === 0
      ? 0
      : Math.min(course.topics.length * 20, 100);

    return {
      id: course.id,
      title: course.title,
      description: course.description,
      color: course.color,
      topics: course.topics.length,
      progress,
      avgConfidence,
      updatedAt: course.updatedAt,
    };
  });

  return {
    user,
    totalCourses: user.courses.length,
    totalTopics,
    reviewsToday,
    streak,
    studyMinutesToday,
    dailyGoal: user.dailyGoal,
    recentCourses,
  };
}
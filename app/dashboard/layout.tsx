import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { ReactNode } from "react";
import DashboardClientLayout from "./dashboard-client-layout";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  let courses: any[] = [];
  if (session?.user?.email) {
    courses = await prisma.course.findMany({
      where: {
        user: {
          email: session.user.email,
        },
      },
      include: {
        topics: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // Pass user session as a plain serializable object to the client component
  const user = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }
    : undefined;

  let dailyGoal = 45;
  let studyMinutesToday = 0;

  if (session?.user?.email) {
    const userRecord = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        dailyGoal: true,
      },
    });

    if (userRecord) {
      dailyGoal = userRecord.dailyGoal;

      const startOfToday = new Date();
      startOfToday.setUTCHours(0, 0, 0, 0);

      const sessionsToday = await prisma.studySession.findMany({
        where: {
          userId: userRecord.id,
          createdAt: {
            gte: startOfToday,
          },
        },
        select: {
          duration: true,
        },
      });

      const totalSecondsToday = sessionsToday.reduce((sum, s) => sum + s.duration, 0);
      studyMinutesToday = Math.round(totalSecondsToday / 60);
    }
  }

  return (
    <DashboardClientLayout
      courses={courses}
      user={user}
      dailyGoal={dailyGoal}
      studyMinutesToday={studyMinutesToday}
    >
      {children}
    </DashboardClientLayout>
  );
}
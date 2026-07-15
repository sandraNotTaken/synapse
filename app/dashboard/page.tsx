import { Suspense } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getDashboardData } from "@/lib/dashboard";
import { NewCourseDialog } from "@/components/dashboard/new-course-dialog";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import RecentCourses from "@/components/dashboard/recent-courses";
import { CourseGridSkeleton } from "@/components/skeletons/course-grid-skeleton";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const data = await getDashboardData();

  if (!data) {
    redirect("/login");
  }

  return (
    <main className="space-y-8">
      <DashboardHeader name={data.user.name} />

      <StatsGrid
        totalCourses={data.totalCourses}
        totalTopics={data.totalTopics}
        reviewsToday={data.reviewsToday}
        streak={data.streak}
      />

      <Suspense fallback={<CourseGridSkeleton />}>
        <RecentCourses courses={data.recentCourses} />
      </Suspense>
    </main>
  );
}
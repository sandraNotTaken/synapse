import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import RecentCourses from "@/components/dashboard/recent-courses";
import { CourseGridSkeleton } from "@/components/skeletons/course-grid-skeleton";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="space-y-8">
      <DashboardHeader name={session.user?.name} />

      <StatsGrid />

      <Suspense fallback={<CourseGridSkeleton />}>
        <RecentCourses />
      </Suspense>
    </main>
  );
}
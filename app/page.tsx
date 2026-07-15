import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getDashboardData } from "@/lib/dashboard";

import WelcomeBanner from "@/components/dashboard/welcome-banner";
import CourseCarousel from "@/components/dashboard/course-carousel";

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
    <div className="space-y-10">
      <WelcomeBanner
        name={data.user.name ?? "Learner"}
      />

      <CourseCarousel />
    </div>
  );
}
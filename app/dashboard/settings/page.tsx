import { redirect } from "next/navigation";
import { LogOut } from "lucide-react";

import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import SettingsClient from "@/components/dashboard/settings-client";
import ExportDataButton from "@/components/dashboard/export-data-button";
import { DayAnalytics } from "@/components/dashboard/analytics-chart";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const name = session.user.name || session.user.email.split("@")[0];
  const email = session.user.email;
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setUTCHours(0, 0, 0, 0);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const userRecord = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      dailyGoal: true,
      xp: true,
      level: true,
      studySessions: {
        where: {
          createdAt: { gte: sevenDaysAgo },
        },
      },
    },
  });

  const currentGoal = userRecord?.dailyGoal ?? 45;
  const xp = userRecord?.xp ?? 0;
  const level = userRecord?.level ?? 1;

  // Build real weekly analytics data from database
  const daysMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyAnalytics: DayAnalytics[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setUTCHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);

    const nextD = new Date(d);
    nextD.setDate(nextD.getDate() + 1);

    const daySessions = userRecord?.studySessions.filter(
      (s) => s.createdAt >= d && s.createdAt < nextD
    ) || [];

    const totalSecs = daySessions.reduce((acc, curr) => acc + curr.duration, 0);
    const mins = Math.round(totalSecs / 60);

    const cardsReviewed = userRecord?.id
      ? await prisma.card.count({
          where: {
            createdAt: { gte: d, lt: nextD },
            deck: { topic: { course: { userId: userRecord.id } } },
          },
        })
      : 0;

    weeklyAnalytics.push({
      day: daysMap[d.getDay()],
      dateStr: `${d.getMonth() + 1}/${d.getDate()}`,
      mins,
      cardsReviewed,
    });
  }

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">Settings & Analytics</h1>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Manage your personal profile, review real-time focus analytics, set daily goals, and clear study data.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ExportDataButton />

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-500/20 hover:border-red-500/40 transition cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </form>
        </div>
      </div>

      {/* Interactive Tabs Content */}
      <SettingsClient
        initialName={name}
        email={email}
        initials={initials}
        currentGoal={currentGoal}
        xp={xp}
        level={level}
        weeklyAnalytics={weeklyAnalytics}
      />
    </main>
  );
}

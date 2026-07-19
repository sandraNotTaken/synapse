import { redirect } from "next/navigation";
import { ShieldCheck, LogOut } from "lucide-react";

import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import SettingsClient from "@/components/dashboard/settings-client";

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

  const userRecord = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { dailyGoal: true, xp: true, level: true },
  });
  const currentGoal = userRecord?.dailyGoal ?? 45;
  const xp = userRecord?.xp ?? 0;
  const level = userRecord?.level ?? 1;

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground font-heading">Settings</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your personal profile, set study goals, review hotkeys, and clear learning metrics.
          </p>
        </div>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-500/20 hover:border-red-500/40 transition cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </form>
      </div>

      {/* Interactive Tabs Content */}
      <SettingsClient
        initialName={name}
        email={email}
        initials={initials}
        currentGoal={currentGoal}
        xp={xp}
        level={level}
      />
    </main>
  );
}

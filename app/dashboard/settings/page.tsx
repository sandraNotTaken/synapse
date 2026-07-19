import { redirect } from "next/navigation";
import { User, Mail, LogOut, Settings as SettingsIcon, ShieldCheck } from "lucide-react";

import { auth, signOut } from "@/auth";
import ThemeToggle from "@/components/dashboard/theme-toggle";
import GoalSettings from "@/components/dashboard/goal-settings";
import { prisma } from "@/lib/prisma";

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
    select: { dailyGoal: true },
  });
  const currentGoal = userRecord?.dailyGoal ?? 45;

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your profile settings, app preferences, and theme choices.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-xl space-y-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-500/10 text-2xl font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                {initials}
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">{name}</h3>
                <span className="inline-flex items-center gap-1 mt-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-500 border border-emerald-500/30">
                  <ShieldCheck className="h-3 w-3" />
                  Active Account
                </span>
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4 shrink-0 text-indigo-500" />
                <span className="truncate">{name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0 text-indigo-500" />
                <span className="truncate">{email}</span>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/login" });
                }}
              >
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-500/20 hover:border-red-500/40 transition cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Preferences Panels */}
        <div className="md:col-span-2 space-y-8">
          {/* Theme Preferences */}
          <div className="rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <SettingsIcon className="h-5 w-5 text-indigo-500" />
                Appearance Settings
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Toggle between light theme and dark theme for the interface.
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground block">
                Interface Theme
              </label>
              <ThemeToggle />
            </div>
          </div>

          {/* Goal Preferences */}
          <GoalSettings currentGoal={currentGoal} />

          {/* Tips Card */}
          <div className="rounded-3xl border border-indigo-500/10 bg-indigo-500/5 p-6 space-y-4">
            <h3 className="font-semibold text-indigo-600 dark:text-indigo-400">
              Synapse Personalization Tip
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Toggling light mode switches the app layout to a crisp, high-contrast design optimized for study in bright environments. Switching back to dark mode activates the signature deep space obsidian theme.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

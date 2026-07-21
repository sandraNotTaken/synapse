interface DashboardHeaderProps {
  name?: string | null;
}

export function DashboardHeader({ name }: DashboardHeaderProps) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 sm:p-8 backdrop-blur-xl space-y-2">
      <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
        Study lounge
      </p>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
        Welcome back{name ? `, ${name}` : ""}
      </h1>
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
        Keep the momentum going with a focused, beautifully paced study and review session.
      </p>
    </div>
  );
}
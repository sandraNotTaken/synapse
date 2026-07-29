interface DashboardHeaderProps {
  name?: string | null;
  isNew?: boolean;
}

export function DashboardHeader({ name, isNew }: DashboardHeaderProps) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 sm:p-8 backdrop-blur-xl space-y-2">
      <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
        {isNew ? "Get started" : "Study lounge"}
      </p>
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
        {isNew ? `Welcome, ${name || "User"}` : `Welcome back${name ? `, ${name}` : ""}`}
      </h1>
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
        {isNew
          ? "Create a course using the sidebar to begin generating flashcards and managing your study tracks."
          : "Keep the momentum going with a focused, beautifully paced study and review session."}
      </p>
    </div>
  );
}
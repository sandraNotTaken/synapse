interface DashboardHeaderProps {
  name?: string | null;
}

export function DashboardHeader({ name }: DashboardHeaderProps) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/5 px-6 py-6 backdrop-blur">
      <p className="text-sm font-medium uppercase tracking-[0.35em] text-indigo-300/80">
        Study lounge
      </p>
      <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
        Welcome back{name ? `, ${name}` : ""}
      </h1>
      <p className="mt-2 text-sm text-slate-400 sm:text-base">
        Keep the momentum going with a focused, beautifully paced review session.
      </p>
    </div>
  );
}
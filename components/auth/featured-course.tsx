import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FeaturedCourse() {
  return (
    <div className="group relative overflow-hidden rounded-[32px] border border-border bg-card/95 p-8 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.15),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.12),transparent_30%)]" />

      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs uppercase tracking-[0.3em] text-indigo-500 dark:text-indigo-200">
            Study Space Preview
          </span>
          <span className="rounded-full border border-border bg-muted/60 px-3 py-1 text-xs text-foreground font-semibold">
            All-in-one
          </span>
        </div>

        <div className="my-6">
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Your Knowledge Space</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Organize your courses, generate smart review decks, and retain information forever using dynamic spaced repetition.
          </p>
        </div>

        <div className="space-y-4 rounded-3xl border border-border bg-muted/40 p-5 my-6">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Spaced Repetition</span>
            <span className="text-foreground">SM-2 Algorithm</span>
          </div>
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Active Recall</span>
            <span className="text-foreground">Custom Flashcards</span>
          </div>
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Focus System</span>
            <span className="text-foreground">Pomodoro Timer</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-xs font-semibold text-muted-foreground">
            <span>Core Features Readiness</span>
            <span className="font-bold text-foreground">100%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" />
          </div>

          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex cursor-pointer items-center gap-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 px-6 py-3 text-xs font-bold text-white transition shadow-md shadow-indigo-600/10 active:scale-[0.98]"
            >
              <span>Explore Dashboard</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
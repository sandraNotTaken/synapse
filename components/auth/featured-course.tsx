import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FeaturedCourse() {
  return (
    <div className="group relative overflow-hidden rounded-[32px] border border-border bg-card/95 p-8 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.15),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.12),transparent_30%)]" />

      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs uppercase tracking-[0.3em] text-indigo-500 dark:text-indigo-200">
            Resume session
          </span>
          <span className="rounded-full border border-border bg-muted/60 px-3 py-1 text-xs text-foreground">
            72% complete
          </span>
        </div>

        <div>
          <h2 className="text-4xl font-semibold text-foreground">Computer Engineering</h2>
          <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
            Continue your latest study track with a premium review card that feels calm and cinematic.
          </p>
        </div>

        <div className="space-y-4 rounded-3xl border border-border bg-muted/40 p-5">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Topics</span>
            <span>18</span>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Next up</span>
            <span>Module 4</span>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Time estimate</span>
            <span>22 min</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span className="font-semibold text-foreground">72%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400" />
          </div>

          <Link
            href="/dashboard"
            className="inline-flex cursor-pointer items-center gap-3 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-95"
          >
            Resume Learning
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
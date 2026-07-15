import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FeaturedCourse() {
  return (
    <div className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-[#090a11]/95 p-8 shadow-[0_30px_90px_-50px_rgba(59,130,246,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.15),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.12),transparent_30%)]" />

      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs uppercase tracking-[0.3em] text-indigo-200">
            Resume session
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
            72% complete
          </span>
        </div>

        <div>
          <h2 className="text-4xl font-semibold text-white">Computer Engineering</h2>
          <p className="mt-3 max-w-xl text-base leading-7 text-slate-300">
            Continue your latest study track with a premium review card that feels calm and cinematic.
          </p>
        </div>

        <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>Topics</span>
            <span>18</span>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>Next up</span>
            <span>Module 4</span>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>Time estimate</span>
            <span>22 min</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between text-sm text-slate-300">
            <span>Progress</span>
            <span className="font-semibold text-white">72%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-800/80">
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
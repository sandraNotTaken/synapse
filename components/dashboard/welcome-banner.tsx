import { ArrowRight } from "lucide-react";

interface WelcomeBannerProps {
  name: string;
}

export default function WelcomeBanner({ name }: WelcomeBannerProps) {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.35),_transparent_38%),linear-gradient(135deg,_#0f172a,_#020617)] p-8 shadow-[0_20px_60px_-25px_rgba(79,70,229,0.45)] sm:p-10">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.08),transparent)]" />

      <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-indigo-300/80">
            Welcome back
          </p>

          <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
            Good evening,
            <br />
            {name}
          </h1>

          <p className="mt-4 text-lg text-slate-300/90">
            Continue your learning flow with a calm, cinematic study experience made for focus.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="rounded-full bg-white px-5 py-3 font-semibold text-slate-950 transition hover:translate-y-[-1px]">
            Resume study
          </button>
          <button className="rounded-full border border-white/15 bg-white/10 px-5 py-3 font-semibold text-white/90 transition hover:bg-white/15">
            Explore library
          </button>
        </div>
      </div>
    </section>
  );
}
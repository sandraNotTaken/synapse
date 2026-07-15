interface CourseCardProps {
  title: string;
  topics: number;
  progress: number;
}

export default function CourseCard({
  title,
  topics,
  progress,
}: CourseCardProps) {
  return (
    <div className="group cursor-pointer overflow-hidden rounded-[24px] border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/40 hover:bg-white/10">
      <div className="h-36 bg-[linear-gradient(135deg,_rgba(99,102,241,0.95),_rgba(56,189,248,0.9))]" />

      <div className="space-y-5 p-5">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="mt-1 text-sm text-slate-400">{topics} topics • Ready to continue</p>
        </div>

        <div>
          <div className="mb-2 flex justify-between text-sm text-slate-400">
            <span>Progress</span>
            <span className="text-white">{progress}%</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-800/80">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
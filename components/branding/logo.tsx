import Link from "next/link";

interface LogoProps {
  showText?: boolean;
}

export default function Logo({ showText = true }: LogoProps) {
  return (
    <Link
      href="/"
      className="group flex items-center gap-3 transition-opacity hover:opacity-90"
    >
      {/* Custom Refined Synapse Neural Mark */}
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 shadow-md shadow-indigo-500/25 transition-transform duration-300 group-hover:scale-105">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 text-white"
        >
          {/* Synapse Neural Connection Path */}
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" className="opacity-40" />
          {/* Central Synaptic Pulse Spark */}
          <circle cx="12" cy="12" r="3" className="fill-white stroke-none" />
          <path d="M12 7a5 5 0 0 1 5 5m-10 0a5 5 0 0 1 5-5" className="stroke-white stroke-[2.5]" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-lg font-black tracking-tight text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            Synapse
          </span>
          <span className="text-[10px] font-bold tracking-wide text-indigo-500/80 dark:text-indigo-400/80 mt-0.5">
            Study smarter. Master faster.
          </span>
        </div>
      )}
    </Link>
  );
}
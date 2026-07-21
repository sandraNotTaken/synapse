import Link from "next/link";

interface LogoProps {
  showText?: boolean;
}

export default function Logo({ showText = true }: LogoProps) {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5 transition-opacity hover:opacity-90"
    >
      {/* Sleek Minimalist Neural Mark */}
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-transform duration-200 group-hover:scale-105">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 text-white"
        >
          {/* Elegant S-Curve Synaptic Node */}
          <path d="M7 17A5 5 0 0 1 12 7h5" />
          <path d="M17 7a5 5 0 0 1-5 10H7" />
          <circle cx="12" cy="12" r="2" className="fill-white stroke-none" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-base font-bold tracking-tight text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            Synapse
          </span>
          <span className="text-[10px] font-semibold text-muted-foreground mt-0.5">
            Study smarter. Master faster.
          </span>
        </div>
      )}
    </Link>
  );
}
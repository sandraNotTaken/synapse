import Link from "next/link";
import { BrainCircuit } from "lucide-react";

interface LogoProps {
  showText?: boolean;
}

export default function Logo({ showText = true }: LogoProps) {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 transition-opacity hover:opacity-80"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 shadow-md shadow-indigo-500/15">
        <BrainCircuit className="h-6 w-6 text-white" />
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-lg font-bold tracking-tight">
            Synapse
          </span>

          <span className="text-xs text-muted-foreground">
            Learn Smarter
          </span>
        </div>
      )}
    </Link>
  );
}
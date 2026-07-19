"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-10 w-full rounded-2xl bg-muted/20 animate-pulse" />;
  }

  return (
    <div className="flex rounded-2xl bg-muted/50 p-1 border border-border w-full max-w-[320px]">
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-sm font-semibold transition cursor-pointer ${
          theme === "light"
            ? "bg-card text-indigo-600 dark:text-indigo-400 shadow-[0_4px_12px_rgba(99,102,241,0.08)] border border-border"
            : "text-muted-foreground hover:text-foreground border border-transparent"
        }`}
      >
        <Sun className="h-4 w-4" />
        Light
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-sm font-semibold transition cursor-pointer ${
          theme === "dark"
            ? "bg-card text-indigo-400 shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-border"
            : "text-muted-foreground hover:text-foreground border border-transparent"
        }`}
      >
        <Moon className="h-4 w-4" />
        Dark
      </button>
    </div>
  );
}

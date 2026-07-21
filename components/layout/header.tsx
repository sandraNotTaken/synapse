"use client";

import { useState } from "react";
import { PanelLeftClose, PanelLeft, User, Search, Command } from "lucide-react";
import NotificationCenter from "./notification-center";
import InstallPWAButton from "./install-pwa-button";
import PomodoroTimer from "@/components/dashboard/pomodoro-timer";
import CommandPalette from "@/components/dashboard/command-palette";

interface HeaderProps {
  collapsed: boolean;
  onToggleSidebar: () => void;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function Header({ collapsed, onToggleSidebar, user }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 right-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/50 px-6 backdrop-blur-md transition-all duration-300 left-0 xl:left-72 data-[collapsed=true]:xl:left-20" data-collapsed={collapsed}>
        <div className="flex items-center gap-4">
          {/* Toggle Button */}
          <button
            type="button"
            onClick={onToggleSidebar}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-border bg-card/60 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeft className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </button>

          {/* Quick Search Bar Trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden sm:flex items-center gap-3 rounded-xl border border-border bg-card/60 px-3.5 py-2 text-xs text-muted-foreground hover:border-indigo-500/40 hover:text-foreground transition cursor-pointer"
          >
            <Search className="h-3.5 w-3.5 text-indigo-500" />
            <span>Search courses, notes, flashcards...</span>
            <kbd className="flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[9px] font-mono font-bold text-muted-foreground">
              <Command className="h-2.5 w-2.5" /> K
            </kbd>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Pomodoro Focus Timer */}
          <PomodoroTimer />

          {/* Install PWA Button */}
          <InstallPWAButton />

          {/* Notifications */}
          <NotificationCenter />

          {/* User avatar / profile summary */}
          {user && (
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card/60 pl-3 pr-4 py-1.5">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User Avatar"}
                  className="h-7 w-7 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20">
                  <User className="h-4 w-4" />
                </div>
              )}
              <div className="hidden sm:flex flex-col text-left leading-none">
                <span className="text-xs font-semibold text-foreground">
                  {user.name || "User"}
                </span>
                <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                  {user.email}
                </span>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Global Command Palette Overlay */}
      <CommandPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

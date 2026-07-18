"use client";

import { PanelLeftClose, PanelLeft, Bell, User } from "lucide-react";

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
  return (
    <header className="fixed top-0 right-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-[#05070d]/50 px-6 backdrop-blur-md transition-all duration-300 left-0 xl:left-72 data-[collapsed=true]:xl:left-20" data-collapsed={collapsed}>
      <div className="flex items-center gap-4">
        {/* Toggle Button */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeft className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          type="button"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>

        {/* User avatar / profile summary */}
        {user && (
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 pl-3 pr-4 py-1.5">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "User Avatar"}
                className="h-7 w-7 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300">
                <User className="h-4 w-4" />
              </div>
            )}
            <div className="hidden sm:flex flex-col text-left leading-none">
              <span className="text-xs font-semibold text-white">
                {user.name || "User"}
              </span>
              <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                {user.email}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

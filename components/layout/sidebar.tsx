"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  House,
  BookOpen,
  Layers3,
  BrainCircuit,
  Settings,
  Menu,
  X,
} from "lucide-react";

import Logo from "@/components/branding/logo";

const links = [
  { title: "Home", href: "/dashboard", icon: House },
  { title: "Courses", href: "/dashboard/courses", icon: BookOpen },
  { title: "Study", href: "/dashboard/study", icon: BrainCircuit },
  { title: "Decks", href: "/dashboard/decks", icon: Layers3 },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContent = (
    <>
      <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">
          Focus mode
        </p>
        <p className="mt-2 text-sm font-semibold text-white">
          Deep study, zero clutter.
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-2 pb-6">
        {links.map((link) => {
          const Icon = link.icon;
          const active =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                active
                  ? "bg-gradient-to-r from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/20"
                  : "text-slate-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{link.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-indigo-600 via-violet-500 to-cyan-500 p-5">
        <p className="text-sm text-white/80">Daily goal</p>
        <h3 className="mt-2 text-3xl font-semibold">45 min</h3>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20">
          <div className="h-full w-[65%] rounded-full bg-white" />
        </div>
        <p className="mt-3 text-sm text-white/80">29 minutes completed</p>
      </div>
    </>
  );

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setMobileOpen(true)}
        className="fixed right-2 top-0 z-50 flex h-10 w-10 items-center cursor-pointer justify-center bg-transparent text-gray xl:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity cursor-pointer duration-300 xl:hidden ${mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setMobileOpen(false)}
      />

      <aside className="hidden h-screen w-72 flex-col overflow-hidden border-r border-white/10 bg-[#06070b]/95 px-4 py-6 backdrop-blur xl:flex">
        <div className="px-4 pb-6">
          <Logo />
        </div>
        <div className="flex-1 overflow-hidden">{navContent}</div>
      </aside>

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-72 max-w-[85vw] flex-col overflow-hidden border-r border-white/10 bg-[#06070b]/95 p-6 backdrop-blur transition-transform duration-300 xl:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="mb-6 flex items-center justify-between">
          <Logo />
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-hidden">{navContent}</div>
      </aside>
    </>
  );
}
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  House,
  BookOpen,
  Layers3,
  BrainCircuit,
  Settings,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

import Logo from "@/components/branding/logo";

const links = [
  {
    title: "Home",
    href: "/dashboard",
    icon: House,
  },
  {
    title: "Courses",
    href: "/dashboard/courses",
    icon: BookOpen,
  },
  {
    title: "Study",
    href: "/dashboard/study",
    icon: BrainCircuit,
  },
  {
    title: "Decks",
    href: "/dashboard/decks",
    icon: Layers3,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

interface Topic {
  id: string;
  title: string;
  courseId: string;
}

interface Course {
  id: string;
  title: string;
  color: string;
  topics: Topic[];
}

interface SidebarProps {
  courses?: Course[];
}

export default function Sidebar({ courses }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coursesExpanded, setCoursesExpanded] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (pathname.startsWith("/dashboard/courses") || pathname.startsWith("/dashboard/topics")) {
      setCoursesExpanded(true);
    }
  }, [pathname]);

  const navContent = (
    <>
      <div className="mb-6 rounded-2xl border border-white/5 bg-[#0b0e14]/40 p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
            Focus mode active
          </p>
        </div>
        <p className="mt-2 text-xs text-slate-400 leading-relaxed">
          Deep study space with zero clutter.
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-2 pb-6">
        {links.map((link) => {
          const Icon = link.icon;
          
          let active = false;
          if (link.href === "/dashboard") {
            active = pathname === "/dashboard";
          } else if (link.href === "/dashboard/courses") {
            active =
              pathname === "/dashboard/courses" ||
              pathname.startsWith("/dashboard/courses/") ||
              pathname.startsWith("/dashboard/topics/");
          } else {
            active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
          }

          return (
            <div key={link.href} className="space-y-1">
              <div className="flex items-center justify-between gap-1 group">
                <Link
                  href={link.href}
                  className={`flex flex-1 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                    active
                      ? "bg-gradient-to-r from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/20"
                      : "text-slate-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  <span>{link.title}</span>
                </Link>

                {link.href === "/dashboard/courses" && courses && courses.length > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCoursesExpanded(!coursesExpanded);
                    }}
                    className={`mr-1 rounded-xl p-2 transition cursor-pointer ${
                      active
                        ? "text-white/70 hover:bg-white/10 hover:text-white"
                        : "text-slate-400 hover:bg-white/10 hover:text-white"
                    }`}
                    aria-label="Toggle courses list"
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-300 ${
                        coursesExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}
              </div>

              {/* Render Course hierarchy if link is Courses and active or we want it visible */}
              {link.href === "/dashboard/courses" && coursesExpanded && mounted && courses && courses.length > 0 && (
                <div className="ml-6 mt-2 space-y-3 border-l border-white/5 pl-4 py-1">
                  {courses.map((course) => {
                    const isCourseActive = pathname === `/dashboard/courses/${course.id}`;
                    return (
                      <div key={course.id} className="space-y-1">
                        <Link
                          href={`/dashboard/courses/${course.id}`}
                          className={`flex items-center gap-2 text-xs font-semibold transition ${
                            isCourseActive ? "text-white" : "text-slate-400 hover:text-white"
                          }`}
                        >
                          <span
                            className="h-2 w-2 rounded-full shrink-0"
                            style={{ backgroundColor: course.color }}
                          />
                          <span className="truncate">{course.title}</span>
                        </Link>

                        {/* Render nested topics */}
                        {course.topics && course.topics.length > 0 && (
                          <div className="ml-4 space-y-1.5 pt-1">
                            {course.topics.map((topic) => {
                              const isTopicActive = pathname === `/dashboard/topics/${topic.id}`;
                              return (
                                <Link
                                  key={topic.id}
                                  href={`/dashboard/topics/${topic.id}`}
                                  className={`block truncate pl-2 text-[11px] transition ${
                                    isTopicActive
                                      ? "text-indigo-400 border-l border-indigo-500 font-medium"
                                      : "text-slate-500 hover:text-slate-300 border-l border-transparent"
                                  }`}
                                >
                                  {topic.title}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.15),_transparent_60%),linear-gradient(135deg,_#0f172a/70,_#020617/90)] p-5 shadow-[0_20px_50px_-25px_rgba(79,70,229,0.3)]">
        <p className="text-xs uppercase tracking-wider text-indigo-300">Daily goal</p>
        <h3 className="mt-2 text-3xl font-bold text-white">45 min</h3>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
        </div>
        <p className="mt-3 text-xs text-slate-400">29 minutes completed</p>
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

      <aside className="fixed left-0 top-0 hidden h-screen w-72 flex-col border-r border-white/10 bg-[#06070b]/95 px-4 py-6 backdrop-blur xl:flex">
        <div className="px-4 pb-6">
          <Logo />
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar">{navContent}</div>
      </aside>

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 max-w-[85vw] flex-col border-r border-white/10 bg-[#06070b]/95 p-6 backdrop-blur transition-transform duration-300 xl:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
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
        <div className="flex-1 overflow-y-auto no-scrollbar">{navContent}</div>
      </aside>
    </>
  );
}
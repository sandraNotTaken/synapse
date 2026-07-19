"use client";

import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import ShortcutsModal from "@/components/dashboard/shortcuts-modal";

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

export default function DashboardClientLayout({
  children,
  courses,
  user,
  dailyGoal = 45,
  studyMinutesToday = 0,
}: {
  children: ReactNode;
  courses: Course[];
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  dailyGoal?: number;
  studyMinutesToday?: number;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  // Listen for navigation shortcuts (e.g. g + d)
  useEffect(() => {
    let lastKey = "";
    let lastKeyTime = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable ||
        target.closest("[contenteditable='true']");

      if (isInput) return;

      const enabled = localStorage.getItem("synapse_shortcuts_enabled") !== "false";
      if (!enabled) return;

      const now = Date.now();
      const key = e.key.toLowerCase();

      if (lastKey === "g" && now - lastKeyTime < 1000) {
        const paths: Record<string, string> = {
          d: "/dashboard",
          s: "/dashboard/study",
          c: "/dashboard/courses",
          k: "/dashboard/decks",
          ",": "/dashboard/settings",
        };

        if (paths[key]) {
          e.preventDefault();
          router.push(paths[key]);
          lastKey = "";
          return;
        }
      }

      lastKey = key;
      lastKeyTime = now;
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  const handleToggleSidebar = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1280) {
      setMobileOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <ShortcutsModal />
        {/* Sidebar */}
        <Sidebar
          courses={courses}
          collapsed={sidebarCollapsed}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
          dailyGoal={dailyGoal}
          studyMinutesToday={studyMinutesToday}
        />

        {/* Content Wrapper */}
        <div className="flex-1 flex flex-col min-h-screen min-w-0">
          {/* Header */}
          <Header
            collapsed={sidebarCollapsed}
            onToggleSidebar={handleToggleSidebar}
            user={user}
          />

          {/* Main Workspace content */}
          <main
            className="flex-1 overflow-y-auto px-6 pb-12 pt-24 sm:px-8 lg:px-10 transition-all duration-300 xl:ml-72 data-[collapsed=true]:xl:ml-20"
            data-collapsed={sidebarCollapsed}
          >
            <div className="mx-auto max-w-5xl space-y-8">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

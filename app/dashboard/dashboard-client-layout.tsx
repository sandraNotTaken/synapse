"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

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
}: {
  children: ReactNode;
  courses: Course[];
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggleSidebar = () => {
    // If screen size is mobile/tablet, toggle the sliding drawer
    if (typeof window !== "undefined" && window.innerWidth < 1280) {
      setMobileOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        {/* Sidebar */}
        <Sidebar
          courses={courses}
          collapsed={sidebarCollapsed}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
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

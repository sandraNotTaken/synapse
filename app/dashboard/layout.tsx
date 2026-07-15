import type { ReactNode } from "react";

import Sidebar from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <Sidebar />

        <main className="flex-1 xl:ml-72 overflow-y-auto px-6 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-5xl space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
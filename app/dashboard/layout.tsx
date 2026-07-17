import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { ReactNode } from "react";
import Sidebar from "@/components/layout/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  let courses: any[] = [];
  if (session?.user?.email) {
    courses = await prisma.course.findMany({
      where: {
        user: {
          email: session.user.email,
        },
      },
      include: {
        topics: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  return (
    <div className="min-h-screen bg-[#05070d] text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <Sidebar courses={courses} />

        <main className="flex-1 xl:ml-72 overflow-y-auto px-6 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-5xl space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
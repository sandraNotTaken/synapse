import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { ReactNode } from "react";
import DashboardClientLayout from "./dashboard-client-layout";

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

  // Pass user session as a plain serializable object to the client component
  const user = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }
    : undefined;

  return (
    <DashboardClientLayout courses={courses} user={user}>
      {children}
    </DashboardClientLayout>
  );
}
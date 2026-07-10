import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const course = await prisma.course.findUnique({
    where: { id },
  });

  if (!course) {
    notFound();
  }

  return (
    <main>
      <h1 className="text-4xl font-bold">
        {course.title}
      </h1>
    </main>
  );
}
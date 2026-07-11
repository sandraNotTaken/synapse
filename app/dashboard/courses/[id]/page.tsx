import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CreateCourseDialog } from "@/components/courses/create-course-dialog";

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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Courses</h1>

        <CreateCourseDialog />
      </div>
    </main>
  );
}
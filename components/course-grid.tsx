import Link from "next/link";

export default function CourseGrid({
  courses,
}: {
  courses: {
    id: string;
    title: string;
    color: string;
  }[];
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {courses.map((course) => (
        <Link
          key={course.id}
          href={`/dashboard/courses/${course.id}`}
          className="rounded-xl border p-6 hover:shadow-lg transition"
        >
          <div
            className="mb-4 h-2 rounded"
            style={{ backgroundColor: course.color }}
          />

          <h2 className="font-semibold text-lg">
            {course.title}
          </h2>
        </Link>
      ))}
    </div>
  );
}
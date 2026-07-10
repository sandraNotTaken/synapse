import { Card, CardContent } from "@/components/ui/card";

interface RecentCoursesProps {
  courses: {
    id: string;
    title: string;
    color: string;
  }[];
}

export default function RecentCourses({
    courses,
}: RecentCoursesProps) {
    
    {courses.length === 0 ? (
  <p className="text-muted-foreground">
    No courses yet.
  </p>
) : (
  <div className="space-y-3">
    {courses.map((course) => (
      <div
        key={course.id}
        className="rounded-lg border p-4"
      >
        <div
          className="mb-2 h-2 rounded"
          style={{ backgroundColor: course.color }}
        />

        <p className="font-medium">{course.title}</p>
      </div>
    ))}
  </div>
)}
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="mb-4 text-xl font-semibold">
          Recent Courses
        </h2>

        <p className="text-muted-foreground">
          No courses yet.
        </p>
      </CardContent>
    </Card>
  );
}
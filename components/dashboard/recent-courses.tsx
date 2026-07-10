import { Card, CardContent } from "@/components/ui/card";

export default function RecentCourses() {
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
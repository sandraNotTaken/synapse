import { createCourse } from "@/app/actions/course";

export default function CourseForm() {
  return (
    <form action={createCourse} className="space-y-4">
      <input
        name="title"
        placeholder="Course name..."
        className="w-full rounded-lg border p-3"
      />

      <button
        type="submit"
        className="rounded-lg bg-black px-5 py-2 text-white"
      >
        Create Course
      </button>
    </form>
  );
}
import CourseCard from "./course-card";

const courses = [
  {
    title: "Computer Engineering",
    topics: 18,
    progress: 72,
  },
  {
    title: "Artificial Intelligence",
    topics: 11,
    progress: 41,
  },
  {
    title: "Signals & Systems",
    topics: 15,
    progress: 58,
  },
  {
    title: "Control Systems",
    topics: 9,
    progress: 21,
  },
];

export default function CourseCarousel() {
  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.35em] text-indigo-300/80">
            Continue watching
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Your courses
          </h2>
        </div>

        <a href="/dashboard/courses" className="text-sm font-medium text-slate-400 transition hover:text-white">
          Browse all
        </a>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {courses.map((course) => (
          <CourseCard key={course.title} {...course} />
        ))}
      </div>
    </section>
  );
}
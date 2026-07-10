import {
  BookOpen,
  FolderOpen,
  Brain,
  Flame,
} from "lucide-react";

import { StatsCard } from "./stats-card";

interface StatsGridProps {
  totalCourses: number;
  totalTopics: number;
  reviewsToday: number;
  streak: number;
}

export function StatsGrid({
    totalCourses,
    totalTopics,
    reviewsToday,
    streak,
}: StatsGridProps)
 {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Courses"
        value={totalCourses}
        icon={<BookOpen className="h-8 w-8 text-blue-500" />}
      />

      <StatsCard
        title="Topics"
        value={totalTopics}
        icon={<FolderOpen className="h-8 w-8 text-green-500" />}
      />

      <StatsCard
        title="Reviews Today"
        value={reviewsToday}
        icon={<Brain className="h-8 w-8 text-purple-500" />}
      />

      <StatsCard
        title="Streak"
        value={streak}
        icon={<Flame className="h-8 w-8 text-orange-500" />}
      />
    </div>
  );
}
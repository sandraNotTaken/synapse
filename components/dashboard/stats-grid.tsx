import {
  BookOpen,
  FolderOpen,
  Brain,
  Flame,
} from "lucide-react";

import { StatsCard } from "./stats-card";

export function StatsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Courses"
        value={0}
        icon={<BookOpen className="h-8 w-8 text-blue-500" />}
      />

      <StatsCard
        title="Topics"
        value={0}
        icon={<FolderOpen className="h-8 w-8 text-green-500" />}
      />

      <StatsCard
        title="Reviews Today"
        value={0}
        icon={<Brain className="h-8 w-8 text-purple-500" />}
      />

      <StatsCard
        title="Streak"
        value={0}
        icon={<Flame className="h-8 w-8 text-orange-500" />}
      />
    </div>
  );
}
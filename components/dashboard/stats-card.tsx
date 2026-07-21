import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
}

export function StatsCard({
  title,
  value,
  icon,
}: StatsCardProps) {
  return (
    <Card className="border-border bg-card/60 shadow-sm transition hover:shadow-md">
      <CardContent className="flex items-center justify-between p-5">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">{value}</h2>
        </div>

        <div className="rounded-xl border border-border bg-muted/60 p-3 text-indigo-500 dark:text-indigo-400 shrink-0">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
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
    <Card className="border-border bg-card/60 shadow-md">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h2 className="mt-2 text-2xl font-bold text-foreground">{value}</h2>
        </div>

        <div className="rounded-2xl border border-border bg-muted/60 p-3 text-indigo-500 dark:text-indigo-400">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
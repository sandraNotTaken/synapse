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
    <Card className="border-white/10 bg-white/5 shadow-[0_20px_50px_-25px_rgba(15,23,42,0.7)]">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">{value}</h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
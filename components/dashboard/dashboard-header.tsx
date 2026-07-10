interface DashboardHeaderProps {
  name?: string | null;
}

export function DashboardHeader({
  name,
}: DashboardHeaderProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-4xl font-bold">
        Welcome back{name ? `, ${name}` : ""} 👋
      </h1>

      <p className="text-muted-foreground">
        Ready to study today?
      </p>
    </div>
  );
}
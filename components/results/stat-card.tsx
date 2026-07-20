import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  accent?: boolean;
  className?: string;
}

export function StatCard({ icon: Icon, label, value, accent, className }: StatCardProps) {
  return (
    <Card className={cn("p-5", className)}>
      <div className="mb-3 flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <p
        className={cn(
          "font-display text-3xl font-semibold tabular-nums",
          accent && "text-accent",
        )}
      >
        {value}
      </p>
    </Card>
  );
}

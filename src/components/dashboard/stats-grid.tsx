import { StatsCard } from "./stats-card";
import type { StatsCardConfig } from "@/types/dashboard";

interface StatsGridProps {
  stats: StatsCardConfig[];
  className?: string;
}

export function StatsGrid({ stats, className = "" }: StatsGridProps) {
  return (
    <div className={`grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${className}`}>
      {stats.map((stat, index) => (
        <StatsCard
          key={`${stat.title}-${index}`}
          {...stat}
        />
      ))}
    </div>
  );
} 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  valuePrefix?: string;
  valueSuffix?: string;
  formatValue?: (value: number) => string;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-cyan",
  valuePrefix = "",
  valueSuffix = "",
  formatValue,
}: StatsCardProps) {
  const displayValue = typeof value === "number" && formatValue 
    ? formatValue(value) 
    : value;

  return (
    <Card className="border-border hover:border-cyan/50 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">
          {valuePrefix}{displayValue}{valueSuffix}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
} 
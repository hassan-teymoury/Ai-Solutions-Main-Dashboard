import { Badge } from "@/components/ui/badge";

interface PriorityBreakdownProps {
  priorityBreakdown: Record<string, number>;
}

export const getPriorityIcon = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "high":
      return "🔴";
    case "medium":
      return "🟡";
    case "low":
      return "🟢";
    default:
      return "⚪";
  }
};

export function FollowUpsPriorityBreakdown({
  priorityBreakdown,
}: PriorityBreakdownProps) {
  if (Object.keys(priorityBreakdown).length === 0) {
    return null;
  }

  return (
    <div className="mb-6 p-4 bg-muted/50 rounded-lg">
      <h3 className="font-medium mb-3">Priority Breakdown</h3>
      <div className="flex gap-4">
        {Object.entries(priorityBreakdown).map(([priority, count]) => (
          <div key={priority} className="flex items-center gap-2">
            <span>{getPriorityIcon(priority)}</span>
            <span className="text-sm font-medium capitalize">{priority}</span>
            <Badge variant="secondary">{count}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

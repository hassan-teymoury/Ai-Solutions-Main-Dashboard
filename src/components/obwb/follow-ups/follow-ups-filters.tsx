import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FollowUpsFiltersProps {
  priority: "low" | "medium" | "high";
  pageSize: number;
  onPriorityChange: (priority: "low" | "medium" | "high") => void;
  onPageSizeChange: (pageSize: string) => void;
}

export function FollowUpsFilters({
  priority,
  pageSize,
  onPriorityChange,
  onPageSizeChange,
}: FollowUpsFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <Select value={priority} onValueChange={onPriorityChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="high">High Priority</SelectItem>
          <SelectItem value="medium">Medium Priority</SelectItem>
          <SelectItem value="low">Low Priority</SelectItem>
        </SelectContent>
      </Select>
      <Select value={String(pageSize)} onValueChange={onPageSizeChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Page size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="5">5 per page</SelectItem>
          <SelectItem value="10">10 per page</SelectItem>
          <SelectItem value="20">20 per page</SelectItem>
          <SelectItem value="50">50 per page</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

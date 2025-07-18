import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Sparkles } from "lucide-react";
import { DigestType } from "@/types/AIServices";

interface DigestControlsProps {
  digestType: DigestType;
  dateRange: string;
  onDigestTypeChange: (value: DigestType) => void;
  onDateRangeChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function DigestControls({
  digestType,
  dateRange,
  onDigestTypeChange,
  onDateRangeChange,
  onGenerate,
  isGenerating,
}: DigestControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <Select value={digestType} onValueChange={onDigestTypeChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Digest type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="daily">Daily</SelectItem>
          <SelectItem value="real_time">Real-time</SelectItem>
        </SelectContent>
      </Select>
      <Select value={dateRange} onValueChange={onDateRangeChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Date range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="yesterday">Yesterday</SelectItem>
          <SelectItem value="this_week">This Week</SelectItem>
          <SelectItem value="last_week">Last Week</SelectItem>
          <SelectItem value="this_month">This Month</SelectItem>
        </SelectContent>
      </Select>
      <Button
        onClick={onGenerate}
        disabled={isGenerating}
        className="flex items-center gap-2"
      >
        {isGenerating ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        Generate Digest
      </Button>
    </div>
  );
}

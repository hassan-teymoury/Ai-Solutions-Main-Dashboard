import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface ConversationDetailHeaderProps {
  pageSize: number;
  onPageSizeChange: (newPageSize: string) => void;
}

export function ConversationDetailHeader({
  pageSize,
  onPageSizeChange,
}: ConversationDetailHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Conversations
      </Button>
      <div className="flex items-center gap-2">
        <Select value={String(pageSize)} onValueChange={onPageSizeChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Page size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="25">25 per page</SelectItem>
            <SelectItem value="50">50 per page</SelectItem>
            <SelectItem value="100">100 per page</SelectItem>
            <SelectItem value="200">200 per page</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 
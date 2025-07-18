import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface ActionItem {
  description: string;
  deadline: string;
  priority: string;
  conversation_id: string;
}

interface DigestActionItemsProps {
  actionItems: ActionItem[];
}

export function DigestActionItems({ actionItems }: DigestActionItemsProps) {
  const router = useRouter();

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <CheckCircle className="h-5 w-5" />
        Action Items
      </h3>
      <div className="space-y-3">
        {actionItems.map((item, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg bg-muted/50 relative"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="text-xs">
                {item.priority} Priority
              </Badge>
              <span className="text-xs text-muted-foreground">
                Due: {new Date(item.deadline).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {item.description}
            </p>
            <div className="absolute bottom-3 right-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  router.push(
                    `/dashboard/conversations/${item.conversation_id}`
                  )
                }
                className="text-xs"
              >
                View Conversation
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";

interface ConversationSummary {
  conversation_id: string;
  subject: string;
  summary: string;
  participants: string[];
  created_at?: string;
}

interface DigestConversationSummariesProps {
  conversationSummaries: ConversationSummary[];
}

export function DigestConversationSummaries({
  conversationSummaries,
}: DigestConversationSummariesProps) {
  const router = useRouter();

  if (conversationSummaries.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        Conversation Summaries
      </h3>
      <div className="space-y-3">
        {conversationSummaries.map((conversation, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg bg-muted/50 relative"
          >
            <h4 className="font-medium mb-1">{conversation.subject}</h4>
            <p className="text-sm text-muted-foreground mb-2">
              {conversation.summary}
            </p>
            <div className="text-xs text-muted-foreground mb-4">
              Participants: {conversation.participants.join(", ")}
            </div>
            <div className="absolute bottom-3 right-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  router.push(
                    `/dashboard/conversations/${conversation.conversation_id}`
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

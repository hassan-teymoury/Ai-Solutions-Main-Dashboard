import { MessageSquare } from "lucide-react";

export function ConversationEmpty() {
  return (
    <div className="text-center py-8">
      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Conversations Found</h3>
      <p className="text-muted-foreground">
        No conversations have been synced yet. Please wait for the sync to complete.
      </p>
    </div>
  );
} 
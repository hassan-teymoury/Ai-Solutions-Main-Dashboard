import { RefreshCw } from "lucide-react";

export function ConversationLoading() {
  return (
    <div className="container mx-auto p-6">
      <div className="text-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Loading conversations...</p>
      </div>
    </div>
  );
}

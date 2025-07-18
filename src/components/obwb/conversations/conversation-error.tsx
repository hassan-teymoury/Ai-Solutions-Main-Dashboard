import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ConversationErrorProps {
  error?: Error | null;
  onRetry: () => void;
}

export function ConversationError({ error, onRetry }: ConversationErrorProps) {
  return (
    <div className="container mx-auto p-6">
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Error Loading Conversations</h3>
        <p className="text-muted-foreground mb-4">
          {error?.message || "Failed to load conversations. Please try again."}
        </p>
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    </div>
  );
} 
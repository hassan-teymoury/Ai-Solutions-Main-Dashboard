import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

interface ConversationAIToggleProps {
  showAI: boolean;
  onToggle: () => void;
}

export function ConversationAIToggle({
  showAI,
  onToggle,
}: ConversationAIToggleProps) {
  return (
    <div className="flex justify-end">
      <Button onClick={onToggle} className="flex items-center gap-2">
        <Bot className="h-4 w-4" />
        {showAI ? "Hide AI Analysis" : "Show AI Analysis"}
      </Button>
    </div>
  );
}

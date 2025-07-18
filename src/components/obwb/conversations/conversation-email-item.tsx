import { cn } from "@/lib/utils";
import { Email } from "@/types/emails";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface ConversationEmailItemProps {
  email: Email;
}

export function ConversationEmailItem({ email }: ConversationEmailItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={cn(
        "p-4 border rounded-lg transition-colors",
        email.is_read
          ? "border-border bg-background"
          : "border-primary/20 bg-primary/5"
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleExpanded}
              className="p-1 hover:bg-muted rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            <h4 className="font-medium text-foreground">
              {email.subject || "No Subject"}
            </h4>
          </div>
          <p className="text-sm text-muted-foreground">
            From: {email.sender_name} ({email.sender_email})
          </p>
          <p className="text-sm text-muted-foreground">
            To: {email.recipient_name} ({email.recipient_email})
          </p>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <div>
            {new Date(email.received_date).toLocaleDateString()}
          </div>
          <div>
            {new Date(email.received_date).toLocaleTimeString()}
          </div>
        </div>
      </div>
      
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <p className="text-sm text-muted-foreground mb-2">{email.body}</p>
      </div>
      
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {!email.is_read && (
          <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full">
            Unread
          </span>
        )}
        {email.has_attachments && (
          <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
            Has Attachments
          </span>
        )}
      </div>
    </div>
  );
} 
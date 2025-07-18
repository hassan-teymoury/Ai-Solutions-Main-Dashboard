import { AlertTriangle } from "lucide-react";
import { FollowUpsEmailItem } from "./follow-ups-email-item";

interface FollowUpEmail {
  email_id: string;
  conversation_id: string;
  subject: string;
  sender_name: string;
  sender_email: string;
  priority: string;
  days_since_received: number;
  urgency_reason: string;
  suggested_action: string;
  deadline?: string;
}

interface FollowUpsEmailListProps {
  emails: FollowUpEmail[];
  priority: "low" | "medium" | "high";
}

export function FollowUpsEmailList({
  emails,
  priority,
}: FollowUpsEmailListProps) {
  if (emails.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-4">
          No follow-up required emails found for {priority} priority.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {emails.map((email) => (
        <FollowUpsEmailItem key={email.email_id} email={email} />
      ))}
    </div>
  );
}

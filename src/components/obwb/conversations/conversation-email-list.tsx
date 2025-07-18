import { Email } from "@/types/emails";
import { ConversationEmailItem } from "./conversation-email-item";

interface ConversationEmailListProps {
  emails: Email[];
}

export function ConversationEmailList({ emails }: ConversationEmailListProps) {
  return (
    <div>
      <h3 className="text-sm font-medium mb-4">
        Emails in this conversation
      </h3>
      <div className="space-y-4">
        {emails.map((email) => (
          <ConversationEmailItem key={email.id} email={email} />
        ))}
      </div>
    </div>
  );
} 
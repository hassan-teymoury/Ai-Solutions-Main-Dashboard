import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface PriorityEmail {
  email_id: string;
  subject: string;
  sender: string;
  priority: string;
  reason: string;
}

interface DigestPriorityEmailsProps {
  priorityEmails: PriorityEmail[];
}

export function DigestPriorityEmails({
  priorityEmails,
}: DigestPriorityEmailsProps) {
  const router = useRouter();

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <AlertCircle className="h-5 w-5" />
        Priority Emails
      </h3>
      <div className="space-y-3">
        {priorityEmails.map((email, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg bg-muted/50 relative"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="text-xs">
                {email.priority} Priority
              </Badge>
              <span className="text-xs text-muted-foreground">
                Email ID: {email.email_id.slice(-8)}
              </span>
            </div>
            <h4 className="font-medium mb-1">{email.subject}</h4>
            <p className="text-sm text-muted-foreground mb-2">
              From: {email.sender}
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Reason: {email.reason}
            </p>
            <div className="absolute bottom-3 right-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  router.push(`/dashboard/emails/${email.email_id}`)
                }
                className="text-xs"
              >
                View Email
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

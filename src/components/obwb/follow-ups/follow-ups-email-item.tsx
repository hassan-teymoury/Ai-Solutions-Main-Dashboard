import { Badge } from "@/components/ui/badge";
import { Clock, Mail, Calendar, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { getPriorityIcon } from "./follow-ups-priority-breakdown";

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

interface FollowUpsEmailItemProps {
  email: FollowUpEmail;
}

export function FollowUpsEmailItem({ email }: FollowUpsEmailItemProps) {
  const router = useRouter();

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div
      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
      onClick={() =>
        router.push(`/dashboard/conversations/${email.conversation_id}`)
      }
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="outline"
              className={`text-xs ${getPriorityColor(email.priority)}`}
            >
              {getPriorityIcon(email.priority)} {email.priority} Priority
            </Badge>
            <span className="text-xs text-muted-foreground">
              {email.days_since_received} days ago
            </span>
          </div>
          <h3 className="font-medium text-foreground mb-1">{email.subject}</h3>
          <p className="text-sm text-muted-foreground mb-2">
            From: {email.sender_name} ({email.sender_email})
          </p>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Urgency Reason</p>
                <p className="text-xs text-muted-foreground">
                  {email.urgency_reason}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Suggested Action</p>
                <p className="text-xs text-muted-foreground">
                  {email.suggested_action}
                </p>
              </div>
            </div>
            {email.deadline && (
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Deadline</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(email.deadline).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
}

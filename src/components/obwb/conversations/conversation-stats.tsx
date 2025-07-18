import { Calendar, FileText, Mail, Users } from "lucide-react";
import { ConversationDetailResponse } from "@/types/emails";

interface ConversationStatsProps {
  conversationDetail: ConversationDetailResponse;
}

export function ConversationStats({ conversationDetail }: ConversationStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
        <Mail className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">
            {conversationDetail.total_emails}
          </p>
          <p className="text-xs text-muted-foreground">Total Emails</p>
        </div>
      </div>
      <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
        <Users className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">
            {Object.keys(conversationDetail.participants).length}
          </p>
          <p className="text-xs text-muted-foreground">Participants</p>
        </div>
      </div>
      <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">
            {conversationDetail.conversation_duration_days}
          </p>
          <p className="text-xs text-muted-foreground">Duration (days)</p>
        </div>
      </div>
      <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">
            {new Date(
              conversationDetail.latest_email_date
            ).toLocaleDateString()}
          </p>
          <p className="text-xs text-muted-foreground">Latest Email</p>
        </div>
      </div>
    </div>
  );
} 
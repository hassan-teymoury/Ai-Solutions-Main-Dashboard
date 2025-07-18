import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RelatedEmailsResponse } from "@/types/AIServices";
import { RefreshCw, Mail, TrendingUp, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface ConversationRelatedEmailsProps {
  relatedEmails: RelatedEmailsResponse | undefined;
  isLoading: boolean;
  onRefresh: () => void;
}

export function ConversationRelatedEmails({
  relatedEmails,
  isLoading,
  onRefresh,
}: ConversationRelatedEmailsProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Related Emails
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground mr-2" />
            <p className="text-sm text-muted-foreground">
              Loading related emails...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!relatedEmails || relatedEmails.related_emails.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Related Emails
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Mail className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              No related emails found for this conversation.
            </p>
            <Button onClick={onRefresh} variant="outline">
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Related Emails ({relatedEmails.total_count})
          </CardTitle>
          <Button onClick={onRefresh} variant="outline" size="sm">
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {relatedEmails.related_emails.map((email) => (
            <div
              key={email.email_id}
              className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() =>
                router.push(`/dashboard/conversations/${email.conversation_id}`)
              }
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {Math.round(email.relevance_score * 100)}% Relevant
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(email.received_date).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-medium text-foreground mb-1">
                    {email.subject}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    From: {email.sender_name} ({email.sender_email})
                  </p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium">Relevance Reason</p>
                      <p className="text-xs text-muted-foreground">
                        {email.relevance_reason}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Summary</p>
                      <p className="text-xs text-muted-foreground">
                        {email.summary}
                      </p>
                    </div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 
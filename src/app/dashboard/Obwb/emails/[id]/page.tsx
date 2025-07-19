"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { emailAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ArrowLeft,
  Clock,
  Mail,
  Paperclip,
  RefreshCw,
  User,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function EmailDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getUserByService } = useAuthStore();
  const user = getUserByService('obwb')
  const emailId = params?.id as string;
  const queryClient = useQueryClient();

  const {
    data: email,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["email", emailId],
    queryFn: () =>
      emailAPI.getEmailDetail(user?.id?.toString() || "", emailId),
    enabled: !!emailId,
  });

  useEffect(() => {
    if (email && !email.is_read && user?.microsoft_user_id && emailId) {
      emailAPI.markEmailAsRead(user.id.toString(), emailId)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["emails", user.microsoft_user_id], exact: false });
        })
        .catch(() => {});
    }
  }, [email, user?.microsoft_user_id, emailId, queryClient]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">Loading email...</p>
      </div>
    );
  }

  if (isError || !email) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <span className="text-destructive mb-4">Failed to load email.</span>
        <Button variant="outline" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-2">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          className="mb-4 transition hover:bg-cyan/10 focus:bg-cyan/20"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <Card className="shadow-xl border border-border">
          <CardHeader className="pb-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Mail className="h-6 w-6 dark:text-cyan shrink-0" />
                <span className="text-xl md:text-2xl font-bold leading-tight">
                  {email.subject || "(No Subject)"}
                </span>
                {email.importance === "high" && (
                  <Badge variant="destructive">High</Badge>
                )}
                {email.importance === "low" && (
                  <Badge variant="secondary">Low</Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-4 w-4" />
                {format(
                  new Date(email.received_at),
                  "MMM dd, yyyy 'at' HH:mm"
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {/* Email meta info */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-4">
                <div className="flex items-center gap-2 min-w-0">
                  <User className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-medium truncate">
                      {email.sender_name || email.sender_email}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {email.sender_email}
                    </span>
                  </div>
                </div>
              </div>
              {/* Attachments */}
              {email.has_attachments && (
                <div className="flex items-center gap-2 text-sm mb-2">
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="outline">Attachment</Badge>
                </div>
              )}
              {/* Email body */}
              <div className="whitespace-pre-wrap bg-background rounded-md p-4 border prose max-w-none break-words">
                {email.body ? email.body : email.body_preview}
              </div>
              {/* Actions */}
              <div className="flex justify-end mt-2">
                <Button
                  variant="outline"
                  className="rounded-full px-6"
                  disabled
                >
                  Reply
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

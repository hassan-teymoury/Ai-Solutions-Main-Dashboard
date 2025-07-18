"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store";
import { AIServices } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw, AlertCircle } from "lucide-react";
import { DigestType } from "@/types/AIServices";
import { toast } from "sonner";
import {
  DigestControls,
  DigestSummary,
  DigestInsights,
  DigestActionItems,
  DigestPriorityEmails,
  DigestConversationSummaries,
  DigestMetadata,
} from "@/components/obwb/ai-digest";

export default function AIDigestPage() {
  const { getUserByService } = useAuthStore();
  const user = getUserByService('obwb')
  const queryClient = useQueryClient();
  const microsoftUserId = user?.microsoft_user_id;
  const [digestType, setDigestType] = useState<DigestType>("daily");
  const [dateRange, setDateRange] = useState("today");

  const generateDigestMutation = useMutation({
    mutationFn: () =>
      AIServices.generateDigest(microsoftUserId!, digestType, dateRange),
    onSuccess: () => {
      toast.success("AI Digest generated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["ai-digest", microsoftUserId],
      });
    },
    onError: () => {
      toast.error("Failed to generate AI Digest");
    },
  });

  const {
    data: digest,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["ai-digest", microsoftUserId, digestType, dateRange],
    queryFn: () =>
      AIServices.generateDigest(microsoftUserId!, digestType, dateRange),
    enabled: !!microsoftUserId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const handleGenerateDigest = () => {
    generateDigestMutation.mutate();
  };

  if (!microsoftUserId) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              AI Digest
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Please connect your email account to generate AI digests.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-0 md:p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-6 items-start md:flex-row md:items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              AI Digest
            </CardTitle>
            <DigestControls
              digestType={digestType}
              dateRange={dateRange}
              onDigestTypeChange={setDigestType}
              onDateRangeChange={setDateRange}
              onGenerate={handleGenerateDigest}
              isGenerating={generateDigestMutation.isPending}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
              <p className="text-muted-foreground">Generating AI digest...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-8">
              <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
              <p className="text-destructive mb-4">
                Failed to load digest: {error?.message}
              </p>
              <Button onClick={() => refetch()} variant="outline">
                Try Again
              </Button>
            </div>
          ) : digest ? (
            <div className="space-y-6">
              <DigestSummary summary={digest.summary} />
              <DigestInsights insights={digest.key_insights} />
              <DigestActionItems actionItems={digest.action_items} />
              <DigestPriorityEmails priorityEmails={digest.priority_emails} />
              <DigestConversationSummaries
                conversationSummaries={digest.conversation_summaries}
              />
              <DigestMetadata
                createdAt={digest.created_at}
                digestType={digest.digest_type}
              />
            </div>
          ) : (
            <div className="text-center py-8">
              <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                No digest available. Generate your first AI digest to get
                started.
              </p>
              <Button
                onClick={handleGenerateDigest}
                className="flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Generate First Digest
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

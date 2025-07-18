"use client";

import {
  ConversationDetailHeader,
  ConversationEmailList,
  ConversationParticipants,
  ConversationStats,
  ConversationAIToggle,
  ConversationAIAnalysis,
  ConversationAIResponses,
  ConversationAIGenerate,
  ConversationRelatedEmails,
} from "@/components/obwb/conversations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { conversationsAPI, AIServices } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { ConversationDetailFilters } from "@/types/emails";
import { GenerateResponseRequest } from "@/types/AIServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, RefreshCw } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ConversationDetailPage() {
    const { getUserByService } = useAuthStore();
  const user = getUserByService('obwb')
  const params = useParams();
  const conversationId = params.id as string;

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [filters] = useState<ConversationDetailFilters>({});
  const [showAI, setShowAI] = useState(false);
  
  // AI Responses pagination state
  const [aiResponsesPage, setAiResponsesPage] = useState(1);
  const [aiResponsesPageSize, setAiResponsesPageSize] = useState(10);
  
  const queryClient = useQueryClient();

  const microsoftUserId = user?.microsoft_user_id;

  const {
    data: conversationDetail,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "conversation-detail",
      microsoftUserId,
      conversationId,
      currentPage,
      pageSize,
      filters,
    ],
    queryFn: () =>
      conversationsAPI.getConversationDetail(microsoftUserId!, conversationId, {
        page_num: currentPage,
        page_size: pageSize,
        ...filters,
      }),
    enabled: !!microsoftUserId && !!conversationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // AI Analysis Query
  const {
    data: aiAnalysis,
    isLoading: aiAnalysisLoading,
    refetch: refetchAnalysis,
  } = useQuery({
    queryKey: ["ai-analysis", microsoftUserId, conversationId],
    queryFn: () =>
      AIServices.analyzeConversation(microsoftUserId!, conversationId),
    enabled: !!microsoftUserId && !!conversationId && showAI,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // AI Responses Query with pagination
  const { data: aiResponses, isLoading: aiResponsesLoading } = useQuery({
    queryKey: ["ai-responses", microsoftUserId, conversationId, aiResponsesPage, aiResponsesPageSize],
    queryFn: () =>
      AIServices.getUserResponses(microsoftUserId!, {
        conversation_id: conversationId,
        page_num: aiResponsesPage,
        page_size: aiResponsesPageSize,
      }),
    enabled: !!microsoftUserId && !!conversationId && showAI,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Related Emails Query
  const { data: relatedEmails, isLoading: relatedEmailsLoading, refetch: refetchRelatedEmails } = useQuery({
    queryKey: ["related-emails", microsoftUserId, conversationId],
    queryFn: () =>
      AIServices.getRelatedEmails(microsoftUserId!, conversationId, 5),
    enabled: !!microsoftUserId && !!conversationId && showAI,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Mutations
  const deleteResponseMutation = useMutation({
    mutationFn: ({ responseId }: { responseId: string }) =>
      AIServices.deleteResponse(microsoftUserId!, responseId),
    onSuccess: () => {
      toast.success("Response deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["ai-responses", microsoftUserId, conversationId],
      });
    },
    onError: () => {
      toast.error("Failed to delete response");
    },
  });

  const clearCacheMutation = useMutation({
    mutationFn: () =>
      AIServices.clearAiCacheForConversation(microsoftUserId!, conversationId),
    onSuccess: () => {
      toast.success("AI cache cleared successfully");
      queryClient.invalidateQueries({
        queryKey: ["ai-responses", microsoftUserId, conversationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["ai-analysis", microsoftUserId, conversationId],
      });
    },
    onError: () => {
      toast.error("Failed to clear AI cache");
    },
  });

  const generateResponseMutation = useMutation({
    mutationFn: (request: GenerateResponseRequest) =>
      AIServices.generateResponse(microsoftUserId!, request),
    onSuccess: () => {
      toast.success("AI response generated successfully");
      queryClient.invalidateQueries({
        queryKey: ["ai-responses", microsoftUserId, conversationId],
      });
    },
    onError: () => {
      toast.error("Failed to generate AI response");
    },
  });

  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(Number(newPageSize));
    setCurrentPage(1);
  };

  // AI Responses pagination handlers
  const handleAiResponsesPageChange = (page: number) => {
    setAiResponsesPage(page);
  };

  const handleAiResponsesPageSizeChange = (newPageSize: string) => {
    setAiResponsesPageSize(Number(newPageSize));
    setAiResponsesPage(1); // Reset to first page when changing page size
  };

  if (!microsoftUserId) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Conversation Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No Email Account Connected
              </h3>
              <p className="text-muted-foreground mb-4">
                Connect your email account to view conversation details.
              </p>
              <a
                href="/dashboard/connect-email"
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Connect Email Account
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Conversation Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="container mx-auto p-6">
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Loading conversation...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Conversation Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="mx-auto h-12 w-12 text-destructive mb-4">
                <MessageSquare className="h-full w-full" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Error Loading Conversation
              </h3>
              <p className="text-muted-foreground mb-4">
                {error instanceof Error
                  ? error.message
                  : "An error occurred while loading the conversation."}
              </p>
              <button
                onClick={() => refetch()}
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!conversationDetail) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Conversation Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Conversation Not Found
              </h3>
              <p className="text-muted-foreground">
                The requested conversation could not be found.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-0 md:p-6 space-y-6">
      {/* Header */}
      <ConversationDetailHeader
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* AI Toggle */}
      <ConversationAIToggle
        showAI={showAI}
        onToggle={() => setShowAI(!showAI)}
      />

      {/* AI Sections */}
      {showAI && (
        <>
          {/* AI Generate Response */}
          <ConversationAIGenerate
            conversationId={conversationId}
            onGenerateResponse={(request) =>
              generateResponseMutation.mutateAsync(request)
            }
            isLoading={generateResponseMutation.isPending}
            onResponseGenerated={() => {
              // This will be called after successful generation
            }}
          />

          {/* AI Analysis */}
          <ConversationAIAnalysis
            analysis={aiAnalysis}
            isLoading={aiAnalysisLoading}
            onAnalyze={() => refetchAnalysis()}
          />

          {/* Related Emails */}
          <ConversationRelatedEmails
            relatedEmails={relatedEmails}
            isLoading={relatedEmailsLoading}
            onRefresh={refetchRelatedEmails}
          />

          {/* AI Responses */}
          <ConversationAIResponses
            responses={aiResponses}
            isLoading={aiResponsesLoading}
            onDeleteResponse={(responseId) =>
              deleteResponseMutation.mutate({ responseId })
            }
            onClearCache={() => clearCacheMutation.mutate()}
            onPageChange={handleAiResponsesPageChange}
            onPageSizeChange={handleAiResponsesPageSizeChange}
            currentPage={aiResponsesPage}
            pageSize={aiResponsesPageSize}
          />
        </>
      )}

      {/* Conversation Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {conversationDetail.subject || "No Subject"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ConversationStats conversationDetail={conversationDetail} />
          <ConversationParticipants
            participants={conversationDetail.participants}
          />
          <ConversationEmailList emails={conversationDetail.emails} />
        </CardContent>
      </Card>
    </div>
  );
}

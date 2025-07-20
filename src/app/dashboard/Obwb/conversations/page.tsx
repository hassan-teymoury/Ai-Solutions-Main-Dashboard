"use client";

import {
  ConversationControls,
  ConversationEmpty,
  ConversationError,
  ConversationFiltersComponent,
  ConversationLoading,
  ConversationNoAccount,
  ConversationPagination,
} from "@/components/obwb/conversations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { conversationsAPI, emailAPI } from "@/lib/api";
import { useObwbUser } from "@/lib/hooks/use-auth";
import { cn } from "@/lib/utils";
import { ConversationFilters } from "@/types/emails";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ConversationsPage() {
  // Get OBWB user data from API
  const { data: obwbUser } = useObwbUser();
  const microsoftUserId = obwbUser?.microsoft_user_id;
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // Read page and filters from URL
  const initialPage = Number(searchParams.get("page")) || 1;
  const initialFilters: ConversationFilters = {
    subject_contains: searchParams.get("subject_contains") || undefined,
    sender_email: searchParams.get("sender_email") || undefined,
    has_unread:
      searchParams.get("has_unread") === "true"
        ? true
        : searchParams.get("has_unread") === "false"
        ? false
        : undefined,
    has_attachments:
      searchParams.get("has_attachments") === "true"
        ? true
        : searchParams.get("has_attachments") === "false"
        ? false
        : undefined,
    importance:
      (searchParams.get("importance") as "low" | "normal" | "high") ||
      undefined,
    sort_by:
      (searchParams.get("sort_by") as
        | "latest_email_date"
        | "first_email_date"
        | "email_count"
        | "subject"
        | "participant_count") || undefined,
    sort_order: (searchParams.get("sort_order") as "asc" | "desc") || undefined,
  };

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(25);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ConversationFilters>(initialFilters);

  // Update URL when currentPage or filters change
  useEffect(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("page", String(currentPage));

    // Clear existing filter params
    const filterKeys = [
      "subject_contains",
      "sender_email",
      "has_unread",
      "has_attachments",
      "importance",
      "sort_by",
      "sort_order",
    ];
    filterKeys.forEach((key) => params.delete(key));

    // Add current filter params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.set(key, String(value));
      }
    });

    router.replace(`?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters]);

  const {
    data: conversationsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "conversations",
      microsoftUserId,
      currentPage,
      pageSize,
      filters,
    ],
    queryFn: () =>
      conversationsAPI.getConversations(microsoftUserId!, {
        page_num: currentPage,
        page_size: pageSize,
        ...filters,
      }),
    enabled: !!microsoftUserId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const syncEmailsMutation = useMutation({
    mutationFn: () => emailAPI.syncEmails(microsoftUserId!),
    onSuccess: (response) => {
      toast.success(
        `Synced ${response.emails_fetched} new ${
          response.emails_fetched <= 1 ? "email" : "emails"
        } and saved ${response.emails_saved} ${
          response.emails_saved <= 1 ? "email" : "emails"
        }`
      );
      queryClient.invalidateQueries({
        queryKey: ["conversations", microsoftUserId],
        exact: false,
      });
    },
    onError: () => {
      toast.error("Failed to sync emails");
    },
  });

  const refreshConversations = () => {
    syncEmailsMutation.mutate();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(Number(newPageSize));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleFiltersChange = (newFilters: ConversationFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when applying filters
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const activeFiltersCount = Object.keys(filters).filter(
    (key) =>
      filters[key as keyof ConversationFilters] !== undefined &&
      filters[key as keyof ConversationFilters] !== ""
  ).length;

  if (!microsoftUserId) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Conversations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ConversationNoAccount />
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
              Conversations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ConversationLoading />
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
              Conversations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ConversationError error={error as Error} onRetry={refetch} />
          </CardContent>
        </Card>
      </div>
    );
  }

  const { conversations, pagination } = conversationsData || {
    conversations: [],
    pagination: null,
  };

  return (
    <div className="container mx-auto p-0 md:p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-6 items-start md:flex-row md:items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Conversations
            </CardTitle>
            <ConversationControls
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
              onRefresh={refreshConversations}
              showFilters={showFilters}
              onToggleFilters={handleToggleFilters}
              activeFiltersCount={activeFiltersCount}
              syncing={syncEmailsMutation.isPending}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              showFilters
                ? "max-h-[2000px] opacity-100 mb-6"
                : "max-h-0 opacity-0 mb-0"
            )}
          >
            <ConversationFiltersComponent
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {conversations.length === 0 ? (
            <ConversationEmpty />
          ) : (
            <>
              <div className="space-y-4">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.conversation_id}
                    className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/dashboard/Obwb/conversations/${conversation.conversation_id}`
                      )
                    }
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground mb-1">
                          {conversation.subject || "No Subject"}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {conversation.sender_name} (
                          {conversation.sender_email})
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{conversation.email_count} emails</span>
                          <span>
                            {conversation.participant_count} participants
                          </span>
                          <span>
                            {formatDistanceToNow(
                              conversation.latest_email_date,
                              { addSuffix: true }
                            )}
                          </span>
                          {conversation.has_unread && (
                            <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full">
                              Unread
                            </span>
                          )}
                          {conversation.has_attachments && (
                            <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                              Has Attachments
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right text-xs text-muted-foreground">
                        <div className="capitalize">
                          {conversation.importance}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {pagination && (
                <ConversationPagination
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

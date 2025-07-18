"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store";
import { AIServices } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { FollowUpRequiredEmailsFilters } from "@/types/AIServices";
import {
  FollowUpsFilters,
  FollowUpsPriorityBreakdown,
  FollowUpsEmailList,
  FollowUpsPagination,
} from "@/components/obwb/follow-ups";

export default function FollowUpsPage() {
  const { getUserByService } = useAuthStore();
  const user = getUserByService('obwb')
  const microsoftUserId = user?.microsoft_user_id;

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [priority, setPriority] = useState<"low" | "medium" | "high">("high");

  const filters: FollowUpRequiredEmailsFilters = {
    priority,
    page_num: currentPage,
    page_size: pageSize,
  };

  const {
    data: followUpsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["follow-up-emails", microsoftUserId, filters],
    queryFn: () =>
      AIServices.getFollowUpRequiredEmails(microsoftUserId!, filters),
    enabled: !!microsoftUserId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(Number(newPageSize));
    setCurrentPage(1);
  };

  const handlePriorityChange = (newPriority: "low" | "medium" | "high") => {
    setPriority(newPriority);
    setCurrentPage(1);
  };

  if (!microsoftUserId) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Follow-up Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Please connect your email account to view follow-up required
                emails.
              </p>
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
              <AlertTriangle className="h-5 w-5" />
              Follow-up Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
              <p className="text-muted-foreground">
                Loading follow-up emails...
              </p>
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
              <AlertTriangle className="h-5 w-5" />
              Follow-up Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
              <p className="text-destructive mb-4">
                Failed to load follow-up emails: {error?.message}
              </p>
              <Button onClick={() => refetch()} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { emails, total_count, total_pages, priority_breakdown } =
    followUpsData || {
      emails: [],
      total_count: 0,
      total_pages: 0,
      priority_breakdown: {},
    };

  return (
    <div className="container mx-auto p-0 md:p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-6 items-start md:flex-row md:items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Follow-up Required ({total_count})
            </CardTitle>
            <FollowUpsFilters
              priority={priority}
              pageSize={pageSize}
              onPriorityChange={handlePriorityChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        </CardHeader>
        <CardContent>
          <FollowUpsPriorityBreakdown priorityBreakdown={priority_breakdown} />
          <FollowUpsEmailList emails={emails} priority={priority} />
          <FollowUpsPagination
            currentPage={currentPage}
            totalPages={total_pages}
            totalCount={total_count}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}

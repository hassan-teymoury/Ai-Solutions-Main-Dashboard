"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/store";
import { emailAPI } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { EmailTable } from "@/components/obwb/emails/email-table";
import { EmailPagination } from "@/components/obwb/emails/email-pagination";
import { EmailControls } from "@/components/obwb/emails/email-controls";
import { EmailFiltersComponent } from "@/components/obwb/emails/email-filters";
import { EmailLoading } from "@/components/obwb/emails/email-loading";
import { EmailError } from "@/components/obwb/emails/email-error";
import { EmailEmpty } from "@/components/obwb/emails/email-empty";
import { EmailNoAccount } from "@/components/obwb/emails/email-no-account";
import { useRouter, useSearchParams } from "next/navigation";
import { EmailFilters } from "@/types/emails";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function EmailsPage() {
  const { userInServices } = useAuthStore();
  const user = userInServices?.find(u => u.service === 'obwb');
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // Read page and filters from URL
  const initialPage = Number(searchParams.get("page")) || 1;
  const initialFilters: EmailFilters = {
    subject_contains: searchParams.get("subject_contains") || undefined,
    sender_email: searchParams.get("sender_email") || undefined,
    sender_name_contains: searchParams.get("sender_name_contains") || undefined,
    body_contains: searchParams.get("body_contains") || undefined,
    received_after: searchParams.get("received_after") || undefined,
    received_before: searchParams.get("received_before") || undefined,
    is_read:
      searchParams.get("is_read") === "true"
        ? true
        : searchParams.get("is_read") === "false"
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
    search_text: searchParams.get("search_text") || undefined,
    sort_by: searchParams.get("sort_by") || undefined,
    sort_order: (searchParams.get("sort_order") as "asc" | "desc") || undefined,
  };

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(25);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<EmailFilters>(initialFilters);

  // Update URL when currentPage or filters change
  useEffect(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("page", String(currentPage));

    // Clear existing filter params
    const filterKeys = [
      "subject_contains",
      "sender_email",
      "sender_name_contains",
      "body_contains",
      "received_after",
      "received_before",
      "is_read",
      "has_attachments",
      "importance",
      "search_text",
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

  const microsoftUserId = user?.microsoft_user_id;

  const {
    data: emailsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["emails", microsoftUserId, currentPage, pageSize, filters],
    queryFn: () =>
      emailAPI.getEmails(microsoftUserId || "", {
        page: currentPage,
        limit: pageSize,
        ...filters,
      }),
    enabled: !!microsoftUserId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const syncEmailsMutation = useMutation({
    mutationFn: () => emailAPI.syncEmails(microsoftUserId!),
    onSuccess: (response) => {
      toast.success(
        `Synced ${response.emails_saved} new ${response.emails_fetched <= 1 ? "email" : "emails"
        } and saved ${response.emails_saved} ${response.emails_saved <= 1 ? "email" : "emails"
        }`
      );
      queryClient.invalidateQueries({
        queryKey: ["emails", microsoftUserId],
        exact: false,
      });
    },
    onError: () => {
      toast.error("Failed to sync emails");
    },
  });

  const refreshEmails = () => {
    syncEmailsMutation.mutate();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(Number(newPageSize));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleFiltersChange = (newFilters: EmailFilters) => {
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
      filters[key as keyof EmailFilters] !== undefined &&
      filters[key as keyof EmailFilters] !== ""
  ).length;

  if (!microsoftUserId) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Emails
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EmailNoAccount />
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
              <Mail className="h-5 w-5" />
              Emails
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EmailLoading />
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
              <Mail className="h-5 w-5" />
              Emails
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EmailError error={error} onRetry={refetch} />
          </CardContent>
        </Card>
      </div>
    );
  }

  const { emails, pagination } = emailsData || { emails: [], pagination: null };

  return (
    <div className="container mx-auto p-0 md:p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-6 items-start md:flex-row md:items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Emails
            </CardTitle>
            <EmailControls
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
              onRefresh={refreshEmails}
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
            <EmailFiltersComponent
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </div>
          {emails.length === 0 ? (
            <EmailEmpty />
          ) : (
            <>
              <EmailTable emails={emails} />
              {pagination && (
                <EmailPagination
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

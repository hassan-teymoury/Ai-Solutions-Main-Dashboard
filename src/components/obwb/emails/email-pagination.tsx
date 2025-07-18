"use client";

import { Separator } from "@/components/ui/separator";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { EmailPagination as EmailPaginationType } from "@/types/emails";
import { useEffect, useState } from "react";

interface EmailPaginationProps {
  pagination: EmailPaginationType;
  onPageChange: (page: number) => void;
}

function usePageWindow() {
  const [windowSize, setWindowSize] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  useEffect(() => {
    function handleResize() {
      setWindowSize(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize < 640 ? 3 : 5; // 640px is Tailwind's sm breakpoint
}

export function EmailPagination({
  pagination,
  onPageChange,
}: EmailPaginationProps) {
  const pageWindow = usePageWindow();
  if (pagination.total_pages <= 1) {
    return null;
  }

  return (
    <div className="mt-6">
      <Separator className="mb-4" />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="text-sm text-muted-foreground">
          Showing {(pagination.page_num - 1) * pagination.page_size + 1} to{" "}
          {Math.min(
            pagination.page_num * pagination.page_size,
            pagination.total_items
          )}{" "}
          of {pagination.total_items} emails
        </div>
        <div className="overflow-x-auto w-full sm:w-auto">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(pagination.page_num - 1)}
                  className={
                    !pagination.has_prev
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              {Array.from(
                { length: Math.min(pageWindow, pagination.total_pages) },
                (_, i) => {
                  let pageNum;
                  if (pagination.total_pages <= pageWindow) {
                    pageNum = i + 1;
                  } else if (pagination.page_num <= Math.ceil(pageWindow / 2)) {
                    pageNum = i + 1;
                  } else if (
                    pagination.page_num >=
                    pagination.total_pages - Math.floor(pageWindow / 2)
                  ) {
                    pageNum = pagination.total_pages - (pageWindow - 1) + i;
                  } else {
                    pageNum =
                      pagination.page_num - Math.floor(pageWindow / 2) + i;
                  }
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => onPageChange(pageNum)}
                        isActive={pageNum === pagination.page_num}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
              )}
              {pagination.total_pages > pageWindow &&
                pagination.page_num <
                  pagination.total_pages - Math.floor(pageWindow / 2) && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
              <PaginationItem>
                <PaginationNext
                  onClick={() => onPageChange(pagination.page_num + 1)}
                  className={
                    !pagination.has_next
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

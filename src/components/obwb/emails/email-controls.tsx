"use client";

import { RefreshCw, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

interface EmailControlsProps {
  pageSize: number;
  onPageSizeChange: (newPageSize: string) => void;
  onRefresh: () => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  activeFiltersCount?: number;
  syncing?: boolean;
}

export function EmailControls({
  pageSize,
  onPageSizeChange,
  onRefresh,
  showFilters,
  onToggleFilters,
  activeFiltersCount = 0,
  syncing = false,
}: EmailControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Show:</span>
        <Select value={pageSize.toString()} onValueChange={onPageSizeChange}>
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ITEMS_PER_PAGE_OPTIONS.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        onClick={onToggleFilters}
        variant={showFilters ? "default" : "outline"}
        size="sm"
      >
        <Filter className="h-4 w-4 mr-2" />
        Filters
        {activeFiltersCount > 0 && (
          <span className="ml-1 bg-background text-foreground rounded-full px-1.5 py-0.5 text-xs">
            {activeFiltersCount}
          </span>
        )}
      </Button>
      <Button
        onClick={onRefresh}
        variant="outline"
        size="sm"
        disabled={syncing}
      >
        <RefreshCw className={cn(syncing ? "animate-spin" : "")} />
        {syncing ? "Syncing..." : "Refresh"}
      </Button>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConversationFilters } from "@/types/emails";
import { X, Search, Filter } from "lucide-react";

interface ConversationFiltersComponentProps {
  filters: ConversationFilters;
  onFiltersChange: (filters: ConversationFilters) => void;
  onClearFilters: () => void;
}

export function ConversationFiltersComponent({
  filters,
  onFiltersChange,
  onClearFilters,
}: ConversationFiltersComponentProps) {
  const [localFilters, setLocalFilters] =
    useState<ConversationFilters>(filters);

  const handleFilterChange = (
    key: keyof ConversationFilters,
    value: string | boolean | undefined
  ) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  const handleClearAll = () => {
    setLocalFilters({});
    onClearFilters();
  };

  const hasActiveFilters = Object.entries(localFilters).some(([, value]) => {
    if (value === undefined || value === "") return false;
    if (typeof value === "boolean") return value;
    return true;
  });

  return (
    <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <h3 className="text-sm font-medium">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="h-6 px-2 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Subject Search */}
        <div className="space-y-2">
          <Label htmlFor="subject" className="text-xs font-medium">
            Subject Contains
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="subject"
              placeholder="Search in subject..."
              value={localFilters.subject_contains || ""}
              onChange={(e) =>
                handleFilterChange("subject_contains", e.target.value)
              }
              className="pl-9"
            />
          </div>
        </div>

        {/* Sender Email */}
        <div className="space-y-2">
          <Label htmlFor="sender_email" className="text-xs font-medium">
            Sender Email
          </Label>
          <Input
            id="sender_email"
            placeholder="Filter by sender email..."
            value={localFilters.sender_email || ""}
            onChange={(e) => handleFilterChange("sender_email", e.target.value)}
          />
        </div>

        {/* Importance */}
        <div className="space-y-2">
          <Label htmlFor="importance" className="text-xs font-medium">
            Importance
          </Label>
          <Select
            value={localFilters.importance || "all"}
            onValueChange={(value) =>
              handleFilterChange("importance", value === "all" ? undefined : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All importance levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All importance levels</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label htmlFor="sort_by" className="text-xs font-medium">
            Sort By
          </Label>
          <Select
            value={localFilters.sort_by || "latest_email_date"}
            onValueChange={(value) =>
              handleFilterChange("sort_by", value)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest_email_date">
                Latest Email Date
              </SelectItem>
              <SelectItem value="first_email_date">First Email Date</SelectItem>
              <SelectItem value="email_count">Email Count</SelectItem>
              <SelectItem value="subject">Subject</SelectItem>
              <SelectItem value="participant_count">
                Participant Count
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="has_unread"
            checked={localFilters.has_unread || false}
            onChange={(e) =>
              handleFilterChange("has_unread", e.target.checked || undefined)
            }
            className="rounded border-gray-300"
          />
          <Label htmlFor="has_unread" className="text-sm">
            Has Unread Emails
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="has_attachments"
            checked={localFilters.has_attachments || false}
            onChange={(e) =>
              handleFilterChange(
                "has_attachments",
                e.target.checked || undefined
              )
            }
            className="rounded border-gray-300"
          />
          <Label htmlFor="has_attachments" className="text-sm">
            Has Attachments
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Label htmlFor="sort_order" className="text-sm">
            Sort Order:
          </Label>
          <Select
            value={localFilters.sort_order || "desc"}
            onValueChange={(value) =>
              handleFilterChange("sort_order", value)
            }
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Desc</SelectItem>
              <SelectItem value="asc">Asc</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearAll}
          disabled={!hasActiveFilters}
        >
          Clear
        </Button>
        <Button size="sm" onClick={handleApplyFilters}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
}

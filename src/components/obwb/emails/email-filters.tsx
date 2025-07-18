"use client";

import { useState, useEffect } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EmailFilters } from "@/types/emails";
import {
  Search,
  Filter,
  X,
  Calendar as CalendarIcon,
  User,
  Mail,
  Star,
  SortAsc,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface EmailFiltersProps {
  filters: EmailFilters;
  onFiltersChange: (filters: EmailFilters) => void;
  onClearFilters: () => void;
}

export function EmailFiltersComponent({
  filters,
  onFiltersChange,
  onClearFilters,
}: EmailFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<EmailFilters>(filters);

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (
    key: keyof EmailFilters,
    value: EmailFilters[keyof EmailFilters]
  ) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters: EmailFilters = {};
    setLocalFilters(clearedFilters);
    onClearFilters();
  };

  const activeFiltersCount = Object.keys(filters).filter(
    (key) =>
      filters[key as keyof EmailFilters] !== undefined &&
      filters[key as keyof EmailFilters] !== ""
  ).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Hide" : "Show"} Filters
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Quick search bar - always visible */}
      <CardContent className="pt-0">
        <div className="flex flex-col md:flex-row items-center gap-2 mb-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search emails..."
              value={localFilters.search_text || ""}
              onChange={(e) =>
                handleFilterChange("search_text", e.target.value)
              }
              className="pl-10"
            />
          </div>
          <Button
            onClick={handleApplyFilters}
            size="default"
            className="w-full min-w-[200px] md:w-auto"
          >
            Apply
          </Button>
        </div>

        {/* Expanded filters */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="space-y-6 pt-4">
            <Separator />

            {/* Sender filters */}
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
              <h4 className="font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Sender
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sender-email">Email Address</Label>
                  <Input
                    id="sender-email"
                    placeholder="sender@example.com"
                    value={localFilters.sender_email || ""}
                    onChange={(e) =>
                      handleFilterChange("sender_email", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sender-name">Name Contains</Label>
                  <Input
                    id="sender-name"
                    placeholder="John Doe"
                    value={localFilters.sender_name_contains || ""}
                    onChange={(e) =>
                      handleFilterChange("sender_name_contains", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Content filters */}
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300 delay-75">
              <h4 className="font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Content
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject Contains</Label>
                  <Input
                    id="subject"
                    placeholder="meeting, report, etc."
                    value={localFilters.subject_contains || ""}
                    onChange={(e) =>
                      handleFilterChange("subject_contains", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="body">Body Contains</Label>
                  <Input
                    id="body"
                    placeholder="Search in email body..."
                    value={localFilters.body_contains || ""}
                    onChange={(e) =>
                      handleFilterChange("body_contains", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Date filters */}
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300 delay-150">
              <h4 className="font-medium flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Date Range
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="received-after">Received After</Label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          data-empty={!localFilters.received_after}
                          className={cn(
                            "flex-1 justify-start text-left font-normal",
                            !localFilters.received_after &&
                              "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {localFilters.received_after ? (
                            format(new Date(localFilters.received_after), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={
                            localFilters.received_after
                              ? new Date(localFilters.received_after)
                              : undefined
                          }
                          onSelect={(date) =>
                            handleFilterChange(
                              "received_after",
                              date ? format(date, "yyyy-MM-dd") : undefined
                            )
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    {localFilters.received_after && (
                      <Button
                        variant="outline"
                        size="default"
                        onClick={() =>
                          handleFilterChange("received_after", undefined)
                        }
                        className="px-2 h-9"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="received-before">Received Before</Label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          data-empty={!localFilters.received_before}
                          className={cn(
                            "flex-1 justify-start text-left font-normal",
                            !localFilters.received_before &&
                              "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {localFilters.received_before ? (
                            format(
                              new Date(localFilters.received_before),
                              "PPP"
                            )
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={
                            localFilters.received_before
                              ? new Date(localFilters.received_before)
                              : undefined
                          }
                          onSelect={(date) =>
                            handleFilterChange(
                              "received_before",
                              date ? format(date, "yyyy-MM-dd") : undefined
                            )
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    {localFilters.received_before && (
                      <Button
                        variant="outline"
                        size="default"
                        onClick={() =>
                          handleFilterChange("received_before", undefined)
                        }
                        className="px-2 h-9"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Status filters */}
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300 delay-200">
              <h4 className="font-medium flex items-center gap-2">
                <Star className="h-4 w-4" />
                Status & Importance
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="read-status">Read Status</Label>
                  <Select
                    value={localFilters.is_read?.toString() || "all"}
                    onValueChange={(value) =>
                      handleFilterChange(
                        "is_read",
                        value === "all" ? undefined : value === "true"
                      )
                    }
                  >
                    <SelectTrigger id="read-status" className="w-full">
                      <SelectValue placeholder="All emails" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All emails</SelectItem>
                      <SelectItem value="false">Unread only</SelectItem>
                      <SelectItem value="true">Read only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attachments">Attachments</Label>
                  <Select
                    value={localFilters.has_attachments?.toString() || "all"}
                    onValueChange={(value) =>
                      handleFilterChange(
                        "has_attachments",
                        value === "all" ? undefined : value === "true"
                      )
                    }
                  >
                    <SelectTrigger id="attachments" className="w-full">
                      <SelectValue placeholder="All emails" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All emails</SelectItem>
                      <SelectItem value="true">With attachments</SelectItem>
                      <SelectItem value="false">Without attachments</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="importance">Importance</Label>
                  <Select
                    value={localFilters.importance || "all"}
                    onValueChange={(value) =>
                      handleFilterChange(
                        "importance",
                        value === "all" ? undefined : value
                      )
                    }
                  >
                    <SelectTrigger id="importance" className="w-full">
                      <SelectValue placeholder="All importance levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All importance levels</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Sort options */}
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300 delay-300">
              <h4 className="font-medium flex items-center gap-2">
                <SortAsc className="h-4 w-4" />
                Sort Options
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sort-by">Sort By</Label>
                  <Select
                    value={localFilters.sort_by || "received_date"}
                    onValueChange={(value) =>
                      handleFilterChange("sort_by", value)
                    }
                  >
                    <SelectTrigger id="sort-by" className="w-full">
                      <SelectValue placeholder="Received date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="received_date">
                        Received date
                      </SelectItem>
                      <SelectItem value="sender_name">Sender name</SelectItem>
                      <SelectItem value="subject">Subject</SelectItem>
                      <SelectItem value="importance">Importance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sort-order">Sort Order</Label>
                  <Select
                    value={localFilters.sort_order || "desc"}
                    onValueChange={(value) =>
                      handleFilterChange("sort_order", value)
                    }
                  >
                    <SelectTrigger id="sort-order" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">Descending</SelectItem>
                      <SelectItem value="asc">Ascending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 animate-in slide-in-from-top-2 duration-300 delay-400">
              <Button onClick={handleApplyFilters} className="flex-1">
                Apply Filters
              </Button>
              <Button variant="outline" onClick={handleClearFilters}>
                Clear All
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResponsesResponse } from "@/types/AIServices";
import { RefreshCw, Trash2, MessageSquare } from "lucide-react";
import { ConversationAIPagination } from "./conversation-ai-pagination";

interface ConversationAIResponsesProps {
  responses: ResponsesResponse | undefined;
  isLoading: boolean;
  onDeleteResponse: (responseId: string) => void;
  onClearCache: () => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (newPageSize: string) => void;
  currentPage: number;
  pageSize: number;
}

export function ConversationAIResponses({
  responses,
  isLoading,
  onDeleteResponse,
  onClearCache,
  onPageChange,
  onPageSizeChange,
  currentPage,
  pageSize,
}: ConversationAIResponsesProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            AI Responses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground mr-2" />
            <p className="text-sm text-muted-foreground">
              Loading AI responses...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!responses || responses.responses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            AI Responses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              No AI responses found for this conversation.
            </p>
            <Button onClick={onClearCache} variant="outline">
              Clear AI Cache
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalPages = responses.total_pages;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            AI Responses ({responses.total_count})
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={String(pageSize)} onValueChange={onPageSizeChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Page size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per page</SelectItem>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={onClearCache} variant="outline" size="sm">
              Clear Cache
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {responses.responses.length > 0 &&
            responses.responses.map((response) => (
              <div
                key={response.id}
                className="p-4 border rounded-lg bg-muted/50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {response.model_used}
                    </Badge>
                    {response.is_cached && (
                      <Badge variant="secondary" className="text-xs">
                        Cached
                      </Badge>
                    )}
                  </div>
                  <Button
                    onClick={() => onDeleteResponse(response.id)}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground mb-3">
                  {response.response_text}
                </p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Tokens: {response.tokens_used}</span>
                  <span>Time: {response.processing_time_ms}ms</span>
                  <span>
                    {new Date(response.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
        </div>

        {/* Pagination */}
        <ConversationAIPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={responses.total_count}
          pageSize={pageSize}
          onPageChange={onPageChange}
        />
      </CardContent>
    </Card>
  );
}

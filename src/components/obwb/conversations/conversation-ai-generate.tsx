import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AIResponseResponse, GenerateResponseRequest } from "@/types/AIServices";
import { RefreshCw, Send, Sparkles } from "lucide-react";
import { useState } from "react";

interface ConversationAIGenerateProps {
  conversationId: string;
  onGenerateResponse: (request: GenerateResponseRequest) => Promise<AIResponseResponse>;
  isLoading: boolean;
  onResponseGenerated: () => void;
}

export function ConversationAIGenerate({
  conversationId,
  onGenerateResponse,
  isLoading,
  onResponseGenerated,
}: ConversationAIGenerateProps) {
  const [context, setContext] = useState("");
  const [maxTokens, setMaxTokens] = useState(500);
  const [forceRegenerate, setForceRegenerate] = useState(false);

  const handleGenerate = async () => {
    if (!context.trim()) return;

    try {
      await onGenerateResponse({
        conversation_id: conversationId,
        force_regenerate: forceRegenerate,
        context: context.trim(),
        max_tokens: maxTokens,
      });
      
      setContext("");
      onResponseGenerated();
    } catch (error) {
      console.error("Failed to generate response:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Generate AI Response
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Context Input */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Context / Prompt
            </label>
            <textarea
              placeholder="Enter context or prompt for AI response..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm resize-none"
            />
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Max Tokens
              </label>
              <Select value={String(maxTokens)} onValueChange={(value) => setMaxTokens(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select max tokens" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">100 tokens</SelectItem>
                  <SelectItem value="250">250 tokens</SelectItem>
                  <SelectItem value="500">500 tokens</SelectItem>
                  <SelectItem value="1000">1000 tokens</SelectItem>
                  <SelectItem value="2000">2000 tokens</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="force-regenerate"
                checked={forceRegenerate}
                onChange={(e) => setForceRegenerate(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="force-regenerate" className="text-sm font-medium">
                Force Regenerate
              </label>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleGenerate}
              disabled={isLoading || !context.trim()}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {isLoading ? "Generating..." : "Generate Response"}
            </Button>
            
            {forceRegenerate && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Will bypass cache
              </Badge>
            )}
          </div>

        </div>
      </CardContent>
    </Card>
  );
}

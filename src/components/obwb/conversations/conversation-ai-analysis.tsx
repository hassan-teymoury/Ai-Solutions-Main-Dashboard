import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyzeConversationResponse } from "@/types/AIServices";
import { RefreshCw, Sparkles } from "lucide-react";

interface ConversationAIAnalysisProps {
  analysis: AnalyzeConversationResponse | undefined;
  isLoading: boolean;
  onAnalyze: () => void;
}

export function ConversationAIAnalysis({
  analysis,
  isLoading,
  onAnalyze,
}: ConversationAIAnalysisProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          AI Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
            <p className="text-muted-foreground">Analyzing conversation...</p>
          </div>
        ) : analysis ? (
          <div className="space-y-6">
            {/* Summary */}
            <div>
              <h4 className="font-medium mb-2">Summary</h4>
              <p className="text-sm text-muted-foreground">
                {analysis.summary}
              </p>
            </div>

            {/* Key Points */}
            <div>
              <h4 className="font-medium mb-2">Key Points</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {analysis.key_points.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>

            {/* Sentiment & Urgency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Sentiment</h4>
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 hover:bg-blue-100"
                >
                  {analysis.sentiment}
                </Badge>
              </div>
              <div>
                <h4 className="font-medium mb-2">Urgency Level</h4>
                <Badge
                  variant="secondary"
                  className="bg-orange-100 text-orange-800 hover:bg-orange-100"
                >
                  {analysis.urgency_level}
                </Badge>
              </div>
            </div>

            {/* Suggested Actions */}
            <div>
              <h4 className="font-medium mb-2">Suggested Actions</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {analysis.suggested_actions.map((action, index) => (
                  <li key={index}>{action}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Button onClick={onAnalyze}>Analyze Conversation</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

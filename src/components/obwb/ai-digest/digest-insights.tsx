import { TrendingUp } from "lucide-react";

interface DigestInsightsProps {
  insights: string[];
}

export function DigestInsights({ insights }: DigestInsightsProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <TrendingUp className="h-5 w-5" />
        Key Insights
      </h3>
      <div className="space-y-2">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="w-2 h-2 bg-cyan rounded-full mt-2 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">{insight}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

import { Calendar } from "lucide-react";

interface DigestSummaryProps {
  summary: string;
}

export function DigestSummary({ summary }: DigestSummaryProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <Calendar className="h-5 w-5" />
        Summary
      </h3>
      <p className="text-muted-foreground leading-relaxed">{summary}</p>
    </div>
  );
}

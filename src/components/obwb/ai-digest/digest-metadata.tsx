import { Badge } from "@/components/ui/badge";
import { DigestType } from "@/types/AIServices";

interface DigestMetadataProps {
  createdAt: string;
  digestType: DigestType;
}

export function DigestMetadata({ createdAt, digestType }: DigestMetadataProps) {
  return (
    <div className="pt-4 border-t">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Generated: {new Date(createdAt).toLocaleString()}</span>
        <Badge variant="secondary">{digestType}</Badge>
      </div>
    </div>
  );
}

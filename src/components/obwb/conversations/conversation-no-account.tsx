import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export function ConversationNoAccount() {
  return (
    <div className="container mx-auto p-6">
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          No Email Account Connected
        </h3>
        <p className="text-muted-foreground mb-4">
          Please connect your email account to view your conversations.
        </p>
        <Button asChild>
          <Link href="/dashboard/Obwb/connect-email">Connect Email</Link>
        </Button>
      </div>
    </div>
  );
} 
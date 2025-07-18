import { Mail } from "lucide-react";

export function EmailEmpty() {
  return (
    <div className="text-center py-8">
      <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Emails Found</h3>
      <p className="text-muted-foreground">
        No emails have been synced yet. Please wait for the sync to complete.
      </p>
    </div>
  );
}

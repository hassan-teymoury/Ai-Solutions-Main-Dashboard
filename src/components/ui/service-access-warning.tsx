"use client";

import { useAuthStore } from "@/lib/store";
import { usePathname } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export function ServiceAccessWarning() {
  const { userInServices } = useAuthStore();
  const pathname = usePathname();

  // Helper: check if user has service access
  const hasServiceAccess = (serviceName: string) => {
    return userInServices?.some((u) => u.service === serviceName);
  };

  // Check if we're in a service that user doesn't have access to
  const getServiceWarning = () => {
    if (pathname.includes("/dashboard/Obwb") && !hasServiceAccess("obwb")) {
      return {
        service: "OBWB",
        message: "You don't have access to OBWB service. Contact your administrator to gain access."
      };
    }
    
    if (pathname.includes("/dashboard/Optical") && !hasServiceAccess("optical")) {
      return {
        service: "Optical",
        message: "You don't have access to Optical service. Contact your administrator to gain access."
      };
    }
    
    return null;
  };

  const warning = getServiceWarning();

  if (!warning) {
    return null;
  }

  return (
    <Alert className="mb-4 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertDescription className="text-amber-800 dark:text-amber-200">
        <strong>{warning.service} Service:</strong> {warning.message}
      </AlertDescription>
    </Alert>
  );
} 
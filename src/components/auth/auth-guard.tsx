"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { authAPI } from "@/lib/api";
import { RefreshCw } from "lucide-react";
import { obwbAuthAPI } from "@/lib/api/obwb/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { setUsers, setUser, userInServices, hydrated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Helper: check if user has service access
  const hasServiceAccess = (serviceName: string) => {
    return userInServices?.some((u) => u.service === serviceName);
  };

  useEffect(() => {
    let ignore = false;
    
    async function validate() {
      try {
        // Wait for store to be hydrated
        if (!hydrated) {
          return;
        }

        const authStorage = JSON.parse(
          localStorage.getItem("auth-storage") || "{}"
        );
        const token = authStorage?.state?.access_token;
        
        if (!token) {
          if (!ignore) {
            setLoading(false);
            router.replace("/");
          }
          return;
        }

        // Validate main dashboard token first
        try {
          const userData = await authAPI.me(token);
          if (!ignore) {
            setUser({ ...userData, service: "dashboard" });
          }
        } catch (error) {
          console.error("Dashboard auth validation failed:", error);
          if (!ignore) {
            setLoading(false);
            router.replace("/");
          }
          return;
        }

        // Try to validate OBWB token (optional - don't fail if this fails)
        try {
          const obwbUserData = await obwbAuthAPI.me(token);
          if (!ignore) {
            setUsers({ ...obwbUserData, service: "obwb" });
          }
        } catch (error) {
          console.warn("OBWB auth validation failed (optional):", error);
          // Don't fail the entire validation for OBWB
        }

        if (!ignore) {
          setLoading(false);
        }
      } catch (error) {
        console.error("Auth validation error:", error);
        if (!ignore) {
          setLoading(false);
          router.replace("/");
        }
      }
    }

    validate();
    
    return () => {
      ignore = true;
    };
  }, [router, setUsers, setUser, hydrated]);

  // After loading, check service access based on pathname
  useEffect(() => {
    if (!loading && hydrated) {
      if (pathname.includes("Obwb") && !hasServiceAccess("obwb")) {
        setAccessDenied(true);
      } else if (pathname.includes("Optical") && !hasServiceAccess("optical")) {
        setAccessDenied(true);
      } else {
        setAccessDenied(false);
      }
    }
  }, [pathname, loading, userInServices, hydrated]);

  if (loading || !hydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background px-4">
        <p className="text-center text-lg font-semibold text-destructive">
          This service is not active for you.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

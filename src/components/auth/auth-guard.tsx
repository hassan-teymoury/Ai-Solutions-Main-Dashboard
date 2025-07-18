"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { authAPI } from "@/lib/api";
import { RefreshCw } from "lucide-react";
import { obwbAuthAPI } from "@/lib/api/obwb/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { setUsers, setUser, userInServices, hydrated, access_token } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Helper: check if user has service access
  const hasServiceAccess = useCallback((serviceName: string) => {
    return userInServices?.some((u) => u.service === serviceName);
  }, [userInServices]);

  useEffect(() => {
    let ignore = false;
    
    async function validate() {
      try {
        // Wait for store to be hydrated
        if (!hydrated) {
          return;
        }

        // Check if we have a token in store first
        if (!access_token) {
          console.log("No access token in store, checking localStorage...");
          const authStorage = JSON.parse(
            localStorage.getItem("auth-storage") || "{}"
          );
          const token = authStorage?.state?.access_token;
          
          if (!token) {
            console.log("No token found, redirecting to login");
            if (!ignore) {
              setLoading(false);
              router.replace("/");
            }
            return;
          }
        }

        // Use token from store or localStorage
        const tokenToUse = access_token || JSON.parse(
          localStorage.getItem("auth-storage") || "{}"
        )?.state?.access_token;

        if (!tokenToUse) {
          if (!ignore) {
            setLoading(false);
            router.replace("/");
          }
          return;
        }

        console.log("Validating token...");

        // Validate main dashboard token first
        try {
          const userData = await authAPI.me(tokenToUse);
          if (!ignore) {
            setUser({ ...userData, service: "dashboard" });
            console.log("Dashboard validation successful");
          }
        } catch (error) {
          console.error("Dashboard auth validation failed:", error);
          if (!ignore) {
            setLoading(false);
            // Clear invalid token and redirect to login
            localStorage.removeItem("auth-storage");
            router.replace("/");
          }
          return;
        }

        // Try to validate OBWB token (optional - don't fail if this fails)
        try {
          const obwbUserData = await obwbAuthAPI.me(tokenToUse);
          if (!ignore) {
            setUsers({ ...obwbUserData, service: "obwb" });
            console.log("OBWB validation successful");
          }
        } catch (error) {
          console.warn("OBWB auth validation failed (optional):", error);
          // Don't fail the entire validation for OBWB
        }

        if (!ignore) {
          setLoading(false);
          console.log("Validation completed successfully");
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
  }, [router, setUsers, setUser, hydrated, access_token]);

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
  }, [pathname, loading, hasServiceAccess, hydrated]);

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

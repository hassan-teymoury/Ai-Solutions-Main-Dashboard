"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { authAPI } from "@/lib/api";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { setUser, hydrated, access_token, user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const validationRef = useRef(false);

  useEffect(() => {
    let ignore = false;
    
    async function validate() {
      try {
        // Wait for store to be hydrated
        if (!hydrated) {
          return;
        }

        // Prevent multiple validations
        if (validationRef.current) {
          return;
        }

        // If we already have a user and token, skip validation
        if (user && access_token) {
          console.log("User already authenticated, skipping validation");
          if (!ignore) {
            setLoading(false);
          }
          return;
        }

        validationRef.current = true;

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

        // Validate main dashboard token
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
  }, [hydrated, access_token, user, router]);

  if (loading || !hydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-cyan border-t-transparent mx-auto mb-4"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

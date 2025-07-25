"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, ExternalLink, Loader2, CheckCircle } from "lucide-react";
import { emailAPI } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { useObwbUser } from "@/lib/hooks/use-auth";
import { toast } from "sonner";
import { EmailConnectionResponse } from "@/types/api";

export default function ConnectEmailPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, setMicrosoftUserId, setObwbUser, getServiceToken } = useAuthStore();

  // Get OBWB user data from API
  const { data: obwbUser, isLoading: obwbUserLoading, error: obwbUserError } = useObwbUser();
  
  // Get microsoft_user_id from OBWB user
  const microsoftUserId = obwbUser?.microsoft_user_id;

  const [connectionStatus, setConnectionStatus] =
    useState<{ connected: boolean; email?: string; user_id?: string } | null>(null);

  // Check if user has OBWB access
  const hasObwbAccess = () => {
    const obwbToken = getServiceToken('obwb');
    return !!obwbToken;
  };
    
  const handleConnectEmail = async () => {
    // Check OBWB access first
    if (!hasObwbAccess()) {
      setError("OBWB service access not available. Please contact support.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { auth_url, state } = await emailAPI.getAuthUrl();

      // Store state for verification later if needed
      localStorage.setItem("email-auth-state", state);

      // Redirect to the auth URL
      window.location.href = auth_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get auth URL");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReconnect = async () => {
    try {
      if (!microsoftUserId) {
        toast.error("Microsoft User ID not available");
        return;
      }
      
      const connectionStatus: EmailConnectionResponse = await emailAPI.connectEmail(
        microsoftUserId
      );
      if (connectionStatus.connected) {
        // Set both main user microsoft_user_id and create/update OBWB user
        setMicrosoftUserId(connectionStatus.microsoft_user_id);
        setObwbUser(connectionStatus.microsoft_user_id);
        toast.success("Email connected successfully");
        // Update local state with new connection status
        setConnectionStatus({
          connected: true,
          email: connectionStatus.email,
          user_id: connectionStatus.microsoft_user_id,
        });
      } else {
        toast.error("Failed to connect email");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to reconnect email"
      );
    }
  };

  const handleDisconnectEmail = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      if (!microsoftUserId) {
        toast.error("Microsoft user ID not available");
        return;
      }
      
      await emailAPI.disconnectEmail(microsoftUserId);
      toast.success("Email disconnected successfully");
      
      // Update connection status to disconnected
      setConnectionStatus({
        connected: false,
        email: obwbUser?.email,
        user_id: microsoftUserId,
      });
      
      // Don't clear microsoft_user_id as user still exists, just disconnected
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to disconnect email"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getConnectionStatus = async () => {
    try {
      if (!obwbUser?.microsoft_user_id) {
        console.log("No microsoft user ID available, skipping connection status check");
        setIsInitialLoading(false);
        return;
      }
      
      // For now, assume connected if we have microsoft_user_id
      // In the future, you might want to call an API to check actual connection status
      setConnectionStatus({
        connected: !!obwbUser.microsoft_user_id,
        email: obwbUser.email,
        user_id: obwbUser.microsoft_user_id,
      });
    } catch (error) {
      console.error("Failed to get connection status:", error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    if (obwbUser?.microsoft_user_id) {
      getConnectionStatus();
    } else if (!obwbUserLoading && obwbUser) {
      // OBWB user loaded but no microsoft_user_id
      setIsInitialLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [obwbUser?.microsoft_user_id, obwbUserLoading]);

  // Show loading if OBWB user is still loading
  if (obwbUserLoading || isInitialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">
          {obwbUserLoading ? "Loading OBWB user data..." : "Loading connection status..."}
        </p>
      </div>
    );
  }

  // Show error if OBWB user failed to load
  if (obwbUserError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Card className="max-w-md bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-sm text-red-800 dark:text-red-300">OBWB Access Error</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-red-700 dark:text-red-400">
            <p>Failed to load OBWB user data. Please check your OBWB service access.</p>
            <p className="mt-2 text-xs">Error: {obwbUserError?.message || 'Unknown error'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Connect Email</h1>
        <p className="text-muted-foreground">
          Link your email account to get started
        </p>
      </div>

      {!hasObwbAccess() && (
        <Card className="max-w-md bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-sm text-red-800 dark:text-red-300">Access Required</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-red-700 dark:text-red-400">
            <p>OBWB service access is required to connect email accounts. Please contact your administrator to enable OBWB service access.</p>
          </CardContent>
        </Card>
      )}

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Email Connection</span>
          </CardTitle>
          <CardDescription>
            Connect your email account to access and manage your emails through
            our platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
              {error}
            </div>
          )}

          {isInitialLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Checking connection status...
                </p>
              </div>
            </div>
          ) : user?.microsoft_user_id === null ? (
            <div className="space-y-3">
              <Button
                onClick={handleConnectEmail}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Connect Email Account
                  </>
                )}
              </Button>

              {connectionStatus?.email && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <Mail className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      Previous connection found for:{" "}
                      <span className="font-medium">
                        {connectionStatus.email}
                      </span>
                    </p>
                  </div>
                  <Button
                    onClick={handleReconnect}
                    variant="outline"
                    className="w-full border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-950/30"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Reconnect to {connectionStatus.email}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Your email is already connected
                  </p>
                  {connectionStatus?.email && (
                    <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                      Connected to: {connectionStatus.email}
                    </p>
                  )}
                </div>
              </div>
              <Button
                onClick={handleDisconnectEmail}
                variant="outline"
                className="w-full border-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Disconnecting...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Disconnect Email
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

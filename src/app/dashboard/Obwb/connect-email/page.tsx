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
import { toast } from "sonner";
import { EmailConnectionResponse } from "@/types/api";

export default function ConnectEmailPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const { getUserByService, setMicrosoftUserId } = useAuthStore();
  const user = getUserByService('obwb');

  const [connectionStatus, setConnectionStatus] =
    useState<EmailConnectionResponse | null>(null);
  const handleConnectEmail = async () => {
    setIsLoading(true);
    setError("");

    try {
      const { auth_url, state } = await emailAPI.getAuthUrl();

      // Store state for verification later if needed
      localStorage.setItem("email-auth-state", state);

      // Redirect to the auth URL
      window.location.href = auth_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReconnect = async () => {
    try {
      const connectionStatus = await emailAPI.connectEmail(
        user?.id.toString() as string
      );
      if (connectionStatus.connected) {
        setMicrosoftUserId(connectionStatus.user_id);
        toast.success("Email connected successfully");
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
      await emailAPI.disconnectEmail(user?.microsoft_user_id as string);
      toast.success("Email disconnected successfully");
      setMicrosoftUserId('');
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
      const connectionStatus = await emailAPI.connectionStatus(
        user?.id.toString() as string
      );
      setConnectionStatus(connectionStatus);
    } catch (error) {
      console.error("Failed to get connection status:", error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    getConnectionStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.microsoft_user_id]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Connect Email</h1>
        <p className="text-muted-foreground">
          Link your email account to get started
        </p>
      </div>

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

              {!connectionStatus?.connected && connectionStatus?.email && (
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

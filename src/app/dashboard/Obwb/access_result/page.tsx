"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, XCircle, Mail, ArrowRight, MailCheck } from "lucide-react";
import { useAuthStore } from "@/lib/store";

function AccessResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setMicrosoftUserId, setObwbUser } = useAuthStore();

  const [status, setStatus] = useState<string | null>(null);
  const [syncedEmails, setSyncedEmails] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const s = searchParams.get("status");
    const u = searchParams.get("user_id");
    const e = searchParams.get("synced_emails");
    const ue = searchParams.get("user_email");
    setStatus(s);
    setSyncedEmails(e);
    setUserEmail(ue);
    if (s === "success" && u) {
      // Set both main user microsoft_user_id and create/update OBWB user
      setMicrosoftUserId(u);
      setObwbUser(u);
    }

    setIsProcessing(false);
  }, [searchParams, setMicrosoftUserId, setObwbUser]);

  const handleViewEmails = () => {
    router.push("/dashboard/emails");
  };

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  if (isProcessing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Processing your email connection...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Email Connection Result
        </h1>
        <p className="text-muted-foreground">
          {status === "success"
            ? "Your email account has been successfully connected!"
            : "There was an issue connecting your email account."}
        </p>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {status === "success" ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <span>
              {status === "success"
                ? "Connection Successful"
                : "Connection Failed"}
            </span>
          </CardTitle>
          <CardDescription>
            {status === "success"
              ? `Successfully synced ${
                  syncedEmails || 0
                } emails from your account.`
              : "Please try connecting your email account again."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "success" && (
            <div className="space-y-3">
              {syncedEmails && (
                <>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>Email: {userEmail}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MailCheck className="h-4 w-4" />
                    <span>Synced Emails: {syncedEmails}</span>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="flex flex-col space-y-2">
            {status === "success" && (
              <Button onClick={handleViewEmails} className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                View My Emails
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleGoToDashboard}
              className="w-full"
            >
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AccessResultPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccessResultContent />
    </Suspense>
  );
}

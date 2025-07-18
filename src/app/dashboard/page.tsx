"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Link, Sparkles, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const handleConnectEmail = () => {
    router.push("/dashboard/Obwb/connect-email");
  };

  const handleViewEmails = () => {
    router.push("/dashboard/Obwb/emails");
  };

  const handleAIDigest = () => {
    router.push("/dashboard/Obwb/ai-digest");
  };

  const handleFollowUps = () => {
    router.push("/dashboard/Obwb/follow-ups");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your email management dashboard
        </p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Quick Actions</CardTitle>
          <CardDescription className="text-muted-foreground">
            Get started with email management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Button
              onClick={handleConnectEmail}
              variant="outline"
              size="default"
              className="h-auto p-4 flex-col items-start space-y-3 hover:border-cyan/50 hover:bg-cyan/5 transition-colors w-full"
            >
              <div className="flex items-center space-x-3 w-full">
                <div className="p-2 bg-cyan/10 rounded-lg shrink-0">
                  <Link className="h-6 w-6" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <div className="font-medium text-foreground truncate">
                    Connect Email
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    Link your email account to get started
                  </div>
                </div>
              </div>
            </Button>

            <Button
              onClick={handleViewEmails}
              variant="outline"
              size="default"
              className="h-auto p-4 flex-col items-start space-y-3 hover:border-cyan/50 hover:bg-cyan/5 transition-colors w-full"
            >
              <div className="flex items-center space-x-3 w-full">
                <div className="p-2 bg-cyan/10 rounded-lg shrink-0">
                  <Mail className="h-6 w-6" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <div className="font-medium text-foreground truncate">
                    View Emails
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    Access and manage your email inbox
                  </div>
                </div>
              </div>
            </Button>

            <Button
              onClick={handleAIDigest}
              variant="outline"
              size="default"
              className="h-auto p-4 flex-col items-start space-y-3 hover:border-cyan/50 hover:bg-cyan/5 transition-colors w-full"
            >
              <div className="flex items-center space-x-3 w-full">
                <div className="p-2 bg-cyan/10 rounded-lg shrink-0">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <div className="font-medium text-foreground truncate">
                    AI Digest
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    Generate comprehensive email summaries
                  </div>
                </div>
              </div>
            </Button>

            <Button
              onClick={handleFollowUps}
              variant="outline"
              size="default"
              className="h-auto p-4 flex-col items-start space-y-3 hover:border-cyan/50 hover:bg-cyan/5 transition-colors w-full"
            >
              <div className="flex items-center space-x-3 w-full">
                <div className="p-2 bg-cyan/10 rounded-lg shrink-0">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <div className="font-medium text-foreground truncate">
                    Follow-ups
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    Track emails requiring responses
                  </div>
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

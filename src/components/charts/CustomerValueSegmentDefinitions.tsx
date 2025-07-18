"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCustomerData } from "@/components/providers/data-provider";
import { cn } from "@/lib/utils";
import {
  Crown,
  DollarSign,
  TrendingUp,
  UserCheck,
  UserMinus,
} from "lucide-react";

export interface CustomerTier {
  tier: string;
  spendingRange: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
}

export interface CustomerHierarchyCardProps {
  tiers?: CustomerTier[];
  className?: string;
}

const defaultTiers: CustomerTier[] = [
  {
    tier: "Low Value",
    spendingRange: "AED 0 - 500",
    description: "New or occasional customers with minimal purchase history",
    icon: UserMinus,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/50",
    borderColor: "border-red-200 dark:border-red-800",
  },
  {
    tier: "Medium Value",
    spendingRange: "AED 500 - 1,500",
    description: "Regular customers with moderate purchase frequency",
    icon: UserCheck,
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/50",
    borderColor: "border-yellow-200 dark:border-yellow-800",
  },
  {
    tier: "High Value",
    spendingRange: "AED 1,500 - 3,000",
    description: "Valued customers with consistent high spending",
    icon: TrendingUp,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/50",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  {
    tier: "VIP",
    spendingRange: "AED 3,000+",
    description: "Premium customers requiring dedicated account management",
    icon: Crown,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/50",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
];

export function CustomerHierarchyCard({
  tiers = defaultTiers,
  className,
}: CustomerHierarchyCardProps) {
  const customerData = useCustomerData();
  if (!customerData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Customer Value Segment Definitions
          </h2>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {tiers.map((tier, index) => {
          const Icon = tier.icon;
          return (
            <Card
              key={index}
              className={cn(
                "transition-all duration-200 hover:shadow-md",
                tier.bgColor,
                tier.borderColor,
                "border"
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle
                    className={cn("text-base font-semibold", tier.color)}
                  >
                    {tier.tier}
                  </CardTitle>
                  <div className={cn("p-2 rounded-md", tier.bgColor)}>
                    <Icon className={cn("h-4 w-4", tier.color)} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    {tier.spendingRange}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tier.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Business Impact Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900/50">
              <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            Business Impact Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">
            <span className="font-semibold text-foreground">
              VIP customers (13.25%)
            </span>{" "}
            generate{" "}
            <span className="font-semibold text-foreground">
              55.1% of total revenue
            </span>
            , while{" "}
            <span className="font-semibold text-foreground">
              Low Value customers (19.43%)
            </span>{" "}
            contribute only{" "}
            <span className="font-semibold text-foreground">
              2.1% of revenue
            </span>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

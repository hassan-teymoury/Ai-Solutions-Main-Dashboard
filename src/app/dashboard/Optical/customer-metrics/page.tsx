"use client";
import React from "react";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { CustomerHierarchyCard } from "@/components/charts/CustomerValueSegmentDefinitions";
import { formatCompactNumber, formatNumber } from "@/lib/utils";
import {
  Users,
  TrendingUp,
  UserX,
  Crown,
  Repeat,
  Star,
  AlertCircleIcon,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CustomerValueSegmentationChart } from "@/components/charts/CustomerValueSegmentationChart";
import { CustomerRetentionCategoriesChart } from "@/components/charts/CustomerRetentionCategoriesChart";
import { RevenueContributionChart } from "@/components/charts/RevenueContributionChart";
import { CustomerLifetimeValueChart } from "@/components/charts/CustomerLifetimeValueChart";
import { CustomerAcquisitionTrendsChart } from "@/components/charts/CustomerAcquisitionTrendsChart";
import { Top15CustomersTable } from "@/components/tables/Top15CustomersTable";
import { CustomerStrategyRecommendationsCard } from "@/components/dashboard/RecommendationsCard";
import { useCustomerData } from "@/components/providers/data-provider";

export default function CustomerMetricsPage() {
  const customerData = useCustomerData();
  if (!customerData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground font-medium">
            Loading data...
          </p>
        </div>
      </div>
    );
  }
  const stats = [
    {
      title: "Total Customers",
      value: customerData.totalCustomers,
      subtitle: "151-day Analysis Period",
      icon: Users,
      iconColor: "text-blue-600",
      formatValue: formatNumber,
    },
    {
      title: "Average CLV",
      value: customerData.averageCLV,
      subtitle: "Customer Lifetime Value",
      icon: TrendingUp,
      iconColor: "text-green-600",
      valuePrefix: "AED ",
      formatValue: formatNumber,
    },
    {
      title: "One-time Buyers",
      value: customerData.oneTimeBuyerRate,
      subtitle: "Retention Challenge",
      icon: UserX,
      iconColor: "text-red-600",
      valueSuffix: "%",
    },
    {
      title: "VIP Customers",
      value: customerData.vipCustomers,
      subtitle: `${(
        (customerData.vipCustomers / customerData.totalCustomers) *
        100
      ).toFixed(1)}% of Customer Base`,
      icon: Crown,
      iconColor: "text-yellow-600",
      formatValue: formatNumber,
    },
    {
      title: "Retention Rate",
      value: customerData.retentionRate,
      subtitle: "Multiple Orders",
      icon: Repeat,
      iconColor: "text-purple-600",
      valueSuffix: "%",
    },
    {
      title: "Top Customer",
      value: customerData.topCustomers[0].spent,
      subtitle: customerData.topCustomers[0].name,
      icon: Star,
      iconColor: "text-orange-600",
      valuePrefix: "AED ",
      formatValue: formatCompactNumber,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <StatsGrid stats={stats} />

      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Critical Customer Insights - Action Required</AlertTitle>
        <AlertDescription>
          <ul className="list-disc list-inside">
            <li>
              <b>High One-time Buyer Rate (83.46%):</b> Major retention
              opportunity - converting just 10% of one-time buyers would double
              loyal customer base.
            </li>
            <li>
              <b>VIP Customer Concentration:</b> Only 13.25% VIP customers
              generate 55.1% of total revenue - protect and expand this segment.
            </li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Customer Hierarchy Section */}
      <CustomerHierarchyCard />

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Customer Value Segmentation Chart */}
        <CustomerValueSegmentationChart />
        {/* Customer Retention Categories Chart */}
        <CustomerRetentionCategoriesChart />
      </div>

      {/* Revenue Contribution Chart */}
      <RevenueContributionChart />

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Customer Lifetime Value Chart */}
        <CustomerLifetimeValueChart />
        {/* Customer Acquisition Trends Chart */}
        <CustomerAcquisitionTrendsChart />
      </div>

      {/* Top 15 Customers Table */}
      <Top15CustomersTable />

      {/* Customer Strategy Recommendations Card */}
      <CustomerStrategyRecommendationsCard />
    </div>
  );
}

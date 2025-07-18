"use client";
import React from "react";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { formatCompactNumber, formatNumber } from "@/lib/utils";
import {
  Users,
  DollarSign,
  ReceiptText,
  Trophy,
  BarChart3,
  Target,
  AlertCircleIcon,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Top10StaffSalesChart } from "@/components/charts/Top10StaffSalesChart";
import { StaffPerformanceDistributionChart } from "@/components/charts/StaffPerformanceDistributionChart";
import { RevenueShareQuartileChart } from "@/components/charts/RevenueShareQuartileChart";
import { Top10DailySalesProductivityChart } from "@/components/charts/Top10DailySalesProductivityChart";
import { Top10ProfitabilityLeadersChart } from "@/components/charts/Top10ProfitabilityLeadersChart";
import { Top15SalesPerformanceTable } from "@/components/tables/Top15SalesPerformanceTable";
import { StaffPerformanceRecommendationsCard } from "@/components/dashboard/RecommendationsCard";
import { useStaffData } from "@/components/providers/data-provider";

export default function StaffPerformancePage() {
  const staffPerformanceData = useStaffData();
  if (!staffPerformanceData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground font-medium">
            Loading...
          </p>
        </div>
      </div>
    );
  }
  const stats = [
    {
      title: "Total Staff",
      value: staffPerformanceData.company_totals.total_staff,
      subtitle: "Sales Staff Analyzed",
      icon: Users,
      iconColor: "text-blue-600",
    },
    {
      title: "Company Sales",
      value: staffPerformanceData.company_totals.total_sales,
      subtitle: "Total Sales Revenue",
      icon: DollarSign,
      iconColor: "text-green-600",
      valuePrefix: "AED ",
      formatValue: formatCompactNumber,
    },
    {
      title: "Total Transactions",
      value: staffPerformanceData.company_totals.total_transactions,
      subtitle: "Transactions Processed",
      icon: ReceiptText,
      iconColor: "text-purple-600",
      formatValue: formatNumber,
    },
    {
      title: "Top Performer",
      value: staffPerformanceData.company_totals.top_performer.name,
      subtitle: `${formatCompactNumber(
        staffPerformanceData.company_totals.top_performer.sales,
        2
      )} Sales`,
      icon: Trophy,
      iconColor: "text-yellow-600",
      valuePrefix: "AED ",
    },
    {
      title: "Average Sales",
      value: staffPerformanceData.company_totals.average_sales_per_staff,
      subtitle: "Per Staff Member",
      icon: BarChart3,
      iconColor: "text-cyan-600",
      valuePrefix: "AED ",
      formatValue: formatCompactNumber,
    },
    {
      title: "Performance Gap",
      value: formatNumber(
        staffPerformanceData.company_totals.performance_gap,
        0
      ),
      subtitle: "Top vs Bottom Performer",
      icon: Target,
      iconColor: "text-red-600",
      valueSuffix: "x",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <StatsGrid stats={stats} />

      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>
          Critical Staff Performance Insights - Action Required
        </AlertTitle>
        <AlertDescription>
          <ul className="list-disc list-inside">
            <li>
              <b>Extreme Performance Concentration:</b> Top 3 performers (2.9%)
              generate 20.74% of total company sales - RESSIE DARAMAN alone
              accounts for 13.00%
            </li>
            <li>
              <b>Significant Performance Gap:</b> 43,696x difference between top
              performer (AED 5.41M) and bottom performer indicates massive
              training and development opportunities
            </li>
            <li>
              <b>Quartile Distribution Issue:</b> Bottom 25% of staff (26
              members) generate only 1.8% of total revenue while top 25%
              generate 61.0%
            </li>
          </ul>
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Top10StaffSalesChart />
        <StaffPerformanceDistributionChart />
      </div>

      <RevenueShareQuartileChart />

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Top10DailySalesProductivityChart />
        <Top10ProfitabilityLeadersChart />
      </div>

      <Top15SalesPerformanceTable />

      <StaffPerformanceRecommendationsCard />
    </div>
  );
}

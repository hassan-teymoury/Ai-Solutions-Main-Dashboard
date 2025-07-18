"use client";

import { AverageTransactionLineChart } from "@/components/charts/AverageTransactionLineChart";
import { BranchPerformanceTable } from "@/components/tables/BranchPerformanceTable";
import { ProfitMarginPieChart } from "@/components/charts/ProfitMarginPieChart";
import { DefaultRecommendationsCard } from "@/components/dashboard/RecommendationsCard";
import { ReturnRateBarChart } from "@/components/charts/ReturnRateBarChart";
import { RevenueProfitScatterChart } from "@/components/charts/RevenueProfitScatterChart";
import { Top10RevenueChart } from "@/components/charts/Top10RevenueChart";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { useBranchPerformanceData } from "@/lib/store";
import { formatCompactNumber, formatNumber } from "@/lib/utils";
import {
  AlertCircleIcon,
  DollarSign,
  IterationCcw,
  PieChart,
  ReceiptText,
  Store,
  TriangleAlert,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function BranchPerformancePage() {
  const branchPerformanceData = useBranchPerformanceData();

  // Show loading if data is not available
  if (!branchPerformanceData) {
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
      title: "Total Transactions",
      value: branchPerformanceData.totalTransactions,
      subtitle: `${branchPerformanceData.validRecords}% Valid Records`,
      icon: ReceiptText,
      iconColor: "text-blue-600",
      formatValue: formatNumber,
    },
    {
      title: "Total Revenue",
      value: branchPerformanceData.totalRevenue,
      subtitle: "Gross Sales Revenue",
      icon: DollarSign,
      iconColor: "text-green-600",
      valuePrefix: "AED ",
      formatValue: formatCompactNumber,
    },
    {
      title: "Profit Margin",
      value: branchPerformanceData.profitMargin,
      subtitle: "Overall Company",
      icon: PieChart,
      iconColor: "text-yellow-600",
      valueSuffix: "%",
    },
    {
      title: "Return Rate",
      value: branchPerformanceData.returnRate,
      subtitle: "Company-wide Average",
      icon: IterationCcw,
      iconColor: "text-red-600",
      valueSuffix: "%",
    },
    {
      title: "Active Branches",
      value: branchPerformanceData.activeBranches,
      subtitle: "Locations Analyzed",
      icon: Store,
      iconColor: "text-purple-600",
    },
    {
      title: "Return Impact",
      value: formatCompactNumber(branchPerformanceData.returnImpact, 2),
      subtitle: `${branchPerformanceData.revenueLoss}% Revenue Loss`,
      icon: TriangleAlert,
      iconColor: "text-orange-600",
      valuePrefix: "AED ",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <StatsGrid stats={stats} />
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Critical Alerts - Immediate Action Required</AlertTitle>
        <AlertDescription>
          <ul className="list-disc list-inside">
            <li>
              <b>High Return Rate Branches:</b> INSUR (102.91%), INS (100.86%),
              ECOM (9.97%)
            </li>
            <li>
              These branches require urgent investigation for quality control
              and customer service improvement.
            </li>
          </ul>
        </AlertDescription>
      </Alert>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Top 10 Branches by Sales Revenue */}
        <Top10RevenueChart />
        {/* Profit Margin by Branch */}
        <ProfitMarginPieChart />
      </div>
      <div>
        {/* Return Rate by Branch */}
        <ReturnRateBarChart />
      </div>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Average Transaction by Branch */}
        <AverageTransactionLineChart />
        {/* Revenue vs Profit by Branch */}
        <RevenueProfitScatterChart />
      </div>
      <div>
        <BranchPerformanceTable />
      </div>
      <div>
        <DefaultRecommendationsCard />
      </div>
    </div>
  );
}

"use client";
import { BrandRevenueMarginScatterChart } from "@/components/charts/BrandRevenueMarginScatterChart";
import { CategoryMarginLineChart } from "@/components/charts/CategoryMarginLineChart";
import { CategoryRevenuePieChart } from "@/components/charts/CategoryRevenuePieChart";
import { PricePointRevenueChart } from "@/components/charts/PricePointRevenueChart";
import { TopBrandsPerformanceChart } from "@/components/charts/TopBrandsPerformanceChart";
import { InventoryStrategicRecommendationsCard } from "@/components/dashboard/RecommendationsCard";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { useInventoryData } from "@/components/providers/data-provider";
import { CategoryPerformanceTable } from "@/components/tables/CategoryPerformanceTable";
import { TopProductsTable } from "@/components/tables/TopProductsTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatCompactNumber } from "@/lib/utils";
import {
  AlertCircleIcon,
  AlertTriangle,
  Award,
  Database,
  DollarSign,
  Package,
  TrendingUp,
} from "lucide-react";

export default function InventoryPage() {
  const inventoryData = useInventoryData();
  if (!inventoryData) {
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
      title: "Product Portfolio",
      value: inventoryData.totalProductPortfolio.toLocaleString(),
      subtitle: `Unique Items | ${inventoryData.totalBrands} Brands`,
      icon: Package,
      iconColor: "text-blue-600",
    },
    {
      title: "Total Revenue",
      value: `AED ${formatCompactNumber(inventoryData.totalRevenue)}`,
      subtitle: "Product Sales Revenue",
      icon: DollarSign,
      iconColor: "text-green-600",
    },
    {
      title: "Data Quality",
      value: `${inventoryData.dataQuality}%`,
      subtitle: `${inventoryData.validRecords.toLocaleString()} Valid Records`,
      icon: Database,
      iconColor: "text-purple-600",
    },
    {
      title: "Top Category",
      value: inventoryData.categories[0].name,
      subtitle: `${inventoryData.categories[0].marketShare}% Market Share`,
      icon: TrendingUp,
      iconColor: "text-orange-600",
    },
    {
      title: "Top Brand",
      value: inventoryData.topBrands[0].name,
      subtitle: `${inventoryData.topBrands[0].brandScore} Performance Score`,
      icon: Award,
      iconColor: "text-yellow-600",
    },
    {
      title: "Market Concentration",
      value: `${inventoryData.categories[0].marketShare}%`,
      subtitle: `${inventoryData.categories[0].name} Dominance Risk`,
      icon: AlertTriangle,
      iconColor: "text-red-600",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <StatsGrid stats={stats} />

      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Critical Inventory Insights - Action Required</AlertTitle>
        <AlertDescription>
          <ul className="list-disc list-inside">
            <li>
              <b>Category Concentration Risk:</b> SUNGLASS dominates with 57.25%
              market share - diversification needed to reduce dependency
            </li>
            <li>
              <b>Premium Market Opportunity:</b> Exclusive price range (1500+)
              generates 40.09% of revenue - focus on high-margin products
            </li>
            <li>
              <b>Brand Performance Gap:</b> RAYBAN leads with 93.01 score while
              many brands underperform - optimize brand portfolio
            </li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryRevenuePieChart />
        <TopBrandsPerformanceChart />
      </div>

      <PricePointRevenueChart />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryMarginLineChart />
        <BrandRevenueMarginScatterChart />
      </div>

      <TopProductsTable />
      <CategoryPerformanceTable />
      <InventoryStrategicRecommendationsCard />
    </div>
  );
}

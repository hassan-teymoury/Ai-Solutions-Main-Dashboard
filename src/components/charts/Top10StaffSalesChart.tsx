"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useStaffData } from "../providers/data-provider";

const chartConfig = {
  sales: {
    label: "Total Sales",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export function Top10StaffSalesChart() {
  const staffPerformanceData = useStaffData();
  if (!staffPerformanceData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  const chartData = staffPerformanceData.top_performers.top_sales_performers
    .slice(0, 10)
    .map((staff) => ({
      name: `${staff.Sales_Person.split(" ")[0]} ${staff.Sales_Person.split(" ")[1]}`,
      sales: staff.Total_Sales / 1000000, // Convert to millions
      transactions: staff.Total_Transactions,
      dailySales: staff.Daily_Sales,
      marketShare: staff.Market_Share_Percentage,
      performanceClass: staff.Performance_Class,
    }));

  // Calculate max value for Y axis with margin
  const maxSales = Math.max(...chartData.map((item) => item.sales));
  const yAxisMax = maxSales * 1.1;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 Staff by Sales Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              angle={-30}
              textAnchor="end"
              height={80}
            />
            <YAxis
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => `AED ${value.toFixed(1)}M`}
              domain={[0, yAxisMax]}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useStaffData } from "@/components/providers/data-provider";

const chartConfig = {
  revenueShare: {
    label: "Revenue Share",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export function RevenueShareQuartileChart() {
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
  const chartData = Object.entries(staffPerformanceData.quartile_analysis).map(
    ([quartile, data]) => ({
      quartile: quartile.replace(" (", "\n("),
      revenueShare: data.revenue_share,
      count: data.count,
      averageSales: data.average_sales / 1000000, // Convert to millions
      totalSales: data.total_sales / 1000000, // Convert to millions
    })
  );

  const yAxisMax =
    Math.max(...chartData.map((item) => item.revenueShare)) * 1.1;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Share by Performance Quartile</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="quartile"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => `${value.toFixed(1)}%`}
              domain={[0, yAxisMax]}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="revenueShare"
              fill="var(--color-revenueShare)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

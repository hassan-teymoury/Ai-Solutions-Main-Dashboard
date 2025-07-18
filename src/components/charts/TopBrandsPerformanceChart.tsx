"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useInventoryData } from "@/components/providers/data-provider";

const chartConfig = {
  performanceScore: {
    label: "Performance Score",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export function TopBrandsPerformanceChart() {
  const inventoryData = useInventoryData();
  if (!inventoryData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  const chartData = inventoryData.topBrands.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 Brands by Performance Score</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 8)}
            />
            <YAxis
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => `${value.toFixed(0)}`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="brandScore"
              fill="var(--color-performanceScore)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

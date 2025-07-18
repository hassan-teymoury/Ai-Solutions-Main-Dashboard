"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useCustomerData } from "@/components/providers/data-provider";

const chartConfig = {
  count: {
    label: "Count",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export function CustomerRetentionCategoriesChart() {
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
  const chartData = Object.entries(customerData.retention).map(
    ([key, value]) => ({
      category: key,
      percentage: value.percentage,
      count: value.count,
      revenue: value.revenue,
      avgRevenue: value.avgRevenue,
    })
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Retention Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              angle={-20}
              textAnchor="end"
              height={85}
            />
            <YAxis
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

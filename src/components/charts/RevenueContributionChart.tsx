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
  revenue: {
    label: "Revenue",
    color: "#3b82f6",
  },
} satisfies ChartConfig;

export function RevenueContributionChart() {
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

  const chartData = customerData.segments.map((segment) => ({
    segment: segment.name,
    revenue: segment.revenue / 1000000, // Convert to millions
    percentage: segment.percentage,
    avgRevenue: segment.avgRevenue,
  }));
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Contribution by Customer Segment</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="segment"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              angle={-20}
              textAnchor="end"
              height={45}
            />
            <YAxis
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => `AED ${value.toFixed(0)}M`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

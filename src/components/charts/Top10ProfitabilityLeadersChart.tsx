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
  avgProfitPercentage: {
    label: "Average Profit %",
    color: "#dc2626",
  },
} satisfies ChartConfig;

export function Top10ProfitabilityLeadersChart() {
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
  const chartData =
    staffPerformanceData.top_performers.top_profitability_leaders
      .slice(0, 10)
      .map((staff) => ({
        name: `${staff.Sales_Person.split(" ")[0]} ${staff.Sales_Person.split(" ")[1]}`,
        avgProfitPercentage: staff.Average_Profit_Percentage,
        weightedProfitPercentage: staff.Revenue_Weighted_Profit_Percentage,
        totalSales: staff.Total_Sales,
      }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 Profitability Leaders</CardTitle>
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
              height={85}
            />
            <YAxis
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => `${value.toFixed(0)}%`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="avgProfitPercentage"
              fill="var(--color-avgProfitPercentage)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

"use client";

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useStaffData } from "@/components/providers/data-provider";

const chartConfig = {
  dailySales: {
    label: "Daily Sales",
    color: "#059669",
  },
} satisfies ChartConfig;

export function Top10DailySalesProductivityChart() {
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
  const chartData = staffPerformanceData.top_performers.top_productivity_leaders
    .slice(0, 10)
    .map((staff) => ({
      name: `${staff.Sales_Person.split(" ")[0]} ${staff.Sales_Person.split(" ")[1]}`,
      dailySales: staff.Daily_Sales,
      salesPerTransaction: staff.Sales_Per_Transaction,
      transactionsPerDay: staff.Transactions_Per_Day,
      itemsPerDay: staff.Items_Per_Day,
    }));
  const yAxisMax = Math.max(...chartData.map((item) => item.dailySales)) * 1.1;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 Daily Sales Productivity</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <LineChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              angle={-40}
              textAnchor="end"
              height={85}
            />
            <YAxis
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => `AED ${value.toFixed(0)}`}
              domain={[0, yAxisMax]}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              dataKey="dailySales"
              stroke="var(--color-dailySales)"
              strokeWidth={3}
              dot={{ fill: "var(--color-dailySales)", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

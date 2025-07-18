"use client";

import {
  Scatter,
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ZAxis,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useBranchData } from "@/components/providers/data-provider";

const chartConfig = {
  revenue: {
    label: "Revenue (M AED)",
    color: "#2563eb",
  },
  profit: {
    label: "Profit (M AED)",
    color: "#16a34a",
  },
} satisfies ChartConfig;

export function RevenueProfitScatterChart() {
  const branchPerformanceData = useBranchData();
  
  if (!branchPerformanceData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  
  const chartData = branchPerformanceData.branches
    .slice(0, 10)
    .map((branch) => ({
      name: branch.name,
      revenue: branch.revenue / 1000000, // Convert to millions
      profit: branch.profit / 1000000, // Convert to millions
      profitMargin: branch.profitMargin,
      transactions: branch.transactions,
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue vs Profit by Branch</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid vertical={false} />
              <XAxis
                type="number"
                dataKey="revenue"
                name="Revenue"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => `AED ${value.toFixed(0)}M`}
              />
              <YAxis
                type="number"
                dataKey="profit"
                name="Profit"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => `AED ${value.toFixed(0)}M`}
              />
              <ZAxis type="number" dataKey="transactions" range={[20, 100]} />
              <ChartTooltip />
              <Scatter
                data={chartData}
                fill="var(--color-revenue)"
                shape="circle"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

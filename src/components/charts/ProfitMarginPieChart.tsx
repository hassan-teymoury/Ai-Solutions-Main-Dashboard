"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useBranchData } from "@/components/providers/data-provider";
import { formatCompactNumber } from "@/lib/utils";

// رنگ‌های مختلف برای هر شعبه
const COLORS = [
  "#2563eb",
  "#dc2626",
  "#16a34a",
  "#ea580c",
  "#7c3aed",
  "#0891b2",
  "#be185d",
  "#059669",
  "#d97706",
  "#7c2d12",
  "#1e40af",
  "#b91c1c",
  "#15803d",
  "#c2410c",
  "#6d28d9",
];

const chartConfig = {
  profitMargin: {
    label: "Profit Margin",
    color: "#2563eb",
  },
} satisfies ChartConfig;

export function ProfitMarginPieChart() {
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
    .slice(0, 8)
    .map((branch, index) => ({
      name: branch.name,
      profitMargin: branch.profitMargin,
      revenue: branch.revenue,
      color: COLORS[index % COLORS.length],
    }));
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profit Margin by Branch</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="profitMargin"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Branch
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {data.name}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Profit Margin
                            </span>
                            <span className="font-bold">
                              {data.profitMargin.toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Revenue
                            </span>
                            <span className="font-bold">
                              AED {formatCompactNumber(data.revenue, 2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                align="right"
                verticalAlign="middle"
                layout="vertical"
                iconType="circle"
                iconSize={12}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

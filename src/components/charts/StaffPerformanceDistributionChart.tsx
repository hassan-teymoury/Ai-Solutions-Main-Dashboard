"use client";

import {
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useStaffData } from "@/components/providers/data-provider";

const COLORS = {
  "Q4 (Top 25%)": "#10b981",
  "Q3 (Upper Middle 25%)": "#3b82f6",
  "Q2 (Lower Middle 25%)": "#f59e0b",
  "Q1 (Bottom 25%)": "#ef4444",
};

export function StaffPerformanceDistributionChart() {
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
      name: quartile,
      value: data.count,
      percentage: data.percentage,
      totalSales: data.total_sales,
      averageSales: data.average_sales,
      revenueShare: data.revenue_share,
    })
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Performance Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.name as keyof typeof COLORS] || "#6b7280"}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Quartile
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {data.name}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Staff Count
                          </span>
                          <span className="font-bold">{data.value} staff</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Percentage
                          </span>
                          <span className="font-bold">{data.percentage}%</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Revenue Share
                          </span>
                          <span className="font-bold">
                            {data.revenueShare.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Avg Sales
                          </span>
                          <span className="font-bold">
                            AED {(data.averageSales / 1000000).toFixed(1)}M
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

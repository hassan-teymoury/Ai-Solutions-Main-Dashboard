"use client";

import {
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCustomerData } from "@/components/providers/data-provider";

export function CustomerValueSegmentationChart() {
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
  const chartData = customerData.segments.map((segment) => {
    // Map colors based on segment name to ensure correct assignment
    let color;
    switch (segment.name) {
      case "VIP":
        color = "#8b5cf6"; // Purple for VIP
        break;
      case "High Value":
        color = "#3b82f6"; // Blue for High Value
        break;
      case "Medium Value":
        color = "#f59e0b"; // Yellow for Medium Value
        break;
      case "Low Value":
        color = "#ef4444"; // Red for Low Value
        break;
      default:
        color = "#6b7280"; // Gray for unknown
    }

    return {
      name: segment.name,
      value: segment.count,
      percentage: segment.percentage,
      revenue: segment.revenue,
      color: color,
    };
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Value Segmentation</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
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
                            Segment
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {data.name}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Customers
                          </span>
                          <span className="font-bold">
                            {data.value.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Percentage
                          </span>
                          <span className="font-bold">
                            {data.percentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Revenue
                          </span>
                          <span className="font-bold">
                            AED {(data.revenue / 1000000).toFixed(1)}M
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
      </CardContent>
    </Card>
  );
}

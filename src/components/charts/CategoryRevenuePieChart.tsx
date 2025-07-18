"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useInventoryData } from "@/components/providers/data-provider";

const COLORS = {
  SUNGLASS: "#10b981",
  LENS: "#3b82f6",
  FRAME: "#f59e0b",
  "CONTACT LENS": "#8b5cf6",
  SERVICE: "#ef4444",
  "MEDICAL LENS": "#06b6d4",
  READING: "#84cc16",
  MICELLANEOUS: "#f97316",
};

export function CategoryRevenuePieChart() {
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

  const chartData = inventoryData.categories.slice(0, 8).map((category) => ({
    name: category.name,
    value: category.revenue,
    percentage: category.marketShare,
    quantity: category.quantity,
    margin: category.margin,
    performanceScore: category.performanceScore,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Best-Selling Categories by Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
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
                            Category
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {data.name}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Revenue
                          </span>
                          <span className="font-bold">
                            AED {(data.value / 1000000).toFixed(1)}M
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Market Share
                          </span>
                          <span className="font-bold">{data.percentage}%</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Quantity Sold
                          </span>
                          <span className="font-bold">
                            {data.quantity.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Profit Margin
                          </span>
                          <span className="font-bold">{data.margin}%</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Performance Score
                          </span>
                          <span className="font-bold">
                            {data.performanceScore.toFixed(1)}
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

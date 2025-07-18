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
import { useInventoryData } from "@/components/providers/data-provider"

const chartConfig = {
  revenue: {
    label: "Revenue (M AED)",
    color: "#2563eb",
  },
  margin: {
    label: "Margin (%)",
    color: "#16a34a",
  },
} satisfies ChartConfig;

export function BrandRevenueMarginScatterChart() {
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

  const chartData = inventoryData.topBrands.slice(0, 15).map((brand) => ({
    name: brand.name,
    revenue: brand.revenue / 1000000, // Convert to millions
    margin: brand.margin,
    performanceScore: brand.brandScore,
    varieties: brand.varieties,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Brands: Revenue vs Margin Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="revenue"
                name="Revenue"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => `${value.toFixed(1)}`}
                label={{
                  value: "Revenue (M AED)",
                  position: "bottom",
                  offset: 0,
                }}
              />
              <YAxis
                type="number"
                dataKey="margin"
                name="Margin"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => `${value.toFixed(0)}%`}
                label={{
                  value: "Profit Margin (%)",
                  angle: -90,
                  position: "left",
                }}
              />
              <ZAxis
                type="number"
                dataKey="performanceScore"
                range={[60, 400]}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Brand
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {data.name}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Revenue
                            </span>
                            <span className="font-bold text-blue-600">
                              AED {data.revenue.toFixed(1)}M
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Margin
                            </span>
                            <span className="font-bold text-green-600">
                              {data.margin}%
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Performance Score
                            </span>
                            <span className="font-bold">
                              {data.performanceScore.toFixed(1)}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Product Varieties
                            </span>
                            <span className="font-bold">{data.varieties}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter
                data={chartData}
                fill="var(--color-revenue)"
                name="Revenue vs Margin"
              >
                {chartData.map((entry, index) => (
                  <circle
                    key={`point-${index}`}
                    cx={entry.revenue}
                    cy={entry.margin}
                    r={Math.max(4, entry.performanceScore / 10)}
                    fill={
                      entry.margin > 50
                        ? "#16a34a"
                        : entry.margin > 30
                        ? "#f59e0b"
                        : "#dc2626"
                    }
                    stroke="#fff"
                    strokeWidth={1}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

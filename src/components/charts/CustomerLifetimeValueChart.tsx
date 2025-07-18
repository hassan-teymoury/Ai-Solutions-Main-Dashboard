"use client";

import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { useCustomerData } from "@/components/providers/data-provider";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const chartConfig = {
  avgRevenue: {
    label: "Average Revenue",
    color: "#10b981",
  },
} satisfies ChartConfig;

export function CustomerLifetimeValueChart() {
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
    avgRevenue: segment.avgRevenue,
    count: segment.count,
    revenue: segment.revenue,
  }));
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Lifetime Value by Segment</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
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
                tickFormatter={(value) => `AED ${value.toFixed(0)}`}
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
                              Segment
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {data.segment}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Avg CLV
                            </span>
                            <span className="font-bold">
                              AED {data.avgRevenue.toFixed(0)}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Customers
                            </span>
                            <span className="font-bold">
                              {data.count.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Total Revenue
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
              <Line
                type="monotone"
                dataKey="avgRevenue"
                stroke="var(--color-avgRevenue)"
                strokeWidth={3}
                dot={{ fill: "var(--color-avgRevenue)", strokeWidth: 2, r: 4 }}
                activeDot={{
                  r: 6,
                  stroke: "var(--color-avgRevenue)",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

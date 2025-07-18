"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useInventoryData } from "@/components/providers/data-provider";
import { formatCompactNumber } from "@/lib/utils";

const chartConfig = {
  revenue: {
    label: "Revenue (AED)",
    color: "#2563eb",
  },
  marketShare: {
    label: "Market Share (%)",
    color: "#16a34a",
  },
} satisfies ChartConfig;

export function PricePointRevenueChart() {
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
  
  const chartData = inventoryData.pricePoints;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Distribution by Price Point</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="range"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              angle={-30}
              textAnchor="end"
              height={85}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              tickMargin={-15}
              axisLine={false}
              tickFormatter={(value) => `AED ${formatCompactNumber(value, 2)}`}
              label={{
                value: "Revenue (AED)",
                position: "insideLeft",
                offset: 10,
                angle: -90,
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              tickMargin={-15}
              axisLine={false}
              tickFormatter={(value) => `${value.toFixed(0)}%`}
              label={{
                value: "Market Share (%)",
                position: "insideRight",
                offset: 0,
                angle: 90,
              }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              yAxisId="left"
              dataKey="revenue"
              fill="var(--color-revenue)"
              radius={4}
            />
            <Bar
              yAxisId="right"
              dataKey="marketShare"
              fill="var(--color-marketShare)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

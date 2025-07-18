"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useCustomerData } from "@/components/providers/data-provider";

const chartData = [
  {
    period: "Early Period\n(Jan-Mar)",
    customerCount: 9313,
    avgCLV: 589.78,
  },
  {
    period: "Late Period\n(Apr-May)",
    customerCount: 9050,
    avgCLV: 700.89,
  },
];

const chartConfig = {
  customerCount: {
    label: "Customer Count",
    color: "#3498db",
  },
  avgCLV: {
    label: "Avg CLV (AED)",
    color: "#e74c3c",
  },
} satisfies ChartConfig;

export function CustomerAcquisitionTrendsChart() {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Period Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="period"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              tickMargin={-15}
              axisLine={false}
              tickFormatter={(value) => value.toLocaleString()}
              label={{
                value: "Customer Count",
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
              tickFormatter={(value) => `AED ${value.toFixed(0)}`}
              label={{
                value: "Avg CLV (AED)",
                position: "insideRight",
                offset: 0,
                angle: 90,
              }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="customerCount"
              fill="var(--color-customerCount)"
              radius={4}
              yAxisId="left"
            />
            <Bar
              dataKey="avgCLV"
              fill="var(--color-avgCLV)"
              radius={4}
              yAxisId="right"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { formatCompactNumber } from "@/lib/utils";
import { useBranchData } from "@/components/providers/data-provider";

// Function to determine status based on performance metrics
const getStatus = (profitMargin: number, returnRate: number) => {
  if (profitMargin >= 50 && returnRate <= 2)
    return { text: "Excellent", color: "bg-green-100 text-green-800" };
  if (profitMargin >= 40 && returnRate <= 5)
    return { text: "Good", color: "bg-blue-100 text-blue-800" };
  if (profitMargin >= 30 && returnRate <= 8)
    return { text: "Average", color: "bg-yellow-100 text-yellow-800" };
  if (returnRate > 10)
    return { text: "Needs Attention", color: "bg-red-100 text-red-800" };
  return { text: "Fair", color: "bg-gray-100 text-gray-800" };
};

export function BranchPerformanceTable() {
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
  const tableData = branchPerformanceData.branches
    .sort((a, b) => b.revenue - a.revenue) // Sort by revenue descending
    .map((branch) => ({
      ...branch,
      status: getStatus(branch.profitMargin, branch.returnRate),
    }));
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comprehensive Branch Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Branch</TableHead>
                <TableHead className="font-semibold text-right">
                  Revenue (AED)
                </TableHead>
                <TableHead className="font-semibold text-right">
                  Net Revenue (AED)
                </TableHead>
                <TableHead className="font-semibold text-right">
                  Profit (AED)
                </TableHead>
                <TableHead className="font-semibold text-right">
                  Profit Margin (%)
                </TableHead>
                <TableHead className="font-semibold text-right">
                  Return Rate (%)
                </TableHead>
                <TableHead className="font-semibold text-center">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((branch) => (
                <TableRow key={branch.name} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{branch.name}</TableCell>
                  <TableCell className="text-right">
                    {formatCompactNumber(branch.revenue, 2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCompactNumber(branch.netRevenue, 2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCompactNumber(branch.profit, 2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        branch.profitMargin >= 50
                          ? "text-green-600 font-semibold"
                          : branch.profitMargin >= 40
                          ? "text-blue-600 font-semibold"
                          : branch.profitMargin >= 30
                          ? "text-yellow-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {branch.profitMargin.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        branch.returnRate <= 2
                          ? "text-green-600 font-semibold"
                          : branch.returnRate <= 5
                          ? "text-blue-600 font-semibold"
                          : branch.returnRate <= 8
                          ? "text-yellow-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {branch.returnRate.toFixed(2)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={branch.status.color}>
                      {branch.status.text}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

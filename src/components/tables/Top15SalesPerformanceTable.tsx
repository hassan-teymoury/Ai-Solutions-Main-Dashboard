"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCompactNumber, formatNumber } from "@/lib/utils";
import { useStaffData } from "@/components/providers/data-provider";

const getPerformanceClassColor = (performanceClass: string) => {
  switch (performanceClass) {
    case "Elite Performer":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "High Performer":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "Average Performer":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "Needs Improvement":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

export function Top15SalesPerformanceTable() {
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
  const tableData = staffPerformanceData.all_staff_performance
    .sort((a, b) => a.Sales_Rank - b.Sales_Rank)
    .slice(0, 15);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 15 Sales Performance Ranking</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Rank</TableHead>
                  <TableHead>Staff Member</TableHead>
                  <TableHead className="text-right">
                    Total Sales (AED)
                  </TableHead>
                  <TableHead className="text-right">
                    Daily Sales (AED)
                  </TableHead>
                  <TableHead className="text-right">Market Share (%)</TableHead>
                  <TableHead className="text-center">
                    Performance Class
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((staff) => (
                  <TableRow key={staff.Sales_Rank}>
                    <TableCell className="font-medium">
                      #{staff.Sales_Rank}
                    </TableCell>
                    <TableCell className="font-medium">
                      {staff.Sales_Person}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      AED {formatCompactNumber(staff.Total_Sales)}
                    </TableCell>
                    <TableCell className="text-right">
                      AED {formatNumber(staff.Daily_Sales)}
                    </TableCell>
                    <TableCell className="text-right">
                      {staff.Market_Share_Percentage.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={getPerformanceClassColor(
                          staff.Performance_Class
                        )}
                      >
                        {staff.Performance_Class}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

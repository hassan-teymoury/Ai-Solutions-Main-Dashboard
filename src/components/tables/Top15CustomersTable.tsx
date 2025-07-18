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
import { formatCompactNumber } from "@/lib/utils";
import { useCustomerData } from "@/components/providers/data-provider";

const getSegmentColor = (segment: string) => {
  switch (segment.toLowerCase()) {
    case "platinum":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    case "gold":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "silver":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    case "bronze":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    default:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
  }
};

export function Top15CustomersTable() {
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
  const tableData = customerData.topCustomers
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 15)
    .map((customer, index) => ({
      rank: index + 1,
      name: customer.name,
      totalSpent: customer.spent,
      transactions: customer.transactions,
      avgTransaction: customer.avgTransaction,
      frequency: customer.frequency,
      segment: customer.segment,
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 15 Customers by Lifetime Value</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Rank</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Total Spent</TableHead>
                  <TableHead className="text-right">Transactions</TableHead>
                  <TableHead className="text-right">Avg Transaction</TableHead>
                  <TableHead className="text-right">Frequency/Month</TableHead>
                  <TableHead className="text-center">Segment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((customer) => (
                  <TableRow key={customer.rank}>
                    <TableCell className="font-medium">
                      #{customer.rank}
                    </TableCell>
                    <TableCell className="font-medium">
                      {customer.name}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      AED {formatCompactNumber(customer.totalSpent, 2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {customer.transactions.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      AED {customer.avgTransaction.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {customer.frequency.toFixed(1)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={getSegmentColor(customer.segment)}>
                        {customer.segment}
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

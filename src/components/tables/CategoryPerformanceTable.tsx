"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useInventoryData } from "@/components/providers/data-provider";

export function CategoryPerformanceTable() {
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getPerformanceCategory = (score: number): string => {
    if (score >= 50.0) return "Market Leader";
    if (score >= 30.0) return "Strong Performer";
    if (score >= 5.0) return "Growth Opportunity";
    return "Niche Product";
  };

  const getPerformanceBadgeVariant = (score: number) => {
    if (score >= 50.0) return "bg-green-500 text-white border-green-200";
    if (score >= 30.0) return "bg-blue-500 text-white border-blue-200";
    if (score >= 5.0) return "bg-yellow-500 text-white border-yellow-200";
    return "bg-red-500 text-white border-red-200";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Category Performance Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">Quantity Sold</TableHead>
              <TableHead className="text-right">Market Share</TableHead>
              <TableHead className="text-right">Profit Margin</TableHead>
              <TableHead className="text-right">Performance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryData.categories.slice(0, 10).map((category) => (
              <TableRow key={category.name}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(category.revenue)}
                </TableCell>
                <TableCell className="text-right">
                  {category.quantity.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {category.marketShare}%
                </TableCell>
                <TableCell className="text-right">
                  {category.margin}%
                </TableCell>
                <TableCell className="text-right">
                  <Badge className={getPerformanceBadgeVariant(category.performanceScore)}>
                    {getPerformanceCategory(category.performanceScore)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 
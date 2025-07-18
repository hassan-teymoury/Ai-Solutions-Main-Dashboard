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
import { useInventoryData } from "@/components/providers/data-provider";
import { formatCompactNumber } from "@/lib/utils";

export function TopProductsTable() {
  const inventoryData = useInventoryData();
  console.log(inventoryData);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Top 10 Individual Products by Sales
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Qty Sold</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryData.topProducts
              .sort((a, b) => a.rank - b.rank)
              .slice(0, 10)
              .map((product) => (
                <TableRow key={product.rank}>
                  <TableCell className="font-medium">{product.rank}</TableCell>
                  <TableCell
                    className="max-w-[200px] truncate"
                    title={product.name}
                  >
                    {product.name}
                  </TableCell>
                  <TableCell>{product.brand}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right">
                    {product.quantity.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {`AED ${formatCompactNumber(product.revenue, 0)}`}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

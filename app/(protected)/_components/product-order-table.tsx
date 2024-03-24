import { formatPrice } from "@/components/shared/formatPrice";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import React from "react";

const ProductOrderTable = async () => {
  const products = await db.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      {products?.map((product) => {
        return (
          <div
            key={product.id}
            className="p-2 mt-4 border-2 border-gray-300 rounded-lg"
          >
            <div className="text-lg capitalize">{product.productName}</div>
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stock</TableHead>
                    <TableHead>Min</TableHead>
                    <TableHead>Max</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.minProduct}</TableCell>
                    <TableCell>{product.maxProduct}</TableCell>
                    <TableCell>{formatPrice(product.price)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ProductOrderTable;

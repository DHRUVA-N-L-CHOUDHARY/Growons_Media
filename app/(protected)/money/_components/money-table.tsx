import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import PaginationBar from "./PaginationBar";
import { formatPrice } from "@/components/shared/formatPrice";
import BadgeStatus from "./BadgeStatus";
import ImageDialog from "@/components/shared/Image-dialog";

type TableProps = {
  searchParams: { page: string };
  userId: string;
};

export async function MoneyTable({ userId, searchParams }: TableProps) {
  const currentPage = parseInt(searchParams.page) || 1;

  const pageSize = 5;
  const totalItemCount = (
    await db.money.findMany({
      where: { userId: userId },
    })
  ).length;

  const totalPages = Math.ceil(totalItemCount / pageSize);

  const invoices = await db.money.findMany({
    where: { userId: userId },
    orderBy: { id: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
  });

  return (
    <section className="w-full">
      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead>Account No</TableHead>
            <TableHead>UPI-ID</TableHead>
            <TableHead>Transaction id</TableHead>
            <TableHead>Charge Money</TableHead>
            <TableHead>State</TableHead>
            <TableHead>Screenshot</TableHead>
            <TableHead>Date Created</TableHead>
          </TableRow>
        </TableHeader>
        {totalItemCount === 0 && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No invoices found
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.upiid}>
              <TableCell>{invoice.accountNumber}</TableCell>
              <TableCell>{invoice.upiid}</TableCell>
              <TableCell>{invoice.transactionId}</TableCell>
              <TableCell>{formatPrice(Number(invoice.amount))}</TableCell>
              <TableCell className="cursor-pointer">
                <BadgeStatus status={invoice.status} />
              </TableCell>
              <TableCell>
                <ImageDialog imageLink={invoice.secure_url} />
              </TableCell>
              <TableCell>{invoice.createdAt.toDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        {totalItemCount !== 0 && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-left" colSpan={4}>
                {formatPrice(
                  invoices.reduce((acc, cur) => acc + Number(cur.amount), 0)
                )}
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
      {totalPages > 1 && (
        <PaginationBar totalPages={totalPages} currentPage={currentPage} />
      )}
    </section>
  );
}

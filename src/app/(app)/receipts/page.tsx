import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { listCategories } from "@/lib/categories";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ReceiptFilters } from "@/components/receipts/receipt-filters";

export const metadata = { title: "Receipts | ReceiptBox" };

type SearchParams = {
  q?: string;
  category?: string;
  from?: string;
  to?: string;
};

export default async function ReceiptsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await auth();
  const userId = session!.user!.id!;
  const sp = await searchParams;
  const categories = await listCategories();

  const where: Record<string, unknown> = { userId };
  if (sp.q) (where as any).merchant = { contains: sp.q };
  if (sp.category) (where as any).categoryId = sp.category;
  if (sp.from || sp.to) {
    (where as any).transactionDate = {};
    if (sp.from) (where as any).transactionDate.gte = new Date(sp.from);
    if (sp.to) (where as any).transactionDate.lte = new Date(sp.to);
  }

  const receipts = await prisma.receipt.findMany({
    where: where as any,
    orderBy: { createdAt: "desc" },
    include: { category: true },
    take: 200,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">Receipts</h1>
          <p className="text-sm text-muted-foreground">
            {receipts.length} {receipts.length === 1 ? "receipt" : "receipts"}
          </p>
        </div>
        <Button asChild>
          <Link href="/upload">+ New receipt</Link>
        </Button>
      </div>

      <ReceiptFilters
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        defaults={sp}
      />

      <Card>
        <CardContent className="p-0">
          {receipts.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No receipts match your filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="px-4 py-3 font-medium text-muted-foreground">Preview</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Merchant</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Date</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Total</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Category</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {receipts.map((r) => (
                    <tr key={r.id} className="border-b hover:bg-muted/30">
                      <td className="px-4 py-3">
                        {r.thumbnailUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={r.thumbnailUrl}
                            alt=""
                            className="h-12 w-12 rounded border object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded border bg-muted text-xs text-muted-foreground">
                            PDF
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        <Link href={`/receipts/${r.id}`} className="hover:underline">
                          {r.merchant ?? "Untitled receipt"}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatDate(r.transactionDate ?? r.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        {formatCurrency(r.totalAmount ? Number(r.totalAmount) : null, r.currency)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {r.category ? r.category.name : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={r.ocrStatus === "COMPLETED" ? "secondary" : "outline"}>
                          {r.ocrStatus.toLowerCase()}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

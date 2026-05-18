import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { listCategories } from "@/lib/categories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReceiptDetailForm } from "@/components/receipts/receipt-detail-form";

export const metadata = { title: "Receipt | ReceiptBox" };

export default async function ReceiptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const userId = session!.user!.id!;
  const { id } = await params;
  const [receipt, categories] = await Promise.all([
    prisma.receipt.findFirst({
      where: { id, userId },
      include: { category: true },
    }),
    listCategories(),
  ]);
  if (!receipt) notFound();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">{receipt.merchant ?? "Untitled receipt"}</h1>
          <p className="text-sm text-muted-foreground">
            Uploaded {new Date(receipt.createdAt).toLocaleString()}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/receipts">Back to receipts</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Original</CardTitle>
          </CardHeader>
          <CardContent>
            {receipt.fileType.startsWith("image/") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={receipt.fileUrl}
                alt="Receipt"
                className="w-full rounded-md border object-contain"
              />
            ) : (
              <iframe
                src={receipt.fileUrl}
                className="h-[500px] w-full rounded-md border"
                title="Receipt PDF"
              />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ReceiptDetailForm
              receipt={{
                id: receipt.id,
                merchant: receipt.merchant,
                transactionDate: receipt.transactionDate
                  ? receipt.transactionDate.toISOString().slice(0, 10)
                  : null,
                totalAmount: receipt.totalAmount ? Number(receipt.totalAmount) : null,
                taxAmount: receipt.taxAmount ? Number(receipt.taxAmount) : null,
                currency: receipt.currency,
                categoryId: receipt.categoryId,
                notes: receipt.notes,
              }}
              categories={categories.map((c) => ({ id: c.id, name: c.name }))}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

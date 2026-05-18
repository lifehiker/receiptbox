import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getEntitlements } from "@/lib/entitlements";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata = { title: "Dashboard | ReceiptBox" };

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user!.id!;
  const [recent, totalCount, ent, byCategory] = await Promise.all([
    prisma.receipt.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { category: true },
    }),
    prisma.receipt.count({ where: { userId } }),
    getEntitlements(userId),
    prisma.receipt.groupBy({
      by: ["categoryId"],
      where: { userId },
      _count: { _all: true },
      _sum: { totalAmount: true },
    }),
  ]);

  const totalSpend = byCategory.reduce(
    (acc, row) => acc + (row._sum.totalAmount ? Number(row._sum.totalAmount) : 0),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Quick overview of your receipts and exports.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/upload">+ New receipt</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/exports">Export</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Receipts saved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalCount}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              {ent.isPro
                ? "Unlimited on Pro"
                : `${ent.receiptsRemaining} of ${ent.receiptLimit} remaining on Free`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total tracked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(totalSpend)}</div>
            <p className="mt-1 text-xs text-muted-foreground">Across all categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant={ent.isPro ? "default" : "secondary"}>
                {ent.isPro ? "Pro" : "Free"}
              </Badge>
              {!ent.isPro && (
                <Button size="sm" variant="link" asChild>
                  <Link href="/pricing">Upgrade</Link>
                </Button>
              )}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {ent.isPro
                ? "Unlimited scans and exports"
                : `${ent.exportsRemaining} export${ent.exportsRemaining === 1 ? "" : "s"} remaining this month`}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent receipts</CardTitle>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <div className="rounded-md border border-dashed p-8 text-center">
              <p className="text-sm text-muted-foreground">No receipts yet.</p>
              <Button className="mt-4" asChild>
                <Link href="/upload">Scan your first receipt</Link>
              </Button>
            </div>
          ) : (
            <ul className="divide-y">
              {recent.map((r) => (
                <li key={r.id} className="flex items-center justify-between py-3">
                  <div>
                    <Link
                      href={`/receipts/${r.id}`}
                      className="font-medium hover:underline"
                    >
                      {r.merchant ?? "Untitled receipt"}
                    </Link>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(r.transactionDate ?? r.createdAt)}
                      {r.category ? ` · ${r.category.name}` : ""}
                    </div>
                  </div>
                  <div className="text-sm font-semibold">
                    {formatCurrency(r.totalAmount ? Number(r.totalAmount) : null, r.currency)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

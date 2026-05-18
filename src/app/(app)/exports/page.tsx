import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getEntitlements } from "@/lib/entitlements";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExportsPanel } from "@/components/exports/exports-panel";

export const metadata = { title: "Exports | ReceiptBox" };

export default async function ExportsPage() {
  const session = await auth();
  const userId = session!.user!.id!;
  const [ent, jobs, receiptCount] = await Promise.all([
    getEntitlements(userId),
    prisma.exportJob.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 25,
    }),
    prisma.receipt.count({ where: { userId } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Exports</h1>
        <p className="text-sm text-muted-foreground">
          Download a CSV of your receipts or a ZIP bundle with the originals.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New export</CardTitle>
        </CardHeader>
        <CardContent>
          {receiptCount === 0 ? (
            <p className="text-sm text-muted-foreground">
              You don&apos;t have any receipts yet. Upload one first.
            </p>
          ) : (
            <ExportsPanel
              isPro={ent.isPro}
              exportsRemaining={ent.exportsRemaining}
              exportLimit={ent.exportLimit}
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent exports</CardTitle>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No exports yet.</p>
          ) : (
            <ul className="divide-y">
              {jobs.map((j) => (
                <li key={j.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <div className="font-medium">{j.type} export</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(j.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <Badge variant={j.status === "COMPLETED" ? "secondary" : "outline"}>
                    {j.status.toLowerCase()}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

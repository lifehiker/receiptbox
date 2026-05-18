import { NextResponse } from "next/server";
import Papa from "papaparse";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canExport } from "@/lib/entitlements";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id: string }).id;
  const gate = await canExport(userId);
  if (!gate.ok) return NextResponse.json({ error: gate.reason }, { status: 402 });

  const url = new URL(req.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const where: Record<string, unknown> = { userId };
  if (from || to) {
    (where as any).transactionDate = {};
    if (from) (where as any).transactionDate.gte = new Date(from);
    if (to) (where as any).transactionDate.lte = new Date(to);
  }
  const receipts = await prisma.receipt.findMany({
    where: where as any,
    orderBy: { transactionDate: "asc" },
    include: { category: true },
  });

  const rows = receipts.map((r) => ({
    id: r.id,
    merchant: r.merchant ?? "",
    transaction_date: r.transactionDate ? r.transactionDate.toISOString().slice(0, 10) : "",
    total_amount: r.totalAmount ? Number(r.totalAmount).toFixed(2) : "",
    tax_amount: r.taxAmount ? Number(r.taxAmount).toFixed(2) : "",
    currency: r.currency,
    category: r.category?.name ?? "",
    notes: r.notes ?? "",
    created_at: r.createdAt.toISOString(),
  }));

  const csv = Papa.unparse(rows);
  await prisma.exportJob.create({
    data: {
      userId,
      type: "CSV",
      filtersJson: JSON.stringify({ from, to }),
      status: "COMPLETED",
    },
  });

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="receipts.csv"`,
    },
  });
}

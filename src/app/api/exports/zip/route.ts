import { NextResponse } from "next/server";
import JSZip from "jszip";
import Papa from "papaparse";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canExport } from "@/lib/entitlements";
import { readUpload } from "@/lib/storage";

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

  const zip = new JSZip();
  const rows = receipts.map((r) => ({
    id: r.id,
    merchant: r.merchant ?? "",
    transaction_date: r.transactionDate ? r.transactionDate.toISOString().slice(0, 10) : "",
    total_amount: r.totalAmount ? Number(r.totalAmount).toFixed(2) : "",
    tax_amount: r.taxAmount ? Number(r.taxAmount).toFixed(2) : "",
    currency: r.currency,
    category: r.category?.name ?? "",
    notes: r.notes ?? "",
    file_path: r.fileUrl,
    created_at: r.createdAt.toISOString(),
  }));
  zip.file("receipts.csv", Papa.unparse(rows));

  for (const r of receipts) {
    const key = r.fileUrl.replace(/^\/api\/receipts\/files\//, "");
    const file = await readUpload(key);
    if (!file) continue;
    const year = (r.transactionDate ?? r.createdAt).getFullYear();
    const category = sanitize(r.category?.name ?? "Uncategorized");
    const merchant = sanitize(r.merchant ?? "receipt");
    const ext = extFromMime(file.type);
    const safe = `${year}/${category}/${merchant}-${r.id}${ext}`;
    zip.file(safe, file.buffer);
  }

  const buf = await zip.generateAsync({ type: "nodebuffer" });
  await prisma.exportJob.create({
    data: {
      userId,
      type: "ZIP",
      filtersJson: JSON.stringify({ from, to }),
      status: "COMPLETED",
    },
  });

  return new NextResponse(buf as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="receiptbox-export.zip"`,
    },
  });
}

function sanitize(input: string) {
  return input.replace(/[^a-z0-9._-]+/gi, "_").slice(0, 64) || "untitled";
}

function extFromMime(type: string) {
  switch (type) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "application/pdf":
      return ".pdf";
    default:
      return "";
  }
}

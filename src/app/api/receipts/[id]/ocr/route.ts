import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { readUpload } from "@/lib/storage";
import { runOcr } from "@/lib/ocr";

export const runtime = "nodejs";

export async function POST(_req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id: string }).id;
  const { id } = await context.params;
  const receipt = await prisma.receipt.findFirst({ where: { id, userId } });
  if (!receipt) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.receipt.update({
    where: { id: receipt.id },
    data: { ocrStatus: "PROCESSING" },
  });

  const key = receipt.fileUrl.replace(/^\/api\/receipts\/files\//, "");
  const stored = await readUpload(key);
  if (!stored) {
    await prisma.receipt.update({ where: { id: receipt.id }, data: { ocrStatus: "FAILED" } });
    return NextResponse.json({ error: "File missing" }, { status: 500 });
  }

  try {
    const ocr = await runOcr(stored);
    await prisma.receipt.update({
      where: { id: receipt.id },
      data: {
        merchant: ocr.merchant ?? undefined,
        transactionDate: ocr.transactionDate ? new Date(ocr.transactionDate) : undefined,
        totalAmount: ocr.totalAmount ?? undefined,
        taxAmount: ocr.taxAmount ?? undefined,
        currency: ocr.currency ?? "USD",
        ocrRawJson: JSON.stringify(ocr.raw),
        ocrStatus: "COMPLETED",
      },
    });
    return NextResponse.json({ ok: true, ocr });
  } catch (err) {
    console.error("[receipts/ocr]", err);
    await prisma.receipt.update({ where: { id: receipt.id }, data: { ocrStatus: "FAILED" } });
    return NextResponse.json({ error: "OCR failed" }, { status: 500 });
  }
}

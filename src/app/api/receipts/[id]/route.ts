import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { deleteUpload } from "@/lib/storage";

const patchSchema = z.object({
  merchant: z.string().nullable().optional(),
  transactionDate: z.string().nullable().optional(),
  totalAmount: z.number().nullable().optional(),
  taxAmount: z.number().nullable().optional(),
  currency: z.string().min(1).max(8).optional(),
  categoryId: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id: string }).id;
  const { id } = await context.params;
  const receipt = await prisma.receipt.findFirst({
    where: { id, userId },
    include: { category: true },
  });
  if (!receipt) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ receipt });
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id: string }).id;
  const { id } = await context.params;
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const data = parsed.data;
  const existing = await prisma.receipt.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.receipt.update({
    where: { id },
    data: {
      merchant: data.merchant ?? null,
      transactionDate: data.transactionDate ? new Date(data.transactionDate) : null,
      totalAmount: data.totalAmount ?? null,
      taxAmount: data.taxAmount ?? null,
      currency: data.currency ?? existing.currency,
      categoryId: data.categoryId ?? null,
      notes: data.notes ?? null,
    },
  });
  return NextResponse.json({ ok: true, receipt: updated });
}

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id: string }).id;
  const { id } = await context.params;
  const existing = await prisma.receipt.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.receipt.delete({ where: { id } });

  // best-effort: remove the underlying file
  const match = existing.fileUrl.match(/^\/api\/receipts\/files\/(.+)$/);
  if (match) await deleteUpload(match[1]);

  return NextResponse.json({ ok: true });
}

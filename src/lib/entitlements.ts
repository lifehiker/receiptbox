import { prisma } from "@/lib/prisma";

export const FREE_RECEIPT_LIMIT = 15;
export const FREE_EXPORTS_PER_MONTH = 1;

export type Entitlements = {
  isPro: boolean;
  status: string;
  receiptsUsed: number;
  receiptsRemaining: number | "unlimited";
  exportsThisMonth: number;
  exportsRemaining: number | "unlimited";
  receiptLimit: number;
  exportLimit: number;
};

export async function getEntitlements(userId: string): Promise<Entitlements> {
  const sub = await prisma.subscription.findUnique({ where: { userId } });
  const status = sub?.status ?? "FREE";
  const isPro = status === "ACTIVE" || status === "PAST_DUE";

  const receiptsUsed = await prisma.receipt.count({ where: { userId } });

  const monthStart = startOfMonth(new Date());
  const exportsThisMonth = await prisma.exportJob.count({
    where: { userId, createdAt: { gte: monthStart }, status: "COMPLETED" },
  });

  return {
    isPro,
    status,
    receiptsUsed,
    receiptsRemaining: isPro ? "unlimited" : Math.max(0, FREE_RECEIPT_LIMIT - receiptsUsed),
    exportsThisMonth,
    exportsRemaining: isPro
      ? "unlimited"
      : Math.max(0, FREE_EXPORTS_PER_MONTH - exportsThisMonth),
    receiptLimit: FREE_RECEIPT_LIMIT,
    exportLimit: FREE_EXPORTS_PER_MONTH,
  };
}

export async function canUploadReceipt(userId: string): Promise<{ ok: boolean; reason?: string }> {
  const e = await getEntitlements(userId);
  if (e.isPro) return { ok: true };
  if (e.receiptsUsed >= FREE_RECEIPT_LIMIT) {
    return {
      ok: false,
      reason: `Free plan is limited to ${FREE_RECEIPT_LIMIT} receipts. Upgrade to Pro for unlimited scans.`,
    };
  }
  return { ok: true };
}

export async function canExport(userId: string): Promise<{ ok: boolean; reason?: string }> {
  const e = await getEntitlements(userId);
  if (e.isPro) return { ok: true };
  if (e.exportsThisMonth >= FREE_EXPORTS_PER_MONTH) {
    return {
      ok: false,
      reason: `Free plan allows ${FREE_EXPORTS_PER_MONTH} export per month. Upgrade to Pro for unlimited exports.`,
    };
  }
  return { ok: true };
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

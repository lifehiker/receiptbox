import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ensureUploadDir } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  try {
    const root = await ensureUploadDir();
    const userDir = path.join(root, userId);
    await fs.rm(userDir, { recursive: true, force: true });
  } catch (err) {
    console.error("[account/delete] failed to remove files", err);
  }

  await prisma.user.delete({ where: { id: userId } });
  return NextResponse.json({ ok: true });
}

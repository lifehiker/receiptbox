import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { saveUpload, isAllowedType } from "@/lib/storage";
import { canUploadReceipt } from "@/lib/entitlements";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  const gate = await canUploadReceipt(userId);
  if (!gate.ok) {
    return NextResponse.json({ error: gate.reason }, { status: 402 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }
  const file = form.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!isAllowedType(file.type)) {
    return NextResponse.json(
      { error: `Unsupported file type: ${file.type}` },
      { status: 400 }
    );
  }
  if (file.size > 15 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 15 MB)" }, { status: 400 });
  }

  try {
    const stored = await saveUpload(userId, file);
    const receipt = await prisma.receipt.create({
      data: {
        userId,
        fileUrl: stored.fileUrl,
        thumbnailUrl: stored.thumbnailUrl,
        fileType: stored.fileType,
        ocrStatus: "PENDING",
      },
    });
    return NextResponse.json({ ok: true, receipt });
  } catch (err) {
    console.error("[receipts/upload]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

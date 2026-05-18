import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { readUpload } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET(_req: Request, context: { params: Promise<{ path: string[] }> }) {
  const session = await auth();
  if (!session?.user) return new NextResponse("Unauthorized", { status: 401 });
  const userId = (session.user as { id: string }).id;
  const { path } = await context.params;
  if (!path || path.length === 0) return new NextResponse("Not found", { status: 404 });

  // First segment of the stored key is the owning userId
  if (path[0] !== userId) {
    return new NextResponse("Forbidden", { status: 403 });
  }
  const key = path.join("/");
  const file = await readUpload(key);
  if (!file) return new NextResponse("Not found", { status: 404 });

  return new NextResponse(file.buffer as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": file.type,
      "Cache-Control": "private, max-age=3600",
    },
  });
}

import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

function uploadRoot() {
  if (process.env.UPLOAD_DIR && process.env.UPLOAD_DIR.length > 0) {
    return process.env.UPLOAD_DIR;
  }
  if (process.env.NODE_ENV === "production") return "/data/uploads";
  return path.join(process.cwd(), "data", "uploads");
}

export async function ensureUploadDir() {
  const root = uploadRoot();
  await fs.mkdir(root, { recursive: true });
  return root;
}

export type StoredFile = {
  key: string;
  fileUrl: string;
  thumbnailUrl: string | null;
  fileType: string;
  size: number;
};

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);

export function isAllowedType(mime: string) {
  return ALLOWED.has(mime);
}

export async function saveUpload(
  userId: string,
  file: { name: string; type: string; arrayBuffer: () => Promise<ArrayBuffer> }
): Promise<StoredFile> {
  if (!isAllowedType(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}`);
  }
  const root = await ensureUploadDir();
  const userDir = path.join(root, userId);
  await fs.mkdir(userDir, { recursive: true });

  const ext = extFor(file.type, file.name);
  const id = randomUUID();
  const key = `${userId}/${id}${ext}`;
  const fullPath = path.join(root, key);
  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(fullPath, buf);

  return {
    key,
    fileUrl: `/api/receipts/files/${key}`,
    thumbnailUrl: file.type.startsWith("image/") ? `/api/receipts/files/${key}` : null,
    fileType: file.type,
    size: buf.length,
  };
}

export async function readUpload(key: string): Promise<{ buffer: Buffer; type: string } | null> {
  const root = await ensureUploadDir();
  const safe = path.normalize(key).replace(/^([./\\])+/, "");
  const fullPath = path.join(root, safe);
  if (!fullPath.startsWith(root)) return null;
  try {
    const buffer = await fs.readFile(fullPath);
    const type = guessMime(fullPath);
    return { buffer, type };
  } catch {
    return null;
  }
}

export async function deleteUpload(key: string) {
  const root = await ensureUploadDir();
  const safe = path.normalize(key).replace(/^([./\\])+/, "");
  const fullPath = path.join(root, safe);
  if (!fullPath.startsWith(root)) return;
  try {
    await fs.unlink(fullPath);
  } catch {
    // ignore
  }
}

function extFor(type: string, name: string) {
  if (type === "application/pdf") return ".pdf";
  if (type === "image/jpeg") return ".jpg";
  if (type === "image/png") return ".png";
  if (type === "image/webp") return ".webp";
  const fromName = path.extname(name).toLowerCase();
  return fromName || "";
}

function guessMime(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".pdf":
      return "application/pdf";
    default:
      return "application/octet-stream";
  }
}

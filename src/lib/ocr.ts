export type OcrResult = {
  merchant: string | null;
  transactionDate: string | null;
  totalAmount: number | null;
  taxAmount: number | null;
  currency: string;
  raw: unknown;
};

export function isOcrConfigured() {
  return !!process.env.GOOGLE_VISION_API_KEY;
}

export async function runOcr(file: { buffer: Buffer; type: string }): Promise<OcrResult> {
  if (!isOcrConfigured()) {
    return {
      merchant: null,
      transactionDate: null,
      totalAmount: null,
      taxAmount: null,
      currency: "USD",
      raw: { provider: "none", reason: "GOOGLE_VISION_API_KEY not configured" },
    };
  }

  if (file.type === "application/pdf") {
    return emptyResult({ provider: "google-vision", note: "PDF skipped" });
  }

  try {
    const body = {
      requests: [
        {
          image: { content: file.buffer.toString("base64") },
          features: [{ type: "TEXT_DETECTION", maxResults: 1 }],
        },
      ],
    };
    const res = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_VISION_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
    if (!res.ok) {
      console.error("[ocr] Vision API error", res.status);
      return emptyResult({ provider: "google-vision", error: `HTTP ${res.status}` });
    }
    const json = (await res.json()) as {
      responses?: Array<{ fullTextAnnotation?: { text?: string } }>;
    };
    const text = json.responses?.[0]?.fullTextAnnotation?.text ?? "";
    return extractFieldsFromText(text, json);
  } catch (err) {
    console.error("[ocr] error", err);
    return emptyResult({ provider: "google-vision", error: String(err) });
  }
}

function emptyResult(raw: unknown): OcrResult {
  return {
    merchant: null,
    transactionDate: null,
    totalAmount: null,
    taxAmount: null,
    currency: "USD",
    raw,
  };
}

export function extractFieldsFromText(text: string, raw: unknown = {}): OcrResult {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  // Merchant: first non-empty line that doesn't look like a date/number
  const merchant =
    lines.find((l) => !/^\d/.test(l) && !/^(receipt|invoice|order)/i.test(l) && l.length > 2) ??
    null;

  // Date: look for common formats
  const dateMatch =
    text.match(/\b(\d{4}-\d{2}-\d{2})\b/) ||
    text.match(/\b(\d{1,2}\/\d{1,2}\/\d{2,4})\b/) ||
    text.match(/\b([A-Za-z]{3,9}\s+\d{1,2},?\s+\d{4})\b/);
  const transactionDate = dateMatch ? normalizeDate(dateMatch[1]) : null;

  // Total: look for "total" line with currency
  const totalRegex = /total[^\d]{0,10}\$?\s*([0-9]+(?:[.,][0-9]{2}))/i;
  const totalMatch = text.match(totalRegex);
  const totalAmount = totalMatch ? parseFloat(totalMatch[1].replace(",", ".")) : null;

  const taxRegex = /(?:tax|gst|vat|hst)[^\d]{0,10}\$?\s*([0-9]+(?:[.,][0-9]{2}))/i;
  const taxMatch = text.match(taxRegex);
  const taxAmount = taxMatch ? parseFloat(taxMatch[1].replace(",", ".")) : null;

  return {
    merchant: merchant?.trim() ?? null,
    transactionDate,
    totalAmount: Number.isFinite(totalAmount) ? totalAmount : null,
    taxAmount: Number.isFinite(taxAmount) ? taxAmount : null,
    currency: "USD",
    raw,
  };
}

function normalizeDate(input: string): string | null {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

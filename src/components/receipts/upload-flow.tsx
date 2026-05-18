"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Camera, FileUp, Loader2 } from "lucide-react";

type Category = { id: string; name: string; slug: string };

type Stage = "idle" | "uploading" | "ocring" | "review" | "saving" | "done";

type OcrResult = {
  merchant: string | null;
  transactionDate: string | null;
  totalAmount: number | null;
  taxAmount: number | null;
  currency: string;
};

export function UploadFlow({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState<string | null>(null);
  const [receiptId, setReceiptId] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [merchant, setMerchant] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [totalAmount, setTotalAmount] = useState<string>("");
  const [taxAmount, setTaxAmount] = useState<string>("");
  const [currency, setCurrency] = useState("USD");
  const [categoryId, setCategoryId] = useState<string>("");
  const [notes, setNotes] = useState("");

  const onDrop = useCallback(async (accepted: File[]) => {
    const file = accepted[0];
    if (!file) return;
    setError(null);
    setStage("uploading");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/receipts/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload failed");
        setStage("idle");
        return;
      }
      setReceiptId(data.receipt.id);
      setFileUrl(data.receipt.fileUrl);
      setFileType(data.receipt.fileType);
      setStage("ocring");
      const ocrRes = await fetch(`/api/receipts/${data.receipt.id}/ocr`, { method: "POST" });
      const ocrData = await ocrRes.json();
      const ocr: OcrResult = ocrData.ocr ?? {};
      setMerchant(ocr.merchant ?? "");
      setTransactionDate(ocr.transactionDate ?? "");
      setTotalAmount(ocr.totalAmount != null ? String(ocr.totalAmount) : "");
      setTaxAmount(ocr.taxAmount != null ? String(ocr.taxAmount) : "");
      setCurrency(ocr.currency ?? "USD");
      setStage("review");
    } catch (err) {
      console.error(err);
      setError("Upload failed");
      setStage("idle");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "application/pdf": [".pdf"],
    },
    multiple: false,
    maxSize: 15 * 1024 * 1024,
  });

  async function saveReceipt(e: React.FormEvent) {
    e.preventDefault();
    if (!receiptId) return;
    setStage("saving");
    setError(null);
    try {
      const res = await fetch(`/api/receipts/${receiptId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchant: merchant || null,
          transactionDate: transactionDate || null,
          totalAmount: totalAmount === "" ? null : Number(totalAmount),
          taxAmount: taxAmount === "" ? null : Number(taxAmount),
          currency,
          categoryId: categoryId || null,
          notes: notes || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Save failed");
        setStage("review");
        return;
      }
      setStage("done");
      router.push(`/receipts/${receiptId}`);
      router.refresh();
    } catch {
      setError("Save failed");
      setStage("review");
    }
  }

  if (stage === "idle" || stage === "uploading" || stage === "ocring") {
    return (
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`flex flex-col items-center justify-center rounded-md border-2 border-dashed p-12 text-center transition-colors ${
              isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/30"
            }`}
          >
            <input {...getInputProps()} />
            {stage === "uploading" ? (
              <>
                <Loader2 className="mb-3 h-8 w-8 animate-spin text-primary" />
                <p className="text-sm">Uploading…</p>
              </>
            ) : stage === "ocring" ? (
              <>
                <Loader2 className="mb-3 h-8 w-8 animate-spin text-primary" />
                <p className="text-sm">Reading receipt…</p>
              </>
            ) : (
              <>
                <FileUp className="mb-3 h-10 w-10 text-muted-foreground" />
                <p className="font-medium">Drop a receipt here</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  JPG, PNG, WEBP, or PDF — up to 15 MB
                </p>
                <Button
                  type="button"
                  className="mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById("camera-input")?.click();
                  }}
                >
                  <Camera className="mr-2 h-4 w-4" /> Take a photo
                </Button>
                <input
                  id="camera-input"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length) onDrop([files[0]]);
                  }}
                />
              </>
            )}
          </div>
          {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review and save</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={saveReceipt} className="space-y-4">
          {fileUrl && fileType?.startsWith("image/") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={fileUrl}
              alt="Receipt preview"
              className="max-h-64 w-full rounded-md border object-contain"
            />
          ) : fileUrl ? (
            <div className="rounded-md border bg-muted p-4 text-sm text-muted-foreground">
              PDF uploaded. Preview will be available on the detail page.
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="merchant">Merchant</Label>
              <Input
                id="merchant"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                placeholder="e.g. Office Depot"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Transaction date</Label>
              <Input
                id="date"
                type="date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total">Total</Label>
              <Input
                id="total"
                type="number"
                step="0.01"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax">Tax</Label>
              <Input
                id="tax"
                type="number"
                step="0.01"
                value={taxAmount}
                onChange={(e) => setTaxAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                maxLength={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">— Pick a category —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional"
            />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setStage("idle");
                setReceiptId(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={stage === "saving"}>
              {stage === "saving" ? "Saving…" : "Save receipt"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

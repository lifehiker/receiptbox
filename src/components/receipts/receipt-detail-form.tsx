"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Receipt = {
  id: string;
  merchant: string | null;
  transactionDate: string | null;
  totalAmount: number | null;
  taxAmount: number | null;
  currency: string;
  categoryId: string | null;
  notes: string | null;
};

export function ReceiptDetailForm({
  receipt,
  categories,
}: {
  receipt: Receipt;
  categories: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [merchant, setMerchant] = useState(receipt.merchant ?? "");
  const [transactionDate, setTransactionDate] = useState(receipt.transactionDate ?? "");
  const [totalAmount, setTotalAmount] = useState(
    receipt.totalAmount != null ? String(receipt.totalAmount) : ""
  );
  const [taxAmount, setTaxAmount] = useState(
    receipt.taxAmount != null ? String(receipt.taxAmount) : ""
  );
  const [currency, setCurrency] = useState(receipt.currency ?? "USD");
  const [categoryId, setCategoryId] = useState(receipt.categoryId ?? "");
  const [notes, setNotes] = useState(receipt.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const res = await fetch(`/api/receipts/${receipt.id}`, {
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
    setSaving(false);
    if (res.ok) {
      setMessage("Saved");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setMessage(data.error ?? "Save failed");
    }
  }

  async function onDelete() {
    if (!confirm("Delete this receipt? This cannot be undone.")) return;
    const res = await fetch(`/api/receipts/${receipt.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/receipts");
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="merchant">Merchant</Label>
          <Input id="merchant" value={merchant} onChange={(e) => setMerchant(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="date">Transaction date</Label>
          <Input
            id="date"
            type="date"
            value={transactionDate}
            onChange={(e) => setTransactionDate(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="total">Total</Label>
          <Input
            id="total"
            type="number"
            step="0.01"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="tax">Tax</Label>
          <Input
            id="tax"
            type="number"
            step="0.01"
            value={taxAmount}
            onChange={(e) => setTaxAmount(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="currency">Currency</Label>
          <Input
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value.toUpperCase())}
            maxLength={3}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="category">Category</Label>
          <Select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">— Uncategorized —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      <div className="flex items-center justify-between gap-2">
        <Button type="button" variant="destructive" onClick={onDelete}>
          Delete
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

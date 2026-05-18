"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

type Props = {
  isPro: boolean;
  exportsRemaining: number | "unlimited";
  exportLimit: number;
};

export function ExportsPanel({ isPro, exportsRemaining, exportLimit }: Props) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [busy, setBusy] = useState<"csv" | "zip" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const limitReached = !isPro && exportsRemaining === 0;

  async function download(type: "csv" | "zip") {
    setBusy(type);
    setError(null);
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const res = await fetch(`/api/exports/${type}?${params.toString()}`, { method: "POST" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? `Export failed`);
      setBusy(null);
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receiptbox-${type}-${Date.now()}.${type === "csv" ? "csv" : "zip"}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setBusy(null);
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="from">From (optional)</Label>
          <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="to">To (optional)</Label>
          <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
      </div>
      <div className="flex gap-3">
        <Button onClick={() => download("csv")} disabled={busy !== null || limitReached}>
          {busy === "csv" ? "Building…" : "Download CSV"}
        </Button>
        <Button
          variant="outline"
          onClick={() => download("zip")}
          disabled={busy !== null || limitReached}
        >
          {busy === "zip" ? "Building…" : "Download ZIP (CSV + originals)"}
        </Button>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {!isPro && (
        <p className="text-xs text-muted-foreground">
          {limitReached ? (
            <>
              You&apos;ve used your {exportLimit} free export this month.{" "}
              <Link href="/pricing" className="text-primary underline">
                Upgrade for unlimited exports.
              </Link>
            </>
          ) : (
            `${exportsRemaining} of ${exportLimit} free export${
              exportLimit === 1 ? "" : "s"
            } remaining this month.`
          )}
        </p>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function BillingButton() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function openPortal() {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not open billing portal");
      return;
    }
    const { url } = await res.json();
    if (url) window.location.href = url;
  }

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={openPortal} disabled={busy}>
        {busy ? "Opening…" : "Manage billing"}
      </Button>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

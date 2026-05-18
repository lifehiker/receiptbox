"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CheckoutButtons() {
  const [busy, setBusy] = useState<"month" | "year" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function checkout(plan: "month" | "year") {
    setBusy(plan);
    setError(null);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    setBusy(null);
    if (!res.ok) {
      if (res.status === 401) {
        window.location.href = `/sign-in?callbackUrl=/pricing`;
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Checkout unavailable");
      return;
    }
    const { url } = await res.json();
    if (url) window.location.href = url;
  }

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={() => checkout("month")} disabled={busy !== null} className="w-full">
        {busy === "month" ? "Loading…" : "Upgrade — $7 / month"}
      </Button>
      <Button
        onClick={() => checkout("year")}
        variant="outline"
        disabled={busy !== null}
        className="w-full"
      >
        {busy === "year" ? "Loading…" : "Upgrade — $59 / year"}
      </Button>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

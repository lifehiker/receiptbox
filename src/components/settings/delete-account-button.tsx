"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function DeleteAccountButton() {
  const [busy, setBusy] = useState(false);

  async function onDelete() {
    if (
      !confirm(
        "This will permanently delete your account, receipts, and uploaded files. Continue?"
      )
    )
      return;
    setBusy(true);
    const res = await fetch("/api/account/delete", { method: "POST" });
    setBusy(false);
    if (res.ok) {
      await signOut({ callbackUrl: "/" });
    } else {
      alert("Could not delete account. Please try again.");
    }
  }

  return (
    <Button variant="destructive" onClick={onDelete} disabled={busy}>
      {busy ? "Deleting…" : "Delete my account"}
    </Button>
  );
}

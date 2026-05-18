"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function AppHeader({ email }: { email?: string | null }) {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4">
      <div className="md:hidden font-semibold">ReceiptBox</div>
      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-muted-foreground sm:inline">{email}</span>
        <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
          Sign out
        </Button>
        <Link href="/pricing" className="hidden text-sm font-medium text-primary hover:underline sm:inline">
          Upgrade
        </Link>
      </div>
    </header>
  );
}

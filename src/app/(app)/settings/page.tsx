import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getEntitlements } from "@/lib/entitlements";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeleteAccountButton } from "@/components/settings/delete-account-button";
import { BillingButton } from "@/components/settings/billing-button";
import Link from "next/link";

export const metadata = { title: "Settings | ReceiptBox" };

export default async function SettingsPage() {
  const session = await auth();
  const userId = session!.user!.id!;
  const [user, ent, totals] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    getEntitlements(userId),
    prisma.receipt.count({ where: { userId } }),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <div>
            <span className="text-muted-foreground">Email: </span>
            <span className="font-medium">{user?.email}</span>
          </div>
          {user?.name ? (
            <div>
              <span className="text-muted-foreground">Name: </span>
              <span className="font-medium">{user.name}</span>
            </div>
          ) : null}
          <div>
            <span className="text-muted-foreground">Receipts saved: </span>
            <span className="font-medium">{totals}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <Badge variant={ent.isPro ? "default" : "secondary"}>
              {ent.isPro ? "Pro" : "Free"}
            </Badge>
            <span className="text-muted-foreground">Status: {ent.status.toLowerCase()}</span>
          </div>
          <p className="text-muted-foreground">
            {ent.isPro
              ? "Unlimited scans and exports. Manage billing below."
              : `Free plan: up to ${ent.receiptLimit} receipts and ${ent.exportLimit} export per month.`}
          </p>
          <div className="flex gap-2">
            {ent.isPro ? (
              <BillingButton />
            ) : (
              <Link
                href="/pricing"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Upgrade to Pro
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle>Danger zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            Permanently delete your account and all stored receipts. This cannot be undone.
          </p>
          <DeleteAccountButton />
        </CardContent>
      </Card>
    </div>
  );
}

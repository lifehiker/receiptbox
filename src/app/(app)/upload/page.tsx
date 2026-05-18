import Link from "next/link";
import { auth } from "@/auth";
import { listCategories } from "@/lib/categories";
import { getEntitlements } from "@/lib/entitlements";
import { UploadFlow } from "@/components/receipts/upload-flow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Upload receipt | ReceiptBox" };

export default async function UploadPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const session = await auth();
  const userId = session!.user!.id!;
  const sp = await searchParams;
  const welcome = sp.welcome === "1";
  const [categories, ent] = await Promise.all([listCategories(), getEntitlements(userId)]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Upload a receipt</h1>
        <p className="text-sm text-muted-foreground">
          Take a photo on mobile or drop a JPG / PNG / PDF here.
        </p>
      </div>

      {welcome ? (
        <Card>
          <CardHeader>
            <CardTitle>Welcome to ReceiptBox</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>3 steps to your first tax-ready export:</p>
            <ol className="ml-5 list-decimal space-y-1">
              <li>Upload a receipt below — OCR will fill in merchant, date, and total.</li>
              <li>Review and pick a category, then save.</li>
              <li>
                Head to <Link href="/exports" className="text-primary underline">Exports</Link>{" "}
                whenever you want a CSV or ZIP bundle.
              </li>
            </ol>
          </CardContent>
        </Card>
      ) : null}

      {!ent.isPro && ent.receiptsRemaining === 0 ? (
        <Card className="border-destructive">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <div className="font-semibold">Free plan limit reached</div>
              <p className="text-sm text-muted-foreground">
                You&apos;ve used all {ent.receiptLimit} free receipts. Upgrade to Pro to keep
                scanning.
              </p>
            </div>
            <Button asChild>
              <Link href="/pricing">Upgrade</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <UploadFlow
          categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
        />
      )}
    </div>
  );
}

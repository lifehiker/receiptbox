import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { CheckoutButtons } from "./checkout-buttons";

export const metadata = {
  title: "Pricing — ReceiptBox",
  description: "Simple pricing for ReceiptBox. Free up to 15 receipts. Pro is $7/mo or $59/yr.",
};

const FREE = [
  "Up to 15 receipt scans total",
  "1 export per month",
  "Default tax-ready categories",
  "Standard OCR processing",
];

const PRO = [
  "Unlimited receipt scans",
  "Unlimited CSV + ZIP exports",
  "Bulk export by year/category/date range",
  "Search and filters",
  "Priority OCR processing",
  "Multi-year receipt archive",
];

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="container flex-1 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight">Pricing built for solo operators</h1>
          <p className="mt-4 text-muted-foreground">
            One free tier, one paid tier. No teams, no add-ons, no surprise charges.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <div className="text-3xl font-bold">$0</div>
              <p className="text-sm text-muted-foreground">Forever, up to 15 receipts.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                {FREE.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/sign-up">Get started free</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="border-primary">
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <div className="flex items-end gap-2">
                <div className="text-3xl font-bold">$7</div>
                <div className="text-sm text-muted-foreground">/ month</div>
              </div>
              <p className="text-sm text-muted-foreground">or $59 billed yearly (save ~30%).</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm">
                {PRO.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              <CheckoutButtons />
            </CardContent>
          </Card>
        </div>

        <p className="mx-auto mt-10 max-w-xl text-center text-xs text-muted-foreground">
          Stripe powers checkout and billing. You can cancel anytime from your account settings.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}

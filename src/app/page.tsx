import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Camera, FileDown, FolderTree, Scan, Tags, Wallet } from "lucide-react";

export const metadata = {
  title: "ReceiptBox — Receipt Scanner App for Freelancers & Taxes",
  description:
    "Scan receipts, extract merchant/date/total, organize them into tax-ready folders, and export CSV or ZIP for your accountant. Built for freelancers and self-employed users.",
};

const FEATURES = [
  {
    icon: Camera,
    title: "Capture from anywhere",
    body:
      "Snap a receipt with your phone camera or drag-and-drop from your desktop. Works on any modern browser.",
  },
  {
    icon: Scan,
    title: "OCR fills the form",
    body:
      "Merchant, date, total, and tax are extracted automatically. Review and edit before saving.",
  },
  {
    icon: Tags,
    title: "Tax-ready categories",
    body:
      "Default folders for Meals, Travel, Supplies, Office, Software, Vehicle, and Other. No accounting setup.",
  },
  {
    icon: FolderTree,
    title: "Yearly & monthly views",
    body: "Browse receipts by year and category. Find anything by merchant or date range.",
  },
  {
    icon: FileDown,
    title: "CSV + ZIP export",
    body:
      "Export a clean CSV for your accountant, or a ZIP bundle with original files organized by year/category.",
  },
  {
    icon: Wallet,
    title: "Built for solo operators",
    body:
      "No reports, approvals, or chart of accounts. Just scan, label, and export at tax time.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="container py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex rounded-full border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              Built for freelancers and self-employed
            </div>
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              From shoebox to CSV in seconds.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              ReceiptBox is a simple receipt scanner and organizer for freelancers. Scan a receipt,
              label it, and export tax-ready CSV or ZIP. No accounting software, no approvals,
              no team setup.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Button size="lg" asChild>
                <Link href="/sign-up">Start scanning free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">See pricing</Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Free up to 15 receipts. No credit card required.
            </p>
          </div>
        </section>

        <section className="border-y bg-muted/30 py-16">
          <div className="container">
            <div className="grid gap-6 md:grid-cols-3">
              {FEATURES.map((f) => (
                <Card key={f.title}>
                  <CardContent className="p-6">
                    <f.icon className="h-6 w-6 text-primary" />
                    <h3 className="mt-4 font-semibold">{f.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="container py-20">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">The 3-step receipt flow</h2>
              <p className="mt-4 text-muted-foreground">
                ReceiptBox does one job and does it well: capture, label, export.
              </p>
              <ol className="mt-6 space-y-4">
                <li className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    1
                  </div>
                  <div>
                    <div className="font-medium">Snap or upload</div>
                    <div className="text-sm text-muted-foreground">
                      Mobile camera capture or drag-and-drop. JPG, PNG, or PDF.
                    </div>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    2
                  </div>
                  <div>
                    <div className="font-medium">Review & categorize</div>
                    <div className="text-sm text-muted-foreground">
                      OCR fills the form. Fix anything that&apos;s off and pick a category.
                    </div>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    3
                  </div>
                  <div>
                    <div className="font-medium">Export at tax time</div>
                    <div className="text-sm text-muted-foreground">
                      CSV for your accountant. ZIP with originals organized by year/category.
                    </div>
                  </div>
                </li>
              </ol>
            </div>
            <div className="rounded-xl border bg-muted/30 p-8">
              <h3 className="font-semibold">Designed for solo operators</h3>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li>• No reports or approvals like Expensify</li>
                <li>• No accounting setup like Wave</li>
                <li>• No premium pricing like Shoeboxed</li>
                <li>• No dated UI like Smart Receipts</li>
              </ul>
              <div className="mt-6 rounded-lg border bg-background p-4">
                <div className="text-xs font-semibold uppercase text-muted-foreground">
                  Default categories
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {["Meals", "Travel", "Supplies", "Office", "Software", "Vehicle", "Other"].map(
                    (c) => (
                      <span key={c} className="rounded-full bg-secondary px-2 py-0.5">
                        {c}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t bg-primary/5 py-16">
          <div className="container text-center">
            <h2 className="text-3xl font-bold">Ready to ditch the shoebox?</h2>
            <p className="mt-4 text-muted-foreground">
              Free forever for up to 15 receipts. Upgrade only when you need more.
            </p>
            <div className="mt-6">
              <Button size="lg" asChild>
                <Link href="/sign-up">Create your account</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

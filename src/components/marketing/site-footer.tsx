import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container grid gap-8 py-12 md:grid-cols-4">
        <div>
          <div className="font-bold">ReceiptBox</div>
          <p className="mt-2 text-sm text-muted-foreground">
            Simple receipt scanner and organizer for freelancers and self-employed users.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold">Product</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/pricing" className="hover:text-foreground">Pricing</Link>
            </li>
            <li>
              <Link href="/sign-up" className="hover:text-foreground">Get started</Link>
            </li>
            <li>
              <Link href="/export-receipts-csv" className="hover:text-foreground">Export to CSV</Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Use cases</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/for-freelancers" className="hover:text-foreground">For Freelancers</Link>
            </li>
            <li>
              <Link href="/for-self-employed" className="hover:text-foreground">For Self-Employed</Link>
            </li>
            <li>
              <Link href="/receipt-scanner-for-taxes" className="hover:text-foreground">For Taxes</Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Compare</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/compare/expensify-alternative" className="hover:text-foreground">vs Expensify</Link>
            </li>
            <li>
              <Link href="/compare/shoeboxed-alternative" className="hover:text-foreground">vs Shoeboxed</Link>
            </li>
            <li>
              <Link href="/compare/smart-receipts-alternative" className="hover:text-foreground">vs Smart Receipts</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="container border-t py-6 text-xs text-muted-foreground">
        © {new Date().getFullYear()} ReceiptBox. All rights reserved.
      </div>
    </footer>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ReceiptIcon } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <ReceiptIcon className="h-5 w-5 text-primary" />
          <span>ReceiptBox</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/for-freelancers" className="text-muted-foreground hover:text-foreground">
            For Freelancers
          </Link>
          <Link href="/for-self-employed" className="text-muted-foreground hover:text-foreground">
            Self-Employed
          </Link>
          <Link
            href="/receipt-scanner-for-taxes"
            className="text-muted-foreground hover:text-foreground"
          >
            For Taxes
          </Link>
          <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
            Pricing
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/sign-up">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

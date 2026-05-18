import Link from "next/link";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type MarketingSection = {
  title: string;
  body: string;
};

export function MarketingPage({
  badge,
  title,
  subtitle,
  ctaHref = "/sign-up",
  ctaLabel = "Start scanning free",
  sections,
  faqs,
}: {
  badge?: string;
  title: string;
  subtitle: string;
  ctaHref?: string;
  ctaLabel?: string;
  sections: MarketingSection[];
  faqs?: { q: string; a: string }[];
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="container py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            {badge ? (
              <div className="mb-4 inline-flex rounded-full border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                {badge}
              </div>
            ) : null}
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
            <p className="mt-6 text-lg text-muted-foreground">{subtitle}</p>
            <div className="mt-8">
              <Button size="lg" asChild>
                <Link href={ctaHref}>{ctaLabel}</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-y bg-muted/30 py-16">
          <div className="container grid gap-6 md:grid-cols-3">
            {sections.map((s) => (
              <Card key={s.title}>
                <CardContent className="p-6">
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {faqs && faqs.length > 0 ? (
          <section className="container py-16">
            <h2 className="text-2xl font-bold">Frequently asked questions</h2>
            <div className="mt-6 space-y-4">
              {faqs.map((f) => (
                <div key={f.q} className="rounded-lg border bg-card p-5">
                  <div className="font-semibold">{f.q}</div>
                  <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="border-t bg-primary/5 py-16">
          <div className="container text-center">
            <h2 className="text-3xl font-bold">Try ReceiptBox free</h2>
            <p className="mt-3 text-muted-foreground">
              Free up to 15 receipts. Upgrade only when you need more.
            </p>
            <div className="mt-6">
              <Button size="lg" asChild>
                <Link href={ctaHref}>{ctaLabel}</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

import { MarketingPage } from "@/components/marketing/marketing-page";

export const metadata = {
  title: "Expense Receipt Tracker for Self-Employed | ReceiptBox",
  description:
    "ReceiptBox is the expense receipt tracker built for self-employed people. Scan receipts, organize by tax category, and export when it's time to file.",
  alternates: { canonical: "/for-self-employed" },
};

export default function SelfEmployedPage() {
  return (
    <MarketingPage
      badge="Built for self-employed"
      title="The expense receipt tracker for one-person businesses."
      subtitle="Capture every business receipt, label it once, and have an export ready when quarterly or year-end taxes roll around."
      sections={[
        {
          title: "One workflow, every device",
          body:
            "Capture on mobile, organize and export on desktop. No app store install, no syncing headaches.",
        },
        {
          title: "Schedule C friendly",
          body:
            "Default categories map cleanly to common Schedule C expense lines so you and your accountant aren't translating.",
        },
        {
          title: "Multi-year archive",
          body:
            "Keep multiple years of receipts in one place. Filter or export by year, category, or date range.",
        },
      ]}
      faqs={[
        {
          q: "How is this different from Wave or Zoho?",
          a: "ReceiptBox is not an accounting suite. There is no chart of accounts, no invoicing, no bookkeeping setup — just receipts.",
        },
        {
          q: "Can I store PDFs as well as photos?",
          a: "Yes — JPG, PNG, WEBP, and PDF receipts are all supported.",
        },
        {
          q: "What happens at tax time?",
          a: "Go to Exports, pick a date range, and download a CSV or a ZIP with the originals organized by year and category.",
        },
      ]}
    />
  );
}

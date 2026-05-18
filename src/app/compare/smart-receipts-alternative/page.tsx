import { MarketingPage } from "@/components/marketing/marketing-page";

export const metadata = {
  title: "Smart Receipts Alternative | ReceiptBox",
  description:
    "ReceiptBox is a modern Smart Receipts alternative — cleaner UI, better OCR, tax-ready folders, and one-click CSV/ZIP exports.",
  alternates: { canonical: "/compare/smart-receipts-alternative" },
};

export default function SmartReceiptsAlternativePage() {
  return (
    <MarketingPage
      badge="vs Smart Receipts"
      title="A modern alternative to Smart Receipts."
      subtitle="If you've outgrown Smart Receipts' dated UI and OCR quirks, ReceiptBox is a cleaner, faster way to organize receipts for taxes."
      sections={[
        {
          title: "Modern, mobile-first UI",
          body: "Designed for capturing on phone and exporting on desktop.",
        },
        {
          title: "Opinionated categories",
          body:
            "Tax-friendly categories out of the box: Meals, Travel, Supplies, Office, Software, Vehicle, Other.",
        },
        {
          title: "Better export UX",
          body:
            "CSV and ZIP with /YEAR/CATEGORY folders. Filter exports by date range or category before downloading.",
        },
      ]}
    />
  );
}

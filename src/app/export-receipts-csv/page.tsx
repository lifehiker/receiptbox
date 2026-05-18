import { MarketingPage } from "@/components/marketing/marketing-page";

export const metadata = {
  title: "Scan Receipts and Export CSV for Taxes | ReceiptBox",
  description:
    "Scan receipts, extract merchant/date/total, and export a clean CSV for taxes with ReceiptBox.",
  alternates: { canonical: "/export-receipts-csv" },
};

export default function ExportReceiptsCsvPage() {
  return (
    <MarketingPage
      badge="Export-first workflow"
      title="Scan receipts. Export CSV. Done."
      subtitle="Built for the moment you need to hand a folder of receipts to your accountant — or just sum them up in a spreadsheet."
      sections={[
        {
          title: "Clean CSV columns",
          body:
            "merchant, transaction_date, total_amount, tax_amount, currency, category, notes — exactly what your accountant or spreadsheet needs.",
        },
        {
          title: "Filter before exporting",
          body:
            "Filter receipts by category, merchant, or date range, then export only what you want.",
        },
        {
          title: "ZIP bundle option",
          body:
            "Need the original images too? Download a ZIP with the CSV plus the originals in /YEAR/CATEGORY folders.",
        },
      ]}
    />
  );
}

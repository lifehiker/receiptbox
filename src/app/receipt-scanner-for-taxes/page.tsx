import { MarketingPage } from "@/components/marketing/marketing-page";

export const metadata = {
  title: "Receipt Scanner App for Taxes | ReceiptBox",
  description:
    "ReceiptBox is the receipt scanner app for taxes. Capture receipts, label them into tax-ready categories, and export CSV or ZIP for your accountant.",
  alternates: { canonical: "/receipt-scanner-for-taxes" },
};

export default function ReceiptScannerForTaxesPage() {
  return (
    <MarketingPage
      badge="Built for tax season"
      title="A receipt scanner app for tax-ready exports."
      subtitle="Capture business receipts year-round, sort them into tax-friendly folders, and export a clean bundle when you (or your accountant) need it."
      sections={[
        {
          title: "Year/category folders",
          body:
            "ZIP exports organize originals into /YEAR/CATEGORY/filename so your accountant can review them at a glance.",
        },
        {
          title: "Date-range exports",
          body: "Export everything, or just one quarter, or a specific category like Meals or Travel.",
        },
        {
          title: "CSV for spreadsheets",
          body:
            "Get a tidy CSV with merchant, date, total, tax, and category — ready for Excel, Google Sheets, or your accountant's tool.",
        },
      ]}
      faqs={[
        {
          q: "Does this replace my accountant?",
          a: "No — ReceiptBox makes it easier to hand off clean receipt data. Your accountant still does the tax filing.",
        },
        {
          q: "Can I export per quarter?",
          a: "Yes. Pick a date range (e.g. Jan 1 – Mar 31) and export only the receipts in that window.",
        },
        {
          q: "Is the OCR accurate?",
          a: "ReceiptBox extracts merchant, date, total, and tax. You can always review and correct each field before saving.",
        },
      ]}
    />
  );
}

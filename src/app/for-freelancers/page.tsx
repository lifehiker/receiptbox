import { MarketingPage } from "@/components/marketing/marketing-page";

export const metadata = {
  title: "Receipt Organizer App for Freelancers | ReceiptBox",
  description:
    "ReceiptBox is the simple receipt organizer app for freelancers. Scan, label, and export tax-ready CSV or ZIP — no accounting software needed.",
  alternates: { canonical: "/for-freelancers" },
};

export default function ForFreelancersPage() {
  return (
    <MarketingPage
      badge="Built for freelancers"
      title="A receipt organizer app that respects how freelancers work."
      subtitle="No reports. No approvals. No accounting suite. Just scan a receipt, pick a category, and export at tax time."
      sections={[
        {
          title: "Capture on the go",
          body:
            "Snap receipts from your phone camera or upload PDFs from your desktop. Works in any modern browser.",
        },
        {
          title: "Tax-ready folders",
          body:
            "Meals, Travel, Supplies, Office, Software, Vehicle, Other. The categories your accountant actually wants.",
        },
        {
          title: "CSV + ZIP exports",
          body:
            "Hand off a clean CSV — or a ZIP bundle organized by year/category with the original receipts inside.",
        },
      ]}
      faqs={[
        {
          q: "Is this an accounting tool?",
          a: "No. ReceiptBox does one job: capture, label, and export receipts. You keep your existing invoicing or accounting setup.",
        },
        {
          q: "What does the free plan include?",
          a: "Up to 15 receipts and one export per month. Upgrade to Pro for unlimited scans and exports.",
        },
        {
          q: "Can I export everything for my accountant?",
          a: "Yes. Export a CSV or a ZIP bundle containing the CSV and original receipt files organized by year/category.",
        },
      ]}
    />
  );
}

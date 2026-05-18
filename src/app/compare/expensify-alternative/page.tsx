import { MarketingPage } from "@/components/marketing/marketing-page";

export const metadata = {
  title: "Expensify Alternative for Freelancers | ReceiptBox",
  description:
    "ReceiptBox is the Expensify alternative for freelancers and solo operators. No reports, no approvals — just scan, label, and export.",
  alternates: { canonical: "/compare/expensify-alternative" },
};

export default function ExpensifyAlternativePage() {
  return (
    <MarketingPage
      badge="vs Expensify"
      title="The Expensify alternative for people who don't have a team."
      subtitle="Expensify is built for corporate expense reports and approval workflows. ReceiptBox is built for the freelancer who just needs receipts organized for tax time."
      sections={[
        {
          title: "No reports or approvals",
          body:
            "ReceiptBox skips the whole reports-and-reimbursement workflow. There's nothing to submit, nothing to approve.",
        },
        {
          title: "Solo-friendly pricing",
          body: "$7/month or $59/year flat. No per-user pricing tiers. No corporate add-ons.",
        },
        {
          title: "Tax-ready by default",
          body:
            "Default categories (Meals, Travel, Supplies, Office, Software, Vehicle, Other) map to common deduction lines.",
        },
      ]}
      faqs={[
        {
          q: "Can I import data from Expensify?",
          a: "Not yet — for v1 you'd start fresh by uploading receipts directly. CSV import is on the roadmap.",
        },
        {
          q: "Why is ReceiptBox cheaper?",
          a: "Because it does less. No approvals, no cards, no integrations — just receipts in, exports out.",
        },
      ]}
    />
  );
}

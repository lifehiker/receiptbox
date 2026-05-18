import { MarketingPage } from "@/components/marketing/marketing-page";

export const metadata = {
  title: "Shoeboxed Alternative for Freelancers | ReceiptBox",
  description:
    "ReceiptBox is the Shoeboxed alternative for freelancers and self-employed users — self-serve, faster, and dramatically cheaper.",
  alternates: { canonical: "/compare/shoeboxed-alternative" },
};

export default function ShoeboxedAlternativePage() {
  return (
    <MarketingPage
      badge="vs Shoeboxed"
      title="The Shoeboxed alternative without the $18–$54/month price tag."
      subtitle="Shoeboxed offers mail-in scanning and broad document management. ReceiptBox is laser-focused on the freelancer who just wants a fast scan-to-CSV workflow."
      sections={[
        {
          title: "Self-serve, no mail-in",
          body: "Capture receipts on your phone. No envelopes, no service overhead.",
        },
        {
          title: "Faster scan-to-save",
          body: "OCR fills the form, you confirm in a few seconds, done.",
        },
        {
          title: "Lower monthly cost",
          body: "$7/month. Lock in $59/year for ~30% off.",
        },
      ]}
    />
  );
}

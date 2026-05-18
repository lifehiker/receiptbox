import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReceiptBox — Receipt Scanner App for Freelancers & Taxes",
  description:
    "Scan receipts, extract merchant/date/total, organize them into tax-ready folders, and export CSV or ZIP for your accountant. Built for freelancers and self-employed users.",
  applicationName: "ReceiptBox",
  authors: [{ name: "ReceiptBox" }],
  keywords: [
    "receipt scanner",
    "receipt organizer app",
    "expense receipt tracker",
    "receipt scanner app for taxes",
    "receipt scanner export CSV taxes",
  ],
  openGraph: {
    title: "ReceiptBox — Simple Receipt Scanner for Freelancers",
    description:
      "Scan receipts, organize them into tax-ready folders, export CSV/ZIP for your accountant.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">{children}</body>
    </html>
  );
}

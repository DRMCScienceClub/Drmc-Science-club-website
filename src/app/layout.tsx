import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "DRMC Science Club",
    template: "%s | DRMC Science Club",
  },
  description:
    "The official digital home of DRMC Science Club—nurturing curiosity, scientific thinking, and student innovation at Dhaka Residential Model College.",
  applicationName: "DRMC Science Club",
  keywords: [
    "DRMC Science Club",
    "Dhaka Residential Model College",
    "science club Bangladesh",
    "student science festival",
    "DRMC",
  ],
  authors: [{ name: "DRMC Science Club" }],
  creator: "DRMC Science Club",
  openGraph: {
    type: "website",
    locale: "en_BD",
    siteName: "DRMC Science Club",
    title: "DRMC Science Club",
    description:
      "Curiosity into discovery—explore the activities, festivals, publications, and people of DRMC Science Club.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DRMC Science Club",
    description: "Curiosity into discovery at Dhaka Residential Model College.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

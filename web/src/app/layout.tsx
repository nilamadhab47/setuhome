import type { Metadata } from "next";
import { DM_Sans, EB_Garamond, Noto_Serif_Devanagari } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const dm = DM_Sans({
  variable: "--font-dm",
  subsets: ["latin"],
});

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
});

const devanagari = Noto_Serif_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "SetuHome · सेतु — Bring home with you",
  description:
    "A free app for the Gita, the Ramayana, festival days in your city, and stories for children.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${dm.variable} ${garamond.variable} ${devanagari.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-parchment font-sans text-ink">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

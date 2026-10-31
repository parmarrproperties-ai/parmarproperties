import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { SiteChrome } from "@/site/components/layout/SiteChrome";
import { JsonLd } from "@/site/components/seo/JsonLd";
import {
  ALLOW_INDEXING,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  organizationJsonLd,
  websiteJsonLd,
} from "@/site/lib/seo";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-playfair",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Luxury Apartments & Real Estate in South Mumbai | Parmar Properties",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Parmar Properties, Mumbai real estate advisors since 1981. Browse verified luxury apartments, penthouses and new launches in Worli, Malabar Hill, Prabhadevi, Lower Parel and South Mumbai.",
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_IN",
    images: [{ url: DEFAULT_OG_IMAGE, alt: SITE_NAME }],
  },
  twitter: { card: "summary_large_image" },
  // Staging/preview domains stay out of search until NEXT_PUBLIC_ALLOW_INDEXING=true.
  robots: ALLOW_INDEXING
    ? { index: true, follow: true, googleBot: { "max-image-preview": "large", "max-snippet": -1 } }
    : { index: false, follow: false },
  formatDetection: { telephone: true, email: true, address: true },
  category: "real estate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" className={`${playfair.variable} ${plusJakarta.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-mineral text-ink">
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <SiteChrome>{children}</SiteChrome>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

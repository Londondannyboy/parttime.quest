import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "@/stack/server";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Fractional Jobs UK | CFO, CTO, CMO Roles | Fractional.Quest",
    template: "%s | Fractional.Quest"
  },
  description: "Discover the best fractional jobs in the UK. Browse fractional CFO, CMO, CTO and executive roles in London. Connect with leading fractional recruitment agencies and find flexible leadership opportunities.",
  keywords: ["fractional jobs", "fractional jobs UK", "fractional CFO", "fractional CTO", "fractional CMO", "fractional COO", "fractional executive", "part-time executive", "fractional recruitment agencies", "London fractional jobs"],
  authors: [{ name: "Fractional.Quest" }],
  creator: "Fractional.Quest",
  publisher: "Fractional.Quest",
  metadataBase: new URL("https://fractional.quest"),
  alternates: {
    canonical: "https://fractional.quest",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://fractional.quest",
    siteName: "Fractional.Quest",
    title: "Fractional Jobs UK | CFO, CTO, CMO Roles",
    description: "Discover the best fractional jobs in the UK. Browse fractional CFO, CMO, CTO and executive roles in London.",
    // Images auto-generated from app/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: "Fractional Jobs UK | Fractional.Quest",
    description: "Discover the best fractional jobs in the UK. Browse fractional CFO, CMO, CTO and executive roles.",
    site: "@fractionalquest",
    creator: "@fractionalquest",
    // Images auto-generated from app/twitter-image.tsx
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// JSON-LD Structured Data for the site
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://fractional.quest/#organization",
  name: "Fractional.Quest",
  alternateName: ["Fractional Quest", "FractionalQuest"],
  url: "https://fractional.quest",
  logo: {
    "@type": "ImageObject",
    url: "https://fractional.quest/logo.svg",
    width: "512",
    height: "512"
  },
  image: "https://fractional.quest/logo.svg",
  description: "UK marketplace for fractional jobs and executive services. Browse fractional CFO, CTO, CMO roles or hire fractional executives.",
  foundingDate: "2024",
  sameAs: [
    "https://twitter.com/fractionalquest",
    "https://linkedin.com/company/fractionalquest"
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    url: "https://fractional.quest/contact",
    availableLanguage: "English"
  },
  areaServed: {
    "@type": "Country",
    name: "United Kingdom"
  }
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Fractional.Quest",
  alternateName: ["Fractional Quest", "FractionalQuest", "Fractional Jobs UK"],
  url: "https://fractional.quest",
  description: "UK marketplace for fractional jobs and executive services. Browse fractional CFO, CMO, CTO roles.",
  inLanguage: "en-GB",
  publisher: {
    "@type": "Organization",
    name: "Fractional.Quest",
    url: "https://fractional.quest",
    logo: {
      "@type": "ImageObject",
      url: "https://fractional.quest/logo.svg"
    }
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://fractional.quest/fractional-jobs?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-white text-gray-900`}
      >
        <StackProvider app={stackServerApp}>
          <StackTheme>
            <Suspense fallback={<div className="h-16 bg-white border-b border-gray-200" />}>
              <Navigation />
            </Suspense>
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <CookieConsent />
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}

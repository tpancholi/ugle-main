import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import GoogleConsentManager from "./components/cookie/GoogleConsentManager";
import { CookieConsentProvider } from "./context/CookieConsentContext";
import CookieManager from "./components/cookie/CookieManager";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const sfMono = localFont({
  src: [
    {
      path: "./fonts/sf-mono/sf-mono-light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/sf-mono/sf-mono-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/sf-mono/sf-mono-medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/sf-mono/sf-mono-semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/sf-mono/sf-mono-bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ugle.ai"),
  title: {
    default: "Ugle | Local-First Media Search",
    template: "%s | Ugle",
  },
  description:
    "Find the exact moment inside any recording, locally on your machine, with no uploads and no cloud.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ugle.ai",
    siteName: "Ugle",
    title: "Ugle | Local-First Media Search",
    description:
      "Find the exact moment inside any recording, locally on your machine, with no uploads and no cloud.",
    images: [
      {
        url: "/ugle-icon.png",
        width: 800,
        height: 800,
        alt: "Ugle - Local-First Media Search",
      },
      {
        url: "/UgleOGImage.png",
        width: 1200,
        height: 630,
        alt: "Ugle - Local-First Media Search",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ugle | Local-First Media Search",
    description:
      "Find the exact moment inside any recording, locally on your machine, with no uploads and no cloud.",
    images: ["/UgleOGImage.png"],
  },
  other: {
    rel: "preconnect",
    url: "https://challenges.cloudflare.com",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://ugle.ai/#organization",
      name: "Ugle",
      url: "https://ugle.ai",
      logo: "https://ugle.ai/Ugle%20Logo.png",
      description:
        "The local-first search application for media professionals.",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Customer Support",
        email: "support@ugle.ai",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://ugle.ai/#website",
      url: "https://ugle.ai",
      name: "Ugle",
      description:
        "Find the exact moment inside any recording, locally on your machine, with no uploads and no cloud.",
      publisher: {
        "@id": "https://ugle.ai/#organization",
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://ugle.ai/#software",
      name: "Ugle",
      operatingSystem: "macOS 12+, Windows 10+ 64-bit",
      applicationCategory: "MultimediaApplication",
      description:
        "Find the exact moment inside any recording, locally on your machine, with no uploads and no cloud.",
      url: "https://ugle.ai",
      image: "https://ugle.ai/ugle-icon.png",
      offers: {
        "@type": "Offer",
        price: "20.00",
        priceCurrency: "USD",
        url: "https://ugle.ai/pricing",
      },
      featureList: [
        "On-device local transcription",
        "Sub-30ms search across media archives",
        "Zero cloud uploads & 100% private",
        "90+ supported languages",
        "Precision timestamp clip extraction",
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${sfMono.variable} h-full antialiased`}
    >
      <head>
        <GoogleConsentManager gtmId="GTM-53P7CN9X" />
      </head>
      <body className="min-h-full flex flex-col">
        <CookieConsentProvider>
          <Header />
          {children}
          <Footer />
          <ScrollToTop />
          <CookieManager />
        </CookieConsentProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}

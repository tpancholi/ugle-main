import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

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
  title: "Ugle | Local-First Media Search",
  description:
    "Find the exact moment inside any recording, locally on your machine, with no uploads and no cloud.",
  other: {
    rel: "preconnect",
    url: "https://challenges.cloudflare.com",
  },
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
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}

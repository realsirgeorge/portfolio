import React from "react";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Toaster } from "sonner";
import { PROFILE } from "@/lib/portfolio-data";
import { KNIGHT_LABS, SITE_URL } from "@/lib/site";
import "./globals.css";

/* Self-hosted OFL fonts (licences in app/fonts). No third-party font CDN. */
const newsreader = localFont({
  src: [
    { path: "./fonts/newsreader-latin-opsz-normal.woff2", style: "normal", weight: "200 800" },
    { path: "./fonts/newsreader-latin-opsz-italic.woff2", style: "italic", weight: "200 800" },
  ],
  variable: "--font-newsreader",
  display: "swap",
});

const plexSans = localFont({
  src: [
    { path: "./fonts/ibm-plex-sans-latin-wght-normal.woff2", style: "normal", weight: "100 700" },
    { path: "./fonts/ibm-plex-sans-latin-wght-italic.woff2", style: "italic", weight: "100 700" },
  ],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = localFont({
  src: [
    { path: "./fonts/ibm-plex-mono-latin-400-normal.woff2", style: "normal", weight: "400" },
    { path: "./fonts/ibm-plex-mono-latin-500-normal.woff2", style: "normal", weight: "500" },
  ],
  variable: "--font-plex-mono",
  display: "swap",
});

const DESCRIPTION =
  "George Wanyoike (Sir G) is a Nairobi security practitioner and the founder of Knight Labs. Full-lifecycle security audits, a production ISP, and the methodology behind both.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "George Wanyoike — Security practitioner, founder of Knight Labs",
    template: "%s — George Wanyoike",
  },
  description: DESCRIPTION,
  applicationName: "George Wanyoike",
  keywords: [
    "George Wanyoike",
    "Sir G",
    "Knight Labs",
    "penetration testing Kenya",
    "security audit",
    "cybersecurity Nairobi",
    "network engineering",
  ],
  authors: [{ name: PROFILE.name, url: SITE_URL }],
  creator: PROFILE.name,
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": `${SITE_URL}/feed.xml` },
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: SITE_URL,
    siteName: "George Wanyoike",
    title: "George Wanyoike — Security practitioner, founder of Knight Labs",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "George Wanyoike — Security practitioner",
    description: DESCRIPTION,
  },
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f2ea" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1113" },
  ],
  width: "device-width",
  initialScale: 1,
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: PROFILE.name,
      alternateName: ["George Wanyoike", PROFILE.alias],
      url: SITE_URL,
      jobTitle: "Founder, Knight Labs",
      description: DESCRIPTION,
      worksFor: { "@id": `${SITE_URL}/#organization` },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Nairobi",
        addressCountry: "KE",
      },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Jomo Kenyatta University of Agriculture and Technology",
      },
      knowsAbout: [
        "Penetration testing",
        "Security auditing",
        "Network engineering",
        "MikroTik RouterOS",
        "Application security",
      ],
      sameAs: [PROFILE.linkedin, PROFILE.github.replace(/\/$/, "")],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "George Wanyoike",
      description: DESCRIPTION,
      inLanguage: "en-KE",
      publisher: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: KNIGHT_LABS.name,
      url: KNIGHT_LABS.url,
      email: KNIGHT_LABS.email,
      founder: { "@id": `${SITE_URL}/#person` },
      areaServed: "KE",
      address: { "@type": "PostalAddress", addressLocality: "Nairobi", addressCountry: "KE" },
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
      lang="en-KE"
      suppressHydrationWarning
      className={`${newsreader.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
        >
          Skip to content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
        <Toaster position="top-right" richColors />
        <script
          type="application/ld+json"
          // Static, build-time data only; no user input reaches this.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
      </body>
    </html>
  );
}

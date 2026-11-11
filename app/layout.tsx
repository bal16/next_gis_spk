import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
// import { FONT } from "@/lib/config";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { QueryParamNotifier } from "@/components/QueryParamNotifier";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import { TourProvider } from "@/features/tour/provider";
import { DemoBanner } from "@/components/DemoBanner";

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://spk-gis.vercel.app");

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SPK Prioritas Perawatan Gedung | Fakultas Teknik UNNES",
    template: "%s | SPK-GIS FT UNNES",
  },
  description:
    "Sistem Pendukung Keputusan Penentuan Prioritas Perawatan Gedung Fakultas Teknik Universitas Negeri Semarang berbasis GIS dengan Metode Simple Additive Weighting (SAW).",
  applicationName: "SPK Gedung FT UNNES",
  authors: [{ name: "Ahmad Hamid Balya", url: "https://github.com/bal16" }],
  creator: "Ahmad Hamid Balya (@blly)",
  publisher: "Fakultas Teknik UNNES",
  keywords: [
    "SPK",
    "Sistem Pendukung Keputusan",
    "GIS",
    "Geographic Information System",
    "SAW",
    "Simple Additive Weighting",
    "Pemeliharaan Gedung",
    "Fakultas Teknik",
    "UNNES",
  ],
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "none",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "SPK Prioritas Perawatan Gedung | Fakultas Teknik UNNES",
    description:
      "Sistem Pendukung Keputusan Penentuan Prioritas Perawatan Gedung Fakultas Teknik UNNES berbasis GIS dengan Metode Simple Additive Weighting (SAW).",
    url: "/",
    siteName: "SPK-GIS FT UNNES",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SPK Prioritas Perawatan Gedung Fakultas Teknik UNNES",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SPK Prioritas Perawatan Gedung | Fakultas Teknik UNNES",
    description:
      "Sistem Pendukung Keputusan Penentuan Prioritas Perawatan Gedung Fakultas Teknik UNNES berbasis GIS dengan Metode SAW.",
    site: "@blly",
    creator: "@blly",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SPK Prioritas Perawatan Gedung Fakultas Teknik UNNES",
      },
    ],
  },
};

const InterFont = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${InterFont.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <TourProvider>
              <DemoBanner />
              <Toaster />
              <Suspense>
                <QueryParamNotifier />
              </Suspense>
              {children}
            </TourProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

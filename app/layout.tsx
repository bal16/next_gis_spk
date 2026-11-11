import type { Metadata } from "next";
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
  process.env.NEXT_PUBLIC_APP_URL || "https://spk-gedung-ft.unnes.ac.id";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SPK Prioritas Perawatan Gedung | Fakultas Teknik UNNES",
    template: "%s | SPK-GIS FT UNNES",
  },
  description:
    "Sistem Pendukung Keputusan Penentuan Prioritas Perawatan Gedung Fakultas Teknik Universitas Negeri Semarang berbasis GIS dengan Metode Simple Additive Weighting (SAW).",
  applicationName: "SPK Gedung FT UNNES",
  authors: [{ name: "Fakultas Teknik UNNES", url: "https://ft.unnes.ac.id" }],
  creator: "Fakultas Teknik UNNES",
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

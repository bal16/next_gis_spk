import type { Metadata } from "next";
import HomePage from "@/features/home/page";

export const metadata: Metadata = {
  title: "Peta & Pemeringkatan Gedung",
  description:
    "Visualisasi peta interaktif dan pemeringkatan prioritas pemeliharaan gedung Fakultas Teknik UNNES menggunakan metode SAW.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Peta & Pemeringkatan Gedung | SPK-GIS FT UNNES",
    description:
      "Visualisasi peta interaktif dan pemeringkatan prioritas pemeliharaan gedung Fakultas Teknik UNNES menggunakan metode SAW.",
    url: "/",
    siteName: "SPK-GIS FT UNNES",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Peta Prioritas Perawatan Gedung FT UNNES",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Peta & Pemeringkatan Gedung | SPK-GIS FT UNNES",
    description:
      "Visualisasi peta interaktif dan pemeringkatan prioritas pemeliharaan gedung Fakultas Teknik UNNES menggunakan metode SAW.",
    site: "@blly",
    creator: "@blly",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Peta Prioritas Perawatan Gedung FT UNNES",
      },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "SPK Prioritas Perawatan Gedung FT UNNES",
  description:
    "Sistem Pendukung Keputusan Penentuan Prioritas Perawatan Gedung Fakultas Teknik UNNES berbasis GIS dengan Metode Simple Additive Weighting (SAW).",
  url: "https://spk-gis.vercel.app",
  applicationCategory: "DecisionSupportSystem",
  operatingSystem: "All",
  author: {
    "@type": "Person",
    name: "Ahmad Hamid Balya",
    alternateName: "@blly",
    url: "https://github.com/bal16",
  },
  publisher: {
    "@type": "Organization",
    name: "Fakultas Teknik Universitas Negeri Semarang",
    url: "https://ft.unnes.ac.id",
  },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePage />
    </>
  );
}

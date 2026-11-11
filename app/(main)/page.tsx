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

export default HomePage;

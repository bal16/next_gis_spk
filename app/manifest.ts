import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SPK Prioritas Perawatan Gedung FT UNNES",
    short_name: "SPK-GIS",
    description:
      "Sistem Pendukung Keputusan Pemeliharaan Gedung Berbasis GIS Menggunakan Metode Simple Additive Weighting (SAW).",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#2563eb",
    icons: [
      {
        src: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}

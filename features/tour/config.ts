import type { DriveStep } from "driver.js";

export const publicTourSteps: DriveStep[] = [
  {
    element: "[data-tour='map']",
    popover: {
      title: "Peta Gedung",
      description:
        "Peta interaktif menampilkan semua gedung Fakultas Teknik UNNES. Warna marker menunjukkan level prioritas perawatan.",
      side: "right",
    },
  },
  {
    element: "[data-tour='ranking-table']",
    popover: {
      title: "Tabel Peringkat",
      description:
        "Gedung diurutkan berdasarkan skor SAW. Skor lebih tinggi berarti prioritas perawatan lebih tinggi. Klik baris untuk terbang ke gedung di peta.",
      side: "right",
    },
  },
  {
    element: "[data-tour='priority-filters']",
    popover: {
      title: "Filter Prioritas",
      description:
        "Tampilkan gedung berdasarkan level prioritas: Semua, Tinggi, Sedang, atau Rendah.",
      side: "bottom",
    },
  },
  {
    element: "[data-tour='search-input']",
    popover: {
      title: "Pencarian",
      description: "Cari gedung berdasarkan nama atau kode secara real-time.",
      side: "bottom",
    },
  },
];

export const adminTourSteps: DriveStep[] = [
  {
    element: "[data-tour='admin-sidebar']",
    popover: {
      title: "Navigasi Admin",
      description:
        "Sidebar untuk navigasi ke berbagai fitur admin. Klik menu untuk berpindah halaman.",
      side: "right",
    },
  },
  {
    element: "[data-tour='nav-overview']",
    popover: {
      title: "Overview",
      description:
        "Ringkasan hasil terakhir: rata-rata skor, distribusi bobot, peta prioritas, dan tabel perangkingan.",
      side: "right",
    },
  },
  {
    element: "[data-tour='nav-buildings']",
    popover: {
      title: "Buildings",
      description:
        "Kelola data gedung: tambah, edit, hapus, dan lihat riwayat penilaian per gedung.",
      side: "right",
    },
  },
  {
    element: "[data-tour='nav-weights']",
    popover: {
      title: "Bobot Kriteria",
      description:
        "Atur bobot kriteria utama dan sub-kriteria untuk perhitungan SAW. Total harus 100%.",
      side: "right",
    },
  },
  {
    element: "[data-tour='nav-dss']",
    popover: {
      title: "Perhitungan SAW",
      description:
        "Jalankan perhitungan metode SAW (Simple Additive Weighting) dan lihat hasil perankingan.",
      side: "right",
    },
  },
  {
    element: "[data-tour='user-menu']",
    popover: {
      title: "Menu Pengguna",
      description: "Akses profil, ganti tema (terang/gelap), dan logout.",
      side: "bottom",
    },
  },
];

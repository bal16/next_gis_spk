import type { DriveStep } from "driver.js";
import { useMobileDrawerStore } from "@/features/home/store/useMobileDrawer";

const DRAWER_OPEN_DELAY_MS = 520;
const DRAWER_CLOSE_DELAY_MS = 400;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

export const publicMobileTourSteps: DriveStep[] = [
  {
    popover: {
      title: "Peta Gedung Interaktif",
      description:
        "Peta menampilkan semua gedung Fakultas Teknik UNNES. Warna marker menunjukkan level prioritas perawatan. Ketuk marker untuk melihat detail.",
    },
  },
  {
    element: "[data-tour='mobile-drawer-trigger']",
    popover: {
      title: "Daftar & Filter Gedung",
      description:
        'Ketuk tombol "Lihat Daftar" untuk membuka pencarian gedung, filter prioritas, dan tabel peringkat SAW.',
      side: "top",
      align: "center",
      onNextClick: async (_el, _step, { driver }) => {
        useMobileDrawerStore.getState().setOpen(true);
        await wait(DRAWER_OPEN_DELAY_MS);
        driver.moveNext();
      },
    },
  },
  {
    element: "[data-tour='mobile-search-input']",
    data: { insideDrawer: true },
    popover: {
      title: "Pencarian",
      description: "Cari gedung berdasarkan nama atau kode secara real-time.",
      side: "bottom",
      align: "center",
      onPrevClick: async (_el, _step, { driver }) => {
        useMobileDrawerStore.getState().setOpen(false);
        await wait(DRAWER_CLOSE_DELAY_MS);
        driver.movePrevious();
      },
    },
  },
  {
    element: "[data-tour='mobile-priority-filters']",
    data: { insideDrawer: true },
    popover: {
      title: "Filter Prioritas",
      description:
        "Tampilkan gedung berdasarkan level prioritas: Semua, Tinggi, Sedang, atau Rendah.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "[data-tour='mobile-ranking-table']",
    data: { insideDrawer: true },
    popover: {
      title: "Tabel Peringkat",
      description:
        "Gedung diurutkan berdasarkan skor SAW. Skor lebih tinggi berarti prioritas perawatan lebih tinggi. Ketuk baris untuk terbang ke gedung di peta.",
      side: "top",
      align: "center",
      onNextClick: async (_el, _step, { driver }) => {
        useMobileDrawerStore.getState().setOpen(false);
        await wait(DRAWER_CLOSE_DELAY_MS);
        driver.moveNext();
      },
    },
  },
  {
    element: "[data-tour='public-header-actions']",
    popover: {
      title: "Menu & Panduan",
      description:
        "Buka panduan kembali kapan saja, ubah tema tampilan (terang/gelap), atau login ke akun Anda.",
      side: "bottom",
      align: "end",
      onPrevClick: async (_el, _step, { driver }) => {
        useMobileDrawerStore.getState().setOpen(true);
        await wait(DRAWER_OPEN_DELAY_MS);
        driver.movePrevious();
      },
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
    element: "[data-tour='nav-invitations']",
    popover: {
      title: "Token Undangan",
      description:
        "Kelola dan buat kode token undangan untuk registrasi staf atau surveyor baru.",
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

export const adminMobileTourSteps: DriveStep[] = [
  {
    element: "[data-tour='admin-sidebar-trigger']",
    popover: {
      title: "Navigasi Admin",
      description:
        "Ketuk tombol ini untuk membuka menu sidebar: Overview, Buildings, Bobot Kriteria, Perhitungan SAW, dan Token Undangan.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "[data-tour='user-menu']",
    popover: {
      title: "Menu Pengguna",
      description:
        "Akses profil akun, kembali ke beranda, ganti tema (terang/gelap), dan logout.",
      side: "bottom",
      align: "end",
    },
  },
];

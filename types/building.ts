export interface Building {
  id: number;
  kode_gedung: string;
  nama_gedung: string;
  lokasi: {
    lng: number;
    lat: number;
  };
  skor_akhir: number;
  status_prioritas: "Prioritas Tinggi" | "Prioritas Sedang" | "Prioritas Rendah";
  kriteria: {
    C1_Usia: number;
    C2_Kondisi_Struktur: "Baik" | "Rusak Ringan" | "Rusak Berat";
    C2_Kondisi_Arsitektural: "Baik" | "Rusak Ringan" | "Rusak Berat";
    C2_Kondisi_MEP: "Baik" | "Rusak Ringan" | "Rusak Berat";
    C3_Utilitas: "Rendah" | "Sedang" | "Tinggi";
    C4_Dampak: "Rendah" | "Sedang" | "Tinggi";
  };
}

export type PriorityFilter = "Semua" | "Prioritas Tinggi" | "Prioritas Sedang" | "Prioritas Rendah";

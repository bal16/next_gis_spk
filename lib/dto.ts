import { BuildingFormData } from "@/lib/validators/building";
import type { Building } from "@/types/building";

export const buildingFormDTO = (building: Building) => ({
  nama_gedung: building.nama_gedung,
  kode_gedung: building.kode_gedung,
  C1_Usia: `${building.kriteria.C1_Usia}`,
  C2_Kondisi_Struktur: building.kriteria.C2_Kondisi_Struktur,
  C2_Kondisi_Arsitektural: building.kriteria.C2_Kondisi_Arsitektural,
  C2_Kondisi_MEP: building.kriteria.C2_Kondisi_MEP,
  C3_Utilitas: building.kriteria.C3_Utilitas,
  C4_Dampak: building.kriteria.C4_Dampak,
  lat: building.lokasi.lat,
  lng: building.lokasi.lng,
});

export const buildingResDTO = (building: BuildingFormData) => ({
  nama_gedung: building.nama_gedung,
  kode_gedung: building.kode_gedung,
  kriteria: {
    C1_Usia: building.C1_Usia,
    C2_Kondisi_Struktur: building.C2_Kondisi_Struktur,
    C2_Kondisi_Arsitektural: building.C2_Kondisi_Arsitektural,
    C2_Kondisi_MEP: building.C2_Kondisi_MEP,
    C3_Utilitas: building.C3_Utilitas,
    C4_Dampak: building.C4_Dampak,
  },
  lokasi: {
    lat: building.lat,
    lng: building.lng,
  },
});

import { z } from "zod";

const requiredString = z.string().min(1, "Field ini tidak boleh kosong");

export const buildingSchema = z.object({
  nama_gedung: requiredString,
  kode_gedung: requiredString,
  C1_Usia: z
    .number({ error: "Usia harus berupa angka" })
    .min(0, "Usia tidak boleh negatif"),
  C2_Kondisi_Struktur: z.enum(["Baik", "Rusak Ringan", "Rusak Berat"], {
    error: "Pilih salah satu kondisi struktur",
  }),
  C2_Kondisi_Arsitektural: z.enum(["Baik", "Rusak Ringan", "Rusak Berat"], {
    error: "Pilih salah satu kondisi arsitektural",
  }),
  C2_Kondisi_MEP: z.enum(["Baik", "Rusak Ringan", "Rusak Berat"], {
    error: "Pilih salah satu kondisi MEP",
  }),
  C3_Utilitas: z.enum(["Rendah", "Sedang", "Tinggi"], {
    error: "Pilih salah satu tingkat utilitas",
  }),
  C4_Dampak: z.enum(["Rendah", "Sedang", "Tinggi"], {
    error: "Pilih salah satu dampak kerusakan",
  }),
  lat: z.number({ error: "Latitude harus berupa angka" }),
  lng: z.number({ error: "Longitude harus berupa angka" }),
});
  export type BuildingFormData = z.infer<typeof buildingSchema>;
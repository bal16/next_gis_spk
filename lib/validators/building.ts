import { z } from "zod";

const requiredString = z.string().min(1, "Field ini tidak boleh kosong");

export const buildingSchema = z.object({
  name: requiredString,
  code: requiredString,
  age: z.coerce
    .number<string>({ error: "Usia harus berupa angka" })
    .min(0, "Usia tidak boleh negatif"),
  structure: z.enum(["Baik", "Rusak Ringan", "Rusak Berat"], {
    error: "Pilih salah satu kondisi struktur",
  }),
  architecture: z.enum(["Baik", "Rusak Ringan", "Rusak Berat"], {
    error: "Pilih salah satu kondisi arsitektural",
  }),
  mep: z.enum(["Baik", "Rusak Ringan", "Rusak Berat"], {
    error: "Pilih salah satu kondisi mep",
  }),
  utility: z.enum(["Rendah", "Sedang", "Tinggi"], {
    error: "Pilih salah satu tingkat utilitas",
  }),
  damage: z.enum(["Rendah", "Sedang", "Tinggi"], {
    error: "Pilih salah satu dampak kerusakan",
  }),
  lat: z.number({ error: "Latitude harus berupa angka" }),
  lng: z.number({ error: "Longitude harus berupa angka" }),
});
export type BuildingFormData = z.infer<typeof buildingSchema>;

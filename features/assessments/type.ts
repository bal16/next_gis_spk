import z from "zod";

export const createAssessmentSchema = z.object({
  age: z.coerce.number<number>().min(0, "Umur harus minimal 0"),
  structure: z.coerce
    .number<number>("Harus berupa angka")
    .min(1, "Minimal 1")
    .max(3, "Maksimal 3"),
  architecture: z.coerce
    .number<number>("Harus berupa angka")
    .min(1, "Minimal 1")
    .max(3, "Maksimal 3"),
  mep: z.coerce
    .number<number>("Harus berupa angka")
    .min(1, "Minimal 1")
    .max(3, "Maksimal 3"),
  utility: z.coerce
    .number<number>("Harus berupa angka")
    .min(1, "Minimal 1")
    .max(3, "Maksimal 3"),
  damage: z.coerce
    .number<number>("Harus berupa angka")
    .min(1, "Minimal 1")
    .max(3, "Maksimal 3"),
  lastMaintenance: z.coerce.date<Date>("Tanggal pemeliharaan tidak valid"),
});

export type TCreateAssessment = z.infer<typeof createAssessmentSchema>;

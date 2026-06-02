import z from "zod";

export const createAssessmentSchema = z.object({
  age: z.coerce.number<number>().min(0, "Age must be a positive number"),
  structure: z.coerce
    .number<number>()
    .min(0, "Structure must be a positive number")
    .max(3, "Structure must be at most 3"),
  architecture: z.coerce
    .number<number>()
    .min(0, "Architecture must be a positive number")
    .max(3, "Architecture must be at most 3"),
  mep: z.coerce
    .number<number>()
    .min(0, "mep must be a positive number")
    .max(3, "mep must be at most 3"),
  utility: z.coerce
    .number<number>()
    .min(0, "Utility must be a positive number")
    .max(3, "Utility must be at most 3"),
  damage: z.coerce
    .number<number>()
    .min(0, "Damage must be a positive number")
    .max(3, "Damage must be at most 3"),
  lastMaintenance: z.coerce.date<Date>("Last Maintenance must be a valid date"),
});

export type TCreateAssessment = z.infer<typeof createAssessmentSchema>;

import { z } from "zod";

export const weightsSchema = z
  .object({
    c1: z.coerce
      .number<string>({ error: "Bobot harus berupa angka" })
      .min(0, "Bobot tidak boleh negatif")
      .max(100, "Bobot tidak boleh lebih dari 100"),
    c2: z.coerce
      .number<string>({ error: "Bobot harus berupa angka" })
      .min(0, "Bobot tidak boleh negatif")
      .max(100, "Bobot tidak boleh lebih dari 100"),
    c3: z.coerce
      .number<string>({ error: "Bobot harus berupa angka" })
      .min(0, "Bobot tidak boleh negatif")
      .max(100, "Bobot tidak boleh lebih dari 100"),
    c4: z.coerce
      .number<string>({ error: "Bobot harus berupa angka" })
      .min(0, "Bobot tidak boleh negatif")
      .max(100, "Bobot tidak boleh lebih dari 100"),
  })
  .refine(
    (data) => {
      const total = Object.values(data).reduce(
        (sum, value) => sum + (Number(value) || 0),
        0
      );
      return Math.round(total) === 100;
    },
    {
      message: "Total bobot harus 100%",
      path: ["root"], // Arahkan error ke root form
    }
  );

export type Weights = z.infer<typeof weightsSchema>;

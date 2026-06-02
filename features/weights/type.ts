import z from "zod";

export const updateWeightsSchema = z.object({
  value: z.coerce
    .number<number>("Must be a valid number")
    .min(0)
    .max(1, "Maximum weight is 1 (100%)"),
});

export type TUpdateWeights = z.infer<typeof updateWeightsSchema>;

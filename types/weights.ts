import { z } from "zod";
import { weightsSchema } from "@/lib/validators/settings";

export type Weights = z.infer<typeof weightsSchema>;

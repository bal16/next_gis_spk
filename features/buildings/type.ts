import z from "zod";

type TPriority = "Prioritas Tinggi" | "Prioritas Sedang" | "Prioritas Rendah" | "Belum Dihitung";

export interface TBuilding {
  id: string;
  code: string;
  name: string;
  longitude: number;
  latitude: number;
  score: number;
  priority: TPriority;
  criterias: {
    age: number;
    structure: number;
    architecture: number;
    mep: number;
    utility: number;
    damage: number;
    lastMaintenance: Date | null;
  };
}

export type PriorityFilter = "Semua" | TPriority;

export const createBuildingSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required").max(20, "Name must be at most 20 characters"),
  latitude: z.coerce.number<number>("Must be a valid number"),
  longitude: z.coerce.number<number>("Must be a valid number"),
});

export const updateBuildingSchema = z.object({
  name: z.string().min(1, "Name is required").max(20, "Name must be at most 20 characters"),
  latitude: z.coerce.number<number>("Must be a valid number"),
  longitude: z.coerce.number<number>("Must be a valid number"),
});

export type TCreateBuilding = z.infer<typeof createBuildingSchema>;
export type TUpdateBuilding = z.infer<typeof updateBuildingSchema>;

export type TCreateBuildingResponse = TCreateBuilding & {
  id: string;
};

export type TGetBuildingsResponse = Omit<
  Omit<TBuilding, "criterias">,
  "priority"
> & {
  // assessments: TBuilding["criterias"][];
  priority: number;
  sawRunDetails: {
    score: number;
    priority: number;
    assessment: TBuilding["criterias"];
  }[];
};

export type TAssessment = TBuilding["criterias"] & {
  id: string;
};

export type TGetBuildingAssessmentsResponse = Omit<
  Omit<TBuilding, "criterias">,
  "priority"
> & {
  assessments: TAssessment[];
  priority: number;
};

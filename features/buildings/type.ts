import z from "zod";

type TPriority =
  | "Prioritas Tinggi"
  | "Prioritas Sedang"
  | "Prioritas Rendah"
  | "Belum Dihitung";

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
  code: z.string().trim().min(1, "Kode wajib diisi"),
  name: z
    .string()
    .trim()
    .min(1, "Nama wajib diisi")
    .max(20, "Nama maksimal 20 karakter"),
  latitude: z.coerce
    .number<number>("Harus berupa angka")
    .min(-90, "Latitude harus di antara -90 dan 90")
    .max(90, "Latitude harus di antara -90 dan 90"),
  longitude: z.coerce
    .number<number>("Harus berupa angka")
    .min(-180, "Longitude harus di antara -180 dan 180")
    .max(180, "Longitude harus di antara -180 dan 180"),
});

export const updateBuildingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nama wajib diisi")
    .max(20, "Nama maksimal 20 karakter"),
  latitude: z.coerce
    .number<number>("Harus berupa angka")
    .min(-90, "Latitude harus di antara -90 dan 90")
    .max(90, "Latitude harus di antara -90 dan 90"),
  longitude: z.coerce
    .number<number>("Harus berupa angka")
    .min(-180, "Longitude harus di antara -180 dan 180")
    .max(180, "Longitude harus di antara -180 dan 180"),
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

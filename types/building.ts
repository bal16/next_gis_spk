type TPriority = "Prioritas Tinggi" | "Prioritas Sedang" | "Prioritas Rendah";
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
    // structure: "Baik" | "Rusak Ringan" | "Rusak Berat";
    // architecture: "Baik" | "Rusak Ringan" | "Rusak Berat";
    // mep: "Baik" | "Rusak Ringan" | "Rusak Berat";
    // utility: "Rendah" | "Sedang" | "Tinggi";
    // damage: "Rendah" | "Sedang" | "Tinggi";
  };
}

export type PriorityFilter = "Semua" | TPriority;

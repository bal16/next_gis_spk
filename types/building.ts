type TPriority = "Prioritas Tinggi" | "Prioritas Sedang" | "Prioritas Rendah";
export interface TBuilding {
  id: number;
  code: string;
  name: string;
  location: {
    lng: number;
    lat: number;
  };
  score: number;
  priority: TPriority;
  criterias: {
    age: number;
    structure: "Baik" | "Rusak Ringan" | "Rusak Berat";
    architecture: "Baik" | "Rusak Ringan" | "Rusak Berat";
    MEP: "Baik" | "Rusak Ringan" | "Rusak Berat";
    utility: "Rendah" | "Sedang" | "Tinggi";
    damage: "Rendah" | "Sedang" | "Tinggi";
  };
}

export type PriorityFilter = "Semua" | TPriority;

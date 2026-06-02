import type { TWeight } from "../weights/api/get-weights";

export type TGetResultsResponse = {
  id: string;
  date: string;
  averageScore: number;
  totalBuildings: number;
  snapshotWeights: TWeight[];
  sawRunDetails: {
    id: string;
    score: number;
    priority: number;
    buildingId: string;
  }[];
};



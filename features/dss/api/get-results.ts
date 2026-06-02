"use server";
import type { TBuilding } from "@/features/buildings/type";
import type { TWeight } from "@/features/weights/api/get-weights";
// import { publicClient } from "@/lib/api/public";
import backendClient from "@/lib/api/server";
// import { buildingsData } from "@/lib/mock/buildings";
// import type { TBuilding } from "@/types/building";

export type TGetResultsResponse = {
  id: string;
  date: string;
  averageScore: number;
  totalBuildings: number;
  snapshotWeights: TWeight[];
  sawRunDetails: {
    id: string;
    sawRunId: string;
    score: number;
    priority: number;
    buildingId: string;
    building: TBuilding;
    assessment: TBuilding["criterias"];
  }[];
};

export const getResultDatas = async () => {
  // await new Promise((resolve) => setTimeout(resolve, 500));
  const response = await backendClient.get("/dss/runs");
  const data = await response.data;
  const { data: results } = data;
  // di BE building.assessments di fe diubah menjadi building.criterias
  return results as TGetResultsResponse[];
};

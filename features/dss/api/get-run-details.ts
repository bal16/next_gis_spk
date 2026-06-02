"use server";
// import { publicClient } from "@/lib/api/public";
import type { SuccessResponse } from "@/types/apiResponse";
import type { TGetResultsResponse } from "./get-results";
import backendClient from "@/lib/api/server";
// import { buildingsData } from "@/lib/mock/buildings";
// import type { TBuilding } from "@/types/building";

export const getRunDetailsDatas = async (runId: string) => {
  // await new Promise((resolve) => setTimeout(resolve, 500));
  const response = await backendClient.get<
    SuccessResponse<TGetResultsResponse>
  >(`/dss/runs/${runId}`);
  const data = response.data;
  const { data: results } = data;
  // di BE building.assessments di fe diubah menjadi building.criterias
  return results;
};

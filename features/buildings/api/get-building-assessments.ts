"use server";
// import { publicClient } from "@/lib/api/public";
import backendClient from "@/lib/api/server";
import type { TGetBuildingAssessmentsResponse } from "../type";
import type { SuccessResponse } from "@/types/apiResponse";
// import { buildingsData } from "@/lib/mock/buildings";

export const getBuildingAssessmentsDatas = async (code: string) => {
  // await new Promise((resolve) => setTimeout(resolve, 500));
  const response = await backendClient.get<
    SuccessResponse<TGetBuildingAssessmentsResponse>
  >(`/buildings/${code}/assessments`);
  const data = response.data;
  const { data: buildingAssessments } = data;
  // di BE building.assessments di fe diubah menjadi building.criterias
  return buildingAssessments;
};

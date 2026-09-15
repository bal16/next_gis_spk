"use server";
import backendClient from "@/lib/api/server";
// import { publicClient } from "@/lib/api/public";
import type { SuccessResponse } from "@/types/apiResponse";
import type { TCreateAssessment } from "../type";
// import type { TBuilding } from "../type";
// import { buildingsData } from "@/lib/mock/buildings";
// import type { TBuilding } from "@/types/building";

export const createAssessment = async (
  code: string,
  data: TCreateAssessment
) => {
  // await new Promise((resolve) => setTimeout(resolve, 500));
  const response = await backendClient.post<SuccessResponse<boolean>>(
    `/buildings/${code}/assessments`,
    data
  );
  const responseData = response.data;
  const { statusCode, data: assessmentData } = responseData;

  if (statusCode !== 201) {
    throw new Error("Failed to create assessment");
  }

  return assessmentData;
};

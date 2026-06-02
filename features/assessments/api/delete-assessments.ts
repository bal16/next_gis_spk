"use server";
import backendClient from "@/lib/api/server";
// import { publicClient } from "@/lib/api/public";
import type { SuccessResponse } from "@/types/apiResponse";
// import type { TBuilding } from "../type";
// import { buildingsData } from "@/lib/mock/buildings";
// import type { TBuilding } from "@/types/building";

export const deleteAssessment = async (id: string) => {
  // await new Promise((resolve) => setTimeout(resolve, 500));
  const response = await backendClient.delete<SuccessResponse<boolean>>(
    `/buildings/assessments/${id}`,
  );
  const data = response.data;
  const { statusCode, data: isDeleted } = data;

  if (statusCode !== 200) {
    throw new Error("Failed to delete assessment");
  }

  return isDeleted;
};

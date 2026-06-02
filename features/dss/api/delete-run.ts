"use server";
// import { publicClient } from "@/lib/api/public";
import type { SuccessResponse } from "@/types/apiResponse";
// import type { TBuilding } from "../type";
import backendClient from "@/lib/api/server";
import type { TGetResultsResponse } from "../type";
// import { buildingsData } from "@/lib/mock/buildings";
// import type { TBuilding } from "@/types/building";

export const deleteRun = async (id: TGetResultsResponse["id"]) => {
  // await new Promise((resolve) => setTimeout(resolve, 500));
  const response = await backendClient.delete<SuccessResponse<boolean>>(
    `/dss/runs/${id}`,
  );
  const runData = response.data;
  const { statusCode, data: isDeleted } = runData;

  if (statusCode !== 200) {
    throw new Error("Failed to delete run");
  }

  return isDeleted;
};

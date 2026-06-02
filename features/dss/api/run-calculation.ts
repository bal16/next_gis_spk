"use server";
// import { publicClient } from "@/lib/api/public";
import type { SuccessResponse } from "@/types/apiResponse";
// import type { TCreateBuilding, TCreateBuildingResponse } from "../type";
import backendClient from "@/lib/api/server";
// import { buildingsData } from "@/lib/mock/buildings";
// import type { TBuilding } from "@/types/building";

export const runCalculation = async () => {
  // await new Promise((resolve) => setTimeout(resolve, 500));
  const response =
    await backendClient.post<SuccessResponse<boolean>>("/dss/calculate");
  const runData = response.data;
  const { statusCode, data: isSuccess } = runData;

  if (statusCode !== 200 || !isSuccess) {
    throw new Error("Failed to create building");
  }

  return isSuccess;
};

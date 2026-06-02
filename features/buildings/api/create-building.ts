"use server";
// import { publicClient } from "@/lib/api/public";
import type { SuccessResponse } from "@/types/apiResponse";
import type { TCreateBuilding, TCreateBuildingResponse } from "../type";
import backendClient from "@/lib/api/server";
// import { buildingsData } from "@/lib/mock/buildings";
// import type { TBuilding } from "@/types/building";

export const createBuilding = async (data: TCreateBuilding) => {
  // await new Promise((resolve) => setTimeout(resolve, 500));
  const response = await backendClient.post<
    SuccessResponse<TCreateBuildingResponse>
  >("/buildings", data);
  const buildingData = response.data;
  const { statusCode, data: buildings } = buildingData;

  if (statusCode !== 201) {
    throw new Error("Failed to create building");
  }

  return buildings;
};

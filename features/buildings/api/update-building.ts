"use server";
// import { publicClient } from "@/lib/api/public";
import type { SuccessResponse } from "@/types/apiResponse";
import type {
  TBuilding,
  TCreateBuildingResponse,
  TUpdateBuilding,
} from "../type";
import backendClient from "@/lib/api/server";
// import { buildingsData } from "@/lib/mock/buildings";
// import type { TBuilding } from "@/types/building";

type TUpdateBuildingResponse = TCreateBuildingResponse;

export const updateBuilding = async (
  data: TUpdateBuilding,
  id: TBuilding["id"],
) => {
  // await new Promise((resolve) => setTimeout(resolve, 500));
  const response = await backendClient.put<
    SuccessResponse<TUpdateBuildingResponse>
  >(`/buildings/${id}`, data);
  const buildingData = response.data;
  const { statusCode, data: buildings } = buildingData;

  if (statusCode !== 200) {
    throw new Error("Failed to update building");
  }

  return buildings;
};

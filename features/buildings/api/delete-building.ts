"use server";
// import { publicClient } from "@/lib/api/public";
import type { SuccessResponse } from "@/types/apiResponse";
import type { TBuilding } from "../type";
import backendClient from "@/lib/api/server";
// import { buildingsData } from "@/lib/mock/buildings";
// import type { TBuilding } from "@/types/building";

export const deleteBuilding = async (id: TBuilding["id"]) => {
  // await new Promise((resolve) => setTimeout(resolve, 500));
  const response = await backendClient.delete<SuccessResponse<boolean>>(
    `/buildings/${id}`
  );
  const buildingData = response.data;
  const { statusCode, data: isDeleted } = buildingData;

  if (statusCode !== 200) {
    throw new Error("Failed to delete building");
  }

  return isDeleted;
};

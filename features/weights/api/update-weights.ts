"use server";
import backendClient from "@/lib/api/server";
import type { SuccessResponse } from "@/types/apiResponse";

type TUpdateWeightsResponse = {
  statusCode: number;
  data: boolean;
};

export type TWeight = {
  key: string;
  name: string;
  value: number;
  type: string;
  subWeightFrom?: string;
  subWeights?: TWeight[];
};

type TUpdateWeights = {
  weights: TWeight[];
};

export const updateWeights = async (data: TUpdateWeights) => {
  // await new Promise((resolve) => setTimeout(resolve, 500));
  const response = await backendClient.put<
    SuccessResponse<TUpdateWeightsResponse>
  >("/dss/weights", data );
  const weightsData = response.data;
  const { statusCode, data: isUpdated } = weightsData;

  if (statusCode !== 200) {
    throw new Error("Failed to update building");
  }

  return isUpdated;
};

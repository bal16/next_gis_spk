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

const EPSILON = 0.001;

function validateWeightsPayload(payload: TUpdateWeights) {
  if (
    !payload?.weights ||
    !Array.isArray(payload.weights) ||
    payload.weights.length === 0
  ) {
    throw new Error("Payload weights tidak boleh kosong");
  }
  const mainTotal = payload.weights.reduce(
    (sum, w) => sum + (Number(w.value) || 0),
    0
  );
  if (Math.abs(mainTotal - 1.0) >= EPSILON) {
    throw new Error("Total bobot utama harus 100%");
  }
  for (const main of payload.weights) {
    if (
      Number.isNaN(Number(main.value)) ||
      Number(main.value) < 0 ||
      Number(main.value) > 1
    ) {
      throw new Error(`Nilai bobot ${main.key} harus 0.00–1.00`);
    }
    if (main.subWeights?.length) {
      const subTotal = main.subWeights.reduce(
        (s, sw) => s + (Number(sw.value) || 0),
        0
      );
      if (Math.abs(subTotal - 1.0) >= EPSILON) {
        throw new Error(`Total sub bobot ${main.key} harus 100%`);
      }
      for (const sub of main.subWeights) {
        if (
          Number.isNaN(Number(sub.value)) ||
          Number(sub.value) < 0 ||
          Number(sub.value) > 1
        ) {
          throw new Error(`Nilai sub bobot ${sub.key} harus 0.00–1.00`);
        }
      }
    }
  }
}

export const updateWeights = async (data: TUpdateWeights) => {
  validateWeightsPayload(data);
  // await new Promise((resolve) => setTimeout(resolve, 500));
  const response = await backendClient.put<
    SuccessResponse<TUpdateWeightsResponse>
  >("/dss/weights", data);
  const weightsData = response.data;
  const { statusCode, data: isUpdated } = weightsData;

  if (statusCode !== 200) {
    throw new Error("Failed to update weights");
  }

  return isUpdated;
};

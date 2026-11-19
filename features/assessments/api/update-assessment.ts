"use server";

import backendClient from "@/lib/api/server";
import type { SuccessResponse } from "@/types/apiResponse";
import type { TCreateAssessment } from "../type";

export const updateAssessment = async (
  buildingCode: string,
  assessmentId: string,
  data: TCreateAssessment
) => {
  const response = await backendClient.put<SuccessResponse<boolean>>(
    `/buildings/${buildingCode}/assessments/${assessmentId}`,
    {
      ...data,
      lastMaintenance: data.lastMaintenance ?? null,
    }
  );

  const { statusCode, data: isUpdated } = response.data;

  if (statusCode !== 200) {
    throw new Error("Failed to update assessment");
  }

  return isUpdated;
};

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createAssessment } from "../api/create-assessments";
import { deleteAssessment } from "../api/delete-assessments";
import type { TCreateAssessment } from "../../assessments/type";
import type {
  TGetBuildingAssessmentsResponse,
  TAssessment,
} from "../../buildings/type";

export const useCreateAssessment = (
  buildingCode: string,
  onSuccessCallback?: () => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newAssessment: TCreateAssessment) =>
      createAssessment(buildingCode, newAssessment),
    onMutate: async (newAssessment) => {
      await queryClient.cancelQueries({
        queryKey: ["building-assessments", buildingCode],
      });

      const previousData =
        queryClient.getQueryData<TGetBuildingAssessmentsResponse>([
          "building-assessments",
          buildingCode,
        ]);

      if (previousData) {
        queryClient.setQueryData<TGetBuildingAssessmentsResponse>(
          ["building-assessments", buildingCode],
          {
            ...previousData,
            assessments: [
              ...previousData.assessments,
              {
                ...newAssessment,
                id: `temp-${Date.now()}`,
                lastMaintenance: newAssessment.lastMaintenance
                  ? new Date(newAssessment.lastMaintenance)
                  : null,
              } as TAssessment,
            ],
          }
        );
      }

      return { previousData };
    },
    onError: (err, newAssessment, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ["building-assessments", buildingCode],
          context.previousData
        );
      }
      toast.error(err.message || "Failed to create assessment");
    },
    onSuccess: () => {
      toast.success("Assessment Data Created!");
      onSuccessCallback?.();
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["building-assessments", buildingCode],
      });
    },
  });
};

export const useDeleteAssessment = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAssessment(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["building-assessments"] });

      // Because we might not know the exact buildingCode from just the assessment ID,
      // we iterate over all building-assessments caches and optimistically remove it.
      const allQueries =
        queryClient.getQueriesData<TGetBuildingAssessmentsResponse>({
          queryKey: ["building-assessments"],
        });

      const previousDataMap = new Map();

      allQueries.forEach(([queryKey, data]) => {
        if (data) {
          previousDataMap.set(queryKey, data);
          queryClient.setQueryData<TGetBuildingAssessmentsResponse>(queryKey, {
            ...data,
            assessments: data.assessments.filter(
              (assessment) => assessment.id !== id
            ),
          });
        }
      });

      return { previousDataMap };
    },
    onError: (err, id, context) => {
      if (context?.previousDataMap) {
        context.previousDataMap.forEach((data, queryKey) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(err.message || "Failed to delete assessment");
    },
    onSuccess: () => {
      toast.success("Assessment deleted successfully!");
      onSuccessCallback?.();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["building-assessments"] });
    },
  });
};

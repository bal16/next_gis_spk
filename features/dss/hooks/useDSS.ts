"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { runCalculation } from "../api/run-calculation";
import { deleteRun } from "../api/delete-run";
import { deleteRunDetail } from "../api/delete-run-details";
import { queryKeys } from "@/lib/queryKeys";
import type { TGetResultsResponse } from "../type";

export const useRunCalculation = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => runCalculation(),
    onMutate: () => {
      toast.info("Calculating.....");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to run calculation");
    },
    onSuccess: () => {
      toast.success("Run Success!");
      onSuccessCallback?.();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["dss"] });
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.dss.latest() });
    },
  });
};

export const useDeleteRun = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRun(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["dss"] });
      const previousData = queryClient.getQueryData<TGetResultsResponse[]>([
        "dss",
      ]);

      if (previousData) {
        queryClient.setQueryData<TGetResultsResponse[]>(
          ["dss"],
          previousData.filter((run) => run.id !== id)
        );
      }

      return { previousData };
    },
    onError: (err, id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["dss"], context.previousData);
      }
      toast.error(err.message || "Failed to delete run");
    },
    onSuccess: () => {
      toast.success("Run deleted successfully!");
      onSuccessCallback?.();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["dss"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.dss.latest() });
    },
  });
};

export const useDeleteRunDetail = (
  runId: string,
  onSuccessCallback?: () => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (detailId: string) => deleteRunDetail(detailId),
    onMutate: async (detailId) => {
      await queryClient.cancelQueries({ queryKey: ["dss-details", runId] });
      const previousData = queryClient.getQueryData<TGetResultsResponse>([
        "dss-details",
        runId,
      ]);

      if (previousData) {
        queryClient.setQueryData<TGetResultsResponse>(["dss-details", runId], {
          ...previousData,
          sawRunDetails: previousData.sawRunDetails.filter(
            (detail) => detail.id !== detailId
          ),
        });
      }

      return { previousData };
    },
    onError: (err, detailId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["dss-details", runId], context.previousData);
      }
      toast.error(err.message || "Failed to delete run detail");
    },
    onSuccess: () => {
      toast.success("Run detail deleted successfully!");
      onSuccessCallback?.();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["dss-details", runId] });
      queryClient.invalidateQueries({ queryKey: queryKeys.dss.latest() });
    },
  });
};

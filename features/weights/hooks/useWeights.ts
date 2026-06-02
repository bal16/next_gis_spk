"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateWeights, type TWeight } from "../api/update-weights";

export const useUpdateWeights = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { weights: TWeight[] }) => updateWeights(data),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["weights"] });
      const previousWeights = queryClient.getQueryData<TWeight[]>(["weights"]);

      if (previousWeights) {
        queryClient.setQueryData<TWeight[]>(["weights"], newData.weights);
      }

      return { previousWeights };
    },
    onError: (err, newData, context) => {
      if (context?.previousWeights) {
        queryClient.setQueryData(["weights"], context.previousWeights);
      }
      toast.error(err.message || "Failed to update weights");
    },
    onSuccess: () => {
      toast.success("Weights updated successfully!");
      onSuccessCallback?.();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["weights"] });
    },
  });
};
